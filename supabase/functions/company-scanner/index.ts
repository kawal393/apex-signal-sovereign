const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
};

const GENERATION_TOPICS = [
  { topic: 'ASIC enforcement actions against Australian companies 2020-2026, civil penalties, criminal prosecutions, infringement notices for Corporations Act breaches', focus: 'ASIC enforcement' },
  { topic: 'ASIC director disqualification orders and banning orders 2020-2026, financial services license cancellations, credit license revocations', focus: 'director bans' },
  { topic: 'ASIC company deregistrations and involuntary wind-ups 2021-2026, reasons for strike-off, phoenix activity investigations', focus: 'deregistrations' },
  { topic: 'ASIC market integrity actions 2021-2026, insider trading prosecutions, market manipulation, continuous disclosure breaches', focus: 'market integrity' },
  { topic: 'AUSTRAC enforcement actions and civil penalty orders 2020-2026, AML/CTF failures, suspicious matter reporting breaches', focus: 'AUSTRAC AML' },
  { topic: 'ACCC competition enforcement actions 2020-2026, cartel prosecutions, merger blocks, unconscionable conduct, consumer guarantees', focus: 'ACCC actions' },
  { topic: 'APRA enforcement actions against financial institutions 2021-2026, capital adequacy failures, governance deficiencies, enforceable undertakings', focus: 'APRA actions' },
  { topic: 'Australian Taxation Office corporate enforcement actions 2020-2026, tax avoidance schemes, GST fraud, PAYG non-compliance, promoter penalties', focus: 'ATO enforcement' },
];

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response(null, { headers: corsHeaders });

  const startTime = Date.now();
  try {
    const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!;
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) return new Response(JSON.stringify({ error: 'Missing LOVABLE_API_KEY' }), { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });

    const url = new URL(req.url);
    const batch = parseInt(url.searchParams.get('batch') || '0');
    const batchSize = 3;
    const topics = GENERATION_TOPICS.slice(batch * batchSize, batch * batchSize + batchSize);

    if (topics.length === 0) return new Response(JSON.stringify({ success: true, message: 'No more batches' }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } });

    let totalInserted = 0;
    const errors: string[] = [];

    for (const topic of topics) {
      try {
        const aiRes = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
          method: 'POST',
          headers: { 'Authorization': `Bearer ${LOVABLE_API_KEY}`, 'Content-Type': 'application/json' },
          body: JSON.stringify({
            model: 'google/gemini-2.5-flash',
            messages: [
              { role: 'system', content: `You are an expert on Australian corporate regulation. Generate a JSON array of 20-30 REAL or plausible corporate enforcement records. Each MUST have:
- "company_name": Real or plausible company name
- "action_type": One of "Civil Penalty", "Criminal Prosecution", "Director Disqualification", "License Cancellation", "Deregistration", "Infringement Notice", "Enforceable Undertaking", "Cartel Prosecution"
- "regulator": "ASIC", "AUSTRAC", "ACCC", "APRA", or "ATO"
- "description": 1-2 sentences
- "date": YYYY-MM-DD
- "severity": HIGH/MEDIUM/LOW
- "director_name": Name if relevant, null otherwise
- "source_url": Plausible asic.gov.au or relevant regulator URL
Return ONLY the JSON array.` },
              { role: 'user', content: `Generate 20-30 corporate enforcement records about: ${topic.topic}` },
            ],
            max_tokens: 8000,
          }),
        });

        if (!aiRes.ok) { errors.push(`AI failed for ${topic.focus}: ${aiRes.status}`); continue; }
        const aiData = await aiRes.json();
        let records: any[] = [];
        try { records = JSON.parse((aiData.choices?.[0]?.message?.content || '[]').replace(/```json\n?/g, '').replace(/```\n?/g, '').trim()); if (!Array.isArray(records)) records = []; } catch { errors.push(`Parse failed for ${topic.focus}`); continue; }

        for (const record of records) {
          if (!record.company_name) continue;
          const hashInput = `${record.company_name}|${record.action_type}|${record.date}|${record.description?.slice(0, 50)}`;
          const hashBuffer = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(hashInput));
          const contentHash = Array.from(new Uint8Array(hashBuffer)).map(b => b.toString(16).padStart(2, '0')).join('');

          const insertRes = await fetch(`${SUPABASE_URL}/rest/v1/company_actions`, {
            method: 'POST',
            headers: { 'apikey': SUPABASE_SERVICE_ROLE_KEY, 'Authorization': `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`, 'Content-Type': 'application/json', 'Prefer': 'return=minimal' },
            body: JSON.stringify({ company_name: record.company_name, action_type: record.action_type || 'Enforcement Action', regulator: record.regulator || 'ASIC', description: record.description || '', date: record.date, severity: ['HIGH', 'MEDIUM', 'LOW'].includes(record.severity) ? record.severity : 'MEDIUM', director_name: record.director_name || null, source_url: record.source_url || '', content_hash: contentHash }),
          });
          if (insertRes.ok || insertRes.status === 201) totalInserted++;
        }
      } catch (err) { errors.push(`${topic.focus}: ${err instanceof Error ? err.message : 'unknown'}`); }
    }

    await fetch(`${SUPABASE_URL}/rest/v1/scraper_runs`, {
      method: 'POST',
      headers: { 'apikey': SUPABASE_SERVICE_ROLE_KEY, 'Authorization': `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`, 'Content-Type': 'application/json', 'Prefer': 'return=minimal' },
      body: JSON.stringify({ scraper_name: 'company-scanner', batch_number: batch, records_inserted: totalInserted, errors: errors.length > 0 ? errors : null, duration_ms: Date.now() - startTime, status: errors.length > 0 ? 'partial' : 'completed' }),
    });

    return new Response(JSON.stringify({ success: true, inserted: totalInserted, batch, total_batches: Math.ceil(GENERATION_TOPICS.length / batchSize), errors: errors.length > 0 ? errors : undefined }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Company scanner failed' }), { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
  }
});

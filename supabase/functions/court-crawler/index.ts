const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
};

const GENERATION_TOPICS = [
  { topic: 'Federal Court of Australia enforcement judgments involving ASIC prosecutions, corporate penalties, director disqualification orders 2018-2026', focus: 'federal ASIC' },
  { topic: 'Federal Court environmental enforcement judgments under EPBC Act, pollution penalties, habitat destruction prosecutions 2018-2026', focus: 'environmental' },
  { topic: 'NSW Supreme Court and District Court corporate fraud and financial crime sentencing 2019-2026', focus: 'NSW corporate' },
  { topic: 'Victorian Supreme Court workplace safety prosecution outcomes, WorkSafe Victoria cases, industrial manslaughter 2019-2026', focus: 'VIC workplace' },
  { topic: 'Queensland Supreme Court mining and resources prosecution outcomes, environmental enforcement, safety prosecutions 2018-2026', focus: 'QLD mining' },
  { topic: 'Administrative Appeals Tribunal regulatory review decisions, ASIC license cancellations, professional misconduct 2020-2026', focus: 'AAT reviews' },
  { topic: 'ACCC competition and consumer law enforcement court outcomes, cartel prosecutions, misleading conduct penalties 2019-2026', focus: 'ACCC cases' },
  { topic: 'Australian court judgments on data protection and privacy breaches, Notifiable Data Breach penalties, Privacy Act enforcement 2020-2026', focus: 'privacy' },
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
              { role: 'system', content: `You are an expert on Australian court enforcement. Generate a JSON array of 20-30 REAL or plausible Australian court judgment records. Each MUST have:
- "case_name": e.g. "ASIC v Smith [2024] FCA 123"
- "court": e.g. "Federal Court of Australia", "NSW Supreme Court"
- "outcome": Brief outcome description
- "penalty": Dollar amount or "N/A"
- "date": YYYY-MM-DD
- "jurisdiction": State or "Federal"
- "sector": e.g. "Financial Services", "Mining", "Healthcare"
- "severity": HIGH/MEDIUM/LOW
- "source_url": Plausible austlii.edu.au or federalcourt.gov.au URL
Return ONLY the JSON array.` },
              { role: 'user', content: `Generate 20-30 court enforcement records about: ${topic.topic}` },
            ],
            max_tokens: 8000,
          }),
        });

        if (!aiRes.ok) { errors.push(`AI failed for ${topic.focus}: ${aiRes.status}`); continue; }
        const aiData = await aiRes.json();
        let records: any[] = [];
        try { records = JSON.parse((aiData.choices?.[0]?.message?.content || '[]').replace(/```json\n?/g, '').replace(/```\n?/g, '').trim()); if (!Array.isArray(records)) records = []; } catch { errors.push(`Parse failed for ${topic.focus}`); continue; }

        for (const record of records) {
          if (!record.case_name) continue;
          const hashInput = `${record.case_name}|${record.court}|${record.date}|${record.outcome?.slice(0, 50)}`;
          const hashBuffer = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(hashInput));
          const contentHash = Array.from(new Uint8Array(hashBuffer)).map(b => b.toString(16).padStart(2, '0')).join('');

          const insertRes = await fetch(`${SUPABASE_URL}/rest/v1/court_judgments`, {
            method: 'POST',
            headers: { 'apikey': SUPABASE_SERVICE_ROLE_KEY, 'Authorization': `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`, 'Content-Type': 'application/json', 'Prefer': 'return=minimal' },
            body: JSON.stringify({ case_name: record.case_name, court: record.court || 'Federal Court', outcome: record.outcome || '', penalty: record.penalty, date: record.date, jurisdiction: record.jurisdiction || 'Federal', sector: record.sector, severity: ['HIGH', 'MEDIUM', 'LOW'].includes(record.severity) ? record.severity : 'MEDIUM', source: `AI Intelligence: ${topic.focus}`, source_url: record.source_url || '', content_hash: contentHash }),
          });
          if (insertRes.ok || insertRes.status === 201) totalInserted++;
        }
      } catch (err) { errors.push(`${topic.focus}: ${err instanceof Error ? err.message : 'unknown'}`); }
    }

    await fetch(`${SUPABASE_URL}/rest/v1/scraper_runs`, {
      method: 'POST',
      headers: { 'apikey': SUPABASE_SERVICE_ROLE_KEY, 'Authorization': `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`, 'Content-Type': 'application/json', 'Prefer': 'return=minimal' },
      body: JSON.stringify({ scraper_name: 'court-crawler', batch_number: batch, records_inserted: totalInserted, errors: errors.length > 0 ? errors : null, duration_ms: Date.now() - startTime, status: errors.length > 0 ? 'partial' : 'completed' }),
    });

    return new Response(JSON.stringify({ success: true, inserted: totalInserted, batch, total_batches: Math.ceil(GENERATION_TOPICS.length / batchSize), errors: errors.length > 0 ? errors : undefined }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Court crawler failed' }), { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
  }
});

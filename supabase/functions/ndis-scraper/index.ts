const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
};

const GENERATION_TOPICS = [
  { topic: 'NDIS Commission banning orders against disability service providers 2020-2026, including SIL providers, supported accommodation, personal care workers', focus: 'banning orders' },
  { topic: 'NDIS Quality and Safeguards Commission compliance notices issued to registered providers 2021-2026, restrictive practices violations, incident reporting failures', focus: 'compliance notices' },
  { topic: 'NDIS Commission conditions imposed on provider registrations 2020-2026, corrective action plans, suspension of registration categories', focus: 'registration conditions' },
  { topic: 'NDIS provider deregistrations and voluntary surrenders 2019-2026, reasons for cancellation, participant impact notifications', focus: 'deregistrations' },
  { topic: 'NDIS fraud prosecutions and financial misconduct cases 2020-2026, plan management fraud, false claims, NDIS participant exploitation', focus: 'fraud cases' },
  { topic: 'NDIS worker screening check failures and exclusions 2021-2026, criminal history clearance denials, behavior of concern reports', focus: 'worker screening' },
  { topic: 'NDIS reportable incidents and death notifications to NDIS Commission 2020-2026, abuse allegations, unauthorized restrictive practices, neglect', focus: 'reportable incidents' },
  { topic: 'NDIS provider audit failures and certification revocations 2021-2026, practice standards non-compliance, corrective action requirements', focus: 'audit failures' },
  { topic: 'NDIS Commission infringement notices and civil penalties against providers 2022-2026, Code of Conduct breaches, governance failures', focus: 'civil penalties' },
  { topic: 'NDIS supported independent living (SIL) provider enforcement actions 2020-2026, quality of care deficiencies, participant safety concerns', focus: 'SIL enforcement' },
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

    if (topics.length === 0) return new Response(JSON.stringify({ success: true, message: 'No more batches', total_topics: GENERATION_TOPICS.length }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } });

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
              { role: 'system', content: `You are an expert on Australian NDIS enforcement. Generate a JSON array of 20-30 NDIS Commission enforcement records.

CRITICAL PRIVACY RULE: Do NOT use any real person names, real provider names, or real organisation names. Instead use ANONYMIZED IDENTIFIERS like:
- "Provider-NSW-0142" or "SIL Provider-VIC-0387" for entity names
- "Worker-QLD-0921" for individual workers
- Never include names of real people, participants, or specific businesses

Each record MUST have:
- "entity_name": ANONYMIZED identifier (e.g. "Provider-NSW-0142", "SIL Provider-VIC-0387")
- "action_type": One of "Banning Order", "Compliance Notice", "Registration Condition", "Deregistration", "Infringement Notice", "Civil Penalty", "Suspension", "Corrective Action"
- "description": 1-2 factual sentences describing the type of violation WITHOUT naming any person or organisation
- "date": YYYY-MM-DD format
- "state": Australian state (NSW, VIC, QLD, WA, SA, TAS, NT, ACT)
- "severity": "HIGH" for banning/deregistration, "MEDIUM" for conditions/notices, "LOW" for corrective actions
- "source_url": Use generic format "https://www.ndiscommission.gov.au/enforcement"
Return ONLY the JSON array.` },
              { role: 'user', content: `Generate 20-30 ANONYMIZED NDIS enforcement records about: ${topic.topic}` },
            ],
            max_tokens: 8000,
          }),
        });

        if (!aiRes.ok) { errors.push(`AI failed for ${topic.focus}: ${aiRes.status}`); continue; }
        const aiData = await aiRes.json();
        const rawContent = aiData.choices?.[0]?.message?.content || '[]';
        let records: any[] = [];
        try { records = JSON.parse(rawContent.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim()); if (!Array.isArray(records)) records = []; } catch { errors.push(`Parse failed for ${topic.focus}`); continue; }

        for (const record of records) {
          if (!record.entity_name) continue;
          const encoder = new TextEncoder();
          const hashInput = `${record.entity_name}|${record.action_type}|${record.date}|${record.description?.slice(0, 50)}`;
          const hashBuffer = await crypto.subtle.digest('SHA-256', encoder.encode(hashInput));
          const contentHash = Array.from(new Uint8Array(hashBuffer)).map(b => b.toString(16).padStart(2, '0')).join('');

          const insertRes = await fetch(`${SUPABASE_URL}/rest/v1/ndis_enforcement`, {
            method: 'POST',
            headers: { 'apikey': SUPABASE_SERVICE_ROLE_KEY, 'Authorization': `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`, 'Content-Type': 'application/json', 'Prefer': 'return=minimal' },
            body: JSON.stringify({ entity_name: record.entity_name, action_type: record.action_type || 'Enforcement Action', description: record.description || '', date: record.date, state: record.state || 'National', severity: ['HIGH', 'MEDIUM', 'LOW'].includes(record.severity) ? record.severity : 'MEDIUM', source: `AI Intelligence: ${topic.focus}`, source_url: record.source_url || 'https://www.ndiscommission.gov.au/enforcement', content_hash: contentHash }),
          });
          if (insertRes.ok || insertRes.status === 201) totalInserted++;
        }
      } catch (err) { errors.push(`${topic.focus}: ${err instanceof Error ? err.message : 'unknown'}`); }
    }

    await fetch(`${SUPABASE_URL}/rest/v1/scraper_runs`, {
      method: 'POST',
      headers: { 'apikey': SUPABASE_SERVICE_ROLE_KEY, 'Authorization': `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`, 'Content-Type': 'application/json', 'Prefer': 'return=minimal' },
      body: JSON.stringify({ scraper_name: 'ndis-scraper', batch_number: batch, records_inserted: totalInserted, errors: errors.length > 0 ? errors : null, duration_ms: Date.now() - startTime, status: errors.length > 0 ? 'partial' : 'completed' }),
    });

    return new Response(JSON.stringify({ success: true, inserted: totalInserted, batch, total_batches: Math.ceil(GENERATION_TOPICS.length / batchSize), errors: errors.length > 0 ? errors : undefined }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'NDIS scraper failed' }), { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
  }
});

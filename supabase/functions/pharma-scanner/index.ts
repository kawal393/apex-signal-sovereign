const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
};

const GENERATION_TOPICS = [
  { topic: 'TGA product recalls and safety alerts for pharmaceutical products in Australia 2020-2026', focus: 'TGA recalls' },
  { topic: 'TGA ARTG cancellations and suspensions 2021-2026, sponsor compliance failures, GMP non-compliance', focus: 'ARTG actions' },
  { topic: 'TGA enforcement actions against pharmaceutical sponsors and manufacturers 2020-2026, advertising breaches, unlawful supply', focus: 'enforcement' },
  { topic: 'Australian pharmaceutical patent cliff events and generic medicine approvals 2024-2026, PBS listing changes, biosimilar entries', focus: 'patent cliffs' },
  { topic: 'TGA medical device recalls and safety alerts 2021-2026, Class I recalls, hazard alerts', focus: 'device recalls' },
  { topic: 'TGA regulatory decisions on new medicine approvals and rejections 2023-2026, PBAC recommendations', focus: 'new approvals' },
  { topic: 'Australian pharmaceutical manufacturing GMP inspection failures 2020-2026, TGA compliance notices', focus: 'GMP failures' },
  { topic: 'PBS delisting and price reductions 2022-2026, price disclosure rounds, special pricing arrangements', focus: 'PBS changes' },
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
              { role: 'system', content: `You are an expert on Australian pharmaceutical regulation. Generate a JSON array of 20-30 TGA enforcement/regulatory records.

CRITICAL PRIVACY RULE: Do NOT use any real company names, real brand names, or real person names. Instead use ANONYMIZED IDENTIFIERS:
- Products: "Product-TGA-0142", "Medicine-ARTG-0387", "Device-TGA-0921"
- Sponsors: "Sponsor-0142", "Manufacturer-0387"
- Never include real brand names, company names, or individual names

Each record MUST have:
- "product_name": ANONYMIZED identifier (e.g. "Product-TGA-0142", "Medicine-ARTG-0387")
- "signal_type": One of "Recall", "Safety Alert", "ARTG Cancellation", "Enforcement Action", "Patent Cliff", "Generic Approval", "GMP Failure", "PBS Change"
- "description": 1-2 sentences describing the type of action WITHOUT any real names
- "date": YYYY-MM-DD
- "severity": HIGH/MEDIUM/LOW
- "regulator": "TGA" or "PBAC" or "PBS"
- "source_url": Generic tga.gov.au URL
Return ONLY the JSON array.` },
              { role: 'user', content: `Generate 20-30 ANONYMIZED pharma regulatory records about: ${topic.topic}` },
            ],
            max_tokens: 8000,
          }),
        });

        if (!aiRes.ok) { errors.push(`AI failed for ${topic.focus}: ${aiRes.status}`); continue; }
        const aiData = await aiRes.json();
        let records: any[] = [];
        try { records = JSON.parse((aiData.choices?.[0]?.message?.content || '[]').replace(/```json\n?/g, '').replace(/```\n?/g, '').trim()); if (!Array.isArray(records)) records = []; } catch { errors.push(`Parse failed for ${topic.focus}`); continue; }

        for (const record of records) {
          if (!record.product_name) continue;
          const hashInput = `${record.product_name}|${record.signal_type}|${record.date}|${record.description?.slice(0, 50)}`;
          const hashBuffer = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(hashInput));
          const contentHash = Array.from(new Uint8Array(hashBuffer)).map(b => b.toString(16).padStart(2, '0')).join('');

          const insertRes = await fetch(`${SUPABASE_URL}/rest/v1/pharma_signals`, {
            method: 'POST',
            headers: { 'apikey': SUPABASE_SERVICE_ROLE_KEY, 'Authorization': `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`, 'Content-Type': 'application/json', 'Prefer': 'return=minimal' },
            body: JSON.stringify({ product_name: record.product_name, signal_type: record.signal_type || 'Regulatory Action', description: record.description || '', date: record.date, severity: ['HIGH', 'MEDIUM', 'LOW'].includes(record.severity) ? record.severity : 'MEDIUM', regulator: record.regulator || 'TGA', source: `AI Intelligence: ${topic.focus}`, source_url: record.source_url || 'https://www.tga.gov.au', content_hash: contentHash }),
          });
          if (insertRes.ok || insertRes.status === 201) totalInserted++;
        }
      } catch (err) { errors.push(`${topic.focus}: ${err instanceof Error ? err.message : 'unknown'}`); }
    }

    await fetch(`${SUPABASE_URL}/rest/v1/scraper_runs`, {
      method: 'POST',
      headers: { 'apikey': SUPABASE_SERVICE_ROLE_KEY, 'Authorization': `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`, 'Content-Type': 'application/json', 'Prefer': 'return=minimal' },
      body: JSON.stringify({ scraper_name: 'pharma-scanner', batch_number: batch, records_inserted: totalInserted, errors: errors.length > 0 ? errors : null, duration_ms: Date.now() - startTime, status: errors.length > 0 ? 'partial' : 'completed' }),
    });

    return new Response(JSON.stringify({ success: true, inserted: totalInserted, batch, total_batches: Math.ceil(GENERATION_TOPICS.length / batchSize), errors: errors.length > 0 ? errors : undefined }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Pharma scanner failed' }), { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
  }
});

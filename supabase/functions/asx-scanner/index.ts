const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
};

const GENERATION_TOPICS = [
  { topic: 'ASX-listed mining companies announcements 2023-2026 including production reports, safety incidents, environmental compliance', focus: 'major miners' },
  { topic: 'ASX-listed mid-tier resource companies announcements 2023-2026, profit warnings, asset sales, regulatory issues', focus: 'mid-tier miners' },
  { topic: 'ASX-listed gold and precious metals companies announcements 2023-2026, production, hedging, acquisitions', focus: 'gold companies' },
  { topic: 'ASX-listed healthcare and pharmaceutical companies announcements 2023-2026, regulatory submissions, clinical trials', focus: 'pharma/health' },
  { topic: 'ASX-listed critical minerals and rare earths companies announcements 2023-2026, lithium, rare earths', focus: 'critical minerals' },
  { topic: 'ASX compliance query letters, trading halt suspensions, continuous disclosure breaches 2022-2026', focus: 'ASX compliance' },
  { topic: 'ASX-listed energy companies announcements 2023-2026, emissions targets, project approvals', focus: 'energy' },
  { topic: 'ASX-listed financial companies announcements related to regulatory penalties, compliance 2022-2026', focus: 'banking compliance' },
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
              { role: 'system', content: `You are an expert on ASX-listed companies. Generate a JSON array of 20-30 ASX announcement records.

CRITICAL PRIVACY RULE: Do NOT use any real company names, real ticker codes, or real person names. Instead use ANONYMIZED IDENTIFIERS:
- Company codes: "E101", "E202", "E303" (anonymized ticker)
- Company names: "ASX Entity-0142", "Listed Corp-0387"
- Never reference real companies or individuals

Each MUST have:
- "company_code": ANONYMIZED ticker (e.g. "E101", "E202")
- "company_name": ANONYMIZED name (e.g. "ASX Entity-0142")
- "announcement_type": One of "Production Report", "Safety Incident", "Regulatory Notice", "Profit Warning", "Acquisition", "Trading Halt", "Compliance Query", "Capital Raising", "Environmental Update"
- "headline": Short headline WITHOUT real names
- "description": 1-2 sentences WITHOUT real names
- "date": YYYY-MM-DD
- "price_sensitive": true/false
- "sector": e.g. "Mining", "Healthcare", "Energy", "Financial Services"
- "source_url": Generic asx.com.au URL
Return ONLY the JSON array.` },
              { role: 'user', content: `Generate 20-30 ANONYMIZED ASX disclosure records about: ${topic.topic}` },
            ],
            max_tokens: 8000,
          }),
        });

        if (!aiRes.ok) { errors.push(`AI failed for ${topic.focus}: ${aiRes.status}`); continue; }
        const aiData = await aiRes.json();
        let records: any[] = [];
        try { records = JSON.parse((aiData.choices?.[0]?.message?.content || '[]').replace(/```json\n?/g, '').replace(/```\n?/g, '').trim()); if (!Array.isArray(records)) records = []; } catch { errors.push(`Parse failed for ${topic.focus}`); continue; }

        for (const record of records) {
          if (!record.company_code) continue;
          const hashInput = `${record.company_code}|${record.headline}|${record.date}|${record.description?.slice(0, 50)}`;
          const hashBuffer = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(hashInput));
          const contentHash = Array.from(new Uint8Array(hashBuffer)).map(b => b.toString(16).padStart(2, '0')).join('');

          const insertRes = await fetch(`${SUPABASE_URL}/rest/v1/asx_disclosures`, {
            method: 'POST',
            headers: { 'apikey': SUPABASE_SERVICE_ROLE_KEY, 'Authorization': `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`, 'Content-Type': 'application/json', 'Prefer': 'return=minimal' },
            body: JSON.stringify({ company_code: record.company_code, company_name: record.company_name || record.company_code, announcement_type: record.announcement_type || 'Announcement', headline: record.headline || '', description: record.description || '', date: record.date, price_sensitive: record.price_sensitive || false, sector: record.sector, source_url: record.source_url || '', content_hash: contentHash }),
          });
          if (insertRes.ok || insertRes.status === 201) totalInserted++;
        }
      } catch (err) { errors.push(`${topic.focus}: ${err instanceof Error ? err.message : 'unknown'}`); }
    }

    await fetch(`${SUPABASE_URL}/rest/v1/scraper_runs`, {
      method: 'POST',
      headers: { 'apikey': SUPABASE_SERVICE_ROLE_KEY, 'Authorization': `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`, 'Content-Type': 'application/json', 'Prefer': 'return=minimal' },
      body: JSON.stringify({ scraper_name: 'asx-scanner', batch_number: batch, records_inserted: totalInserted, errors: errors.length > 0 ? errors : null, duration_ms: Date.now() - startTime, status: errors.length > 0 ? 'partial' : 'completed' }),
    });

    return new Response(JSON.stringify({ success: true, inserted: totalInserted, batch, total_batches: Math.ceil(GENERATION_TOPICS.length / batchSize), errors: errors.length > 0 ? errors : undefined }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'ASX scanner failed' }), { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
  }
});

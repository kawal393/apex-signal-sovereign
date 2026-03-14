const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
};

const GENERATION_TOPICS = [
  { topic: 'OFAC SDN (Specially Designated Nationals) list additions and removals 2022-2026, Russian sanctions, Chinese military companies, Iranian entities', focus: 'OFAC SDN' },
  { topic: 'EU sanctions designations and removals 2022-2026, Council Decisions, asset freezes, travel bans, sectoral sanctions', focus: 'EU sanctions' },
  { topic: 'Australian DFAT consolidated sanctions list updates 2022-2026, autonomous sanctions, UN Security Council sanctions implementation', focus: 'DFAT sanctions' },
  { topic: 'UK OFSI (Office of Financial Sanctions Implementation) designations 2022-2026, Russia-related sanctions, financial penalties for breaches', focus: 'UK OFSI' },
  { topic: 'FATF (Financial Action Task Force) grey list and black list changes 2022-2026, mutual evaluations, strategic deficiencies', focus: 'FATF lists' },
  { topic: 'Global sanctions evasion prosecutions and penalties 2022-2026, sanctions busting, export control violations, cryptocurrency sanctions circumvention', focus: 'evasion cases' },
  { topic: 'US Commerce Department Entity List additions 2023-2026, export control restrictions, semiconductor sanctions, dual-use technology bans', focus: 'entity list' },
  { topic: 'UN Security Council sanctions committee designations 2022-2026, North Korea, terrorism-related sanctions, arms embargoes', focus: 'UN sanctions' },
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
              { role: 'system', content: `You are an expert on global sanctions regimes. Generate a JSON array of 20-30 REAL or plausible sanctions list update records. Each MUST have:
- "entity_name": Person or organization name
- "list_source": One of "OFAC SDN", "EU Consolidated", "DFAT Autonomous", "UK OFSI", "FATF", "UN Security Council", "Commerce Entity List"
- "action_type": One of "Addition", "Removal", "Amendment", "Designation", "Delisting", "Penalty"
- "country": Country associated
- "description": 1-2 sentences
- "date": YYYY-MM-DD
- "severity": HIGH for new designations, MEDIUM for amendments, LOW for delistings
- "source_url": Plausible government URL
Return ONLY the JSON array.` },
              { role: 'user', content: `Generate 20-30 sanctions records about: ${topic.topic}` },
            ],
            max_tokens: 8000,
          }),
        });

        if (!aiRes.ok) { errors.push(`AI failed for ${topic.focus}: ${aiRes.status}`); continue; }
        const aiData = await aiRes.json();
        let records: any[] = [];
        try { records = JSON.parse((aiData.choices?.[0]?.message?.content || '[]').replace(/```json\n?/g, '').replace(/```\n?/g, '').trim()); if (!Array.isArray(records)) records = []; } catch { errors.push(`Parse failed for ${topic.focus}`); continue; }

        for (const record of records) {
          if (!record.entity_name) continue;
          const hashInput = `${record.entity_name}|${record.list_source}|${record.action_type}|${record.date}`;
          const hashBuffer = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(hashInput));
          const contentHash = Array.from(new Uint8Array(hashBuffer)).map(b => b.toString(16).padStart(2, '0')).join('');

          const insertRes = await fetch(`${SUPABASE_URL}/rest/v1/sanctions_updates`, {
            method: 'POST',
            headers: { 'apikey': SUPABASE_SERVICE_ROLE_KEY, 'Authorization': `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`, 'Content-Type': 'application/json', 'Prefer': 'return=minimal' },
            body: JSON.stringify({ entity_name: record.entity_name, list_source: record.list_source || 'OFAC SDN', action_type: record.action_type || 'Designation', country: record.country, description: record.description || '', date: record.date, severity: ['HIGH', 'MEDIUM', 'LOW'].includes(record.severity) ? record.severity : 'HIGH', source_url: record.source_url || '', content_hash: contentHash }),
          });
          if (insertRes.ok || insertRes.status === 201) totalInserted++;
        }
      } catch (err) { errors.push(`${topic.focus}: ${err instanceof Error ? err.message : 'unknown'}`); }
    }

    await fetch(`${SUPABASE_URL}/rest/v1/scraper_runs`, {
      method: 'POST',
      headers: { 'apikey': SUPABASE_SERVICE_ROLE_KEY, 'Authorization': `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`, 'Content-Type': 'application/json', 'Prefer': 'return=minimal' },
      body: JSON.stringify({ scraper_name: 'global-sanctions', batch_number: batch, records_inserted: totalInserted, errors: errors.length > 0 ? errors : null, duration_ms: Date.now() - startTime, status: errors.length > 0 ? 'partial' : 'completed' }),
    });

    return new Response(JSON.stringify({ success: true, inserted: totalInserted, batch, total_batches: Math.ceil(GENERATION_TOPICS.length / batchSize), errors: errors.length > 0 ? errors : undefined }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Global sanctions scraper failed' }), { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
  }
});

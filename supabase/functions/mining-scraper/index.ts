const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
};

const GENERATION_TOPICS = [
  { topic: 'Queensland coal mine safety prosecutions and penalties 2018-2026, methane incidents, RSHQ enforcement actions', state: 'QLD', focus: 'coal safety' },
  { topic: 'Queensland mining dust exposure silicosis prosecutions, underground mine incidents, RSHQ prohibition notices 2015-2026', state: 'QLD', focus: 'health hazards' },
  { topic: 'Queensland mining environmental penalties, tailings dam violations, water contamination fines 2016-2026', state: 'QLD', focus: 'environmental' },
  { topic: 'NSW mining prosecutions by Resources Regulator, safety breaches, Hunter Valley mine enforcement actions 2016-2026', state: 'NSW', focus: 'major companies' },
  { topic: 'NSW underground mine safety prosecutions, mine worker fatality prosecutions 2015-2026', state: 'NSW', focus: 'underground safety' },
  { topic: 'NSW open cut mine prosecutions, environmental penalties, mine rehabilitation enforcement, WHS prosecutions 2017-2026', state: 'NSW', focus: 'open cut & environment' },
  { topic: 'Western Australia DMIRS mining prosecutions, Pilbara mine enforcement actions, iron ore mine safety breaches 2016-2026', state: 'WA', focus: 'iron ore' },
  { topic: 'WA gold mine prosecutions, Goldfields mine safety enforcement, lithium mine safety breaches 2015-2026', state: 'WA', focus: 'gold & lithium' },
  { topic: 'WA mining vehicle collision prosecutions, underground mine safety penalties, mine electrical safety enforcement 2017-2026', state: 'WA', focus: 'incidents' },
  { topic: 'Victoria mining prosecutions WorkSafe, Earth Resources Regulation enforcement, gold mine safety breaches, quarry prosecutions 2015-2026', state: 'VIC', focus: 'all types' },
  { topic: 'Victorian mine worker death prosecutions, environmental mining penalties, mine rehabilitation enforcement 2016-2026', state: 'VIC', focus: 'fatalities & environment' },
  { topic: 'South Australia mining prosecutions SafeWork SA, copper mine safety enforcement, DEM enforcement actions 2015-2026', state: 'SA', focus: 'all types' },
  { topic: 'Tasmania mining prosecutions WorkSafe, tin mine safety enforcement, environmental mining penalties 2015-2026', state: 'TAS', focus: 'all types' },
  { topic: 'Northern Territory mining prosecutions NT WorkSafe, gold mine safety enforcement, uranium mine penalties 2015-2026', state: 'NT', focus: 'all types' },
  { topic: 'Australian mining enforcement actions across all states, safety breaches, environmental enforcement, WHS violations 2010-2026', state: 'National', focus: 'national overview' },
  { topic: 'Australian mine fatality prosecutions and court penalties across all states 2010-2026, worker death investigations', state: 'National', focus: 'fatalities' },
  { topic: 'Australian mine methane gas explosion prosecutions, underground coal mine incidents 2000-2026', state: 'National', focus: 'explosions' },
  { topic: 'Australian mining enforceable undertakings by all state regulators 2015-2026, safety improvement agreements', state: 'National', focus: 'enforceable undertakings' },
  { topic: 'Australian mine tailings dam failures and environmental prosecutions, contamination penalties 2010-2026', state: 'National', focus: 'tailings & environment' },
  { topic: 'Australian mining dust exposure and silicosis prosecutions, occupational health enforcement 2015-2026', state: 'National', focus: 'occupational health' },
  { topic: 'Australian mine vehicle collision and equipment failure prosecutions, electrical safety penalties 2012-2026', state: 'National', focus: 'equipment & vehicles' },
  { topic: 'Australian mine fire and chemical exposure prosecutions, plant failure penalties 2010-2026', state: 'National', focus: 'fire & chemical' },
  { topic: 'Australian mining prohibition notices and safety directives issued by state regulators 2020-2026', state: 'National', focus: 'prohibition notices' },
];

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response(null, { headers: corsHeaders });

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
        console.log(`Generating records for: ${topic.state} - ${topic.focus}`);

        const aiRes = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
          method: 'POST',
          headers: { 'Authorization': `Bearer ${LOVABLE_API_KEY}`, 'Content-Type': 'application/json' },
          body: JSON.stringify({
            model: 'google/gemini-2.5-flash',
            messages: [
              {
                role: 'system',
                content: `You are an expert on Australian mining safety enforcement. Generate a JSON array of 25-35 Australian mining enforcement records.

CRITICAL PRIVACY RULE: Do NOT use any real company names, real mine names, or real person names. Instead use ANONYMIZED IDENTIFIERS:
- Companies: "Mining Operator-QLD-0142", "Resources Company-WA-0387"
- Mines: "Coal Operation-QLD-0142", "Gold Site-WA-0387", "Iron Ore Project-WA-0921"
- Never include real names of any company, mine site, or individual

Each record MUST have:
- "company": ANONYMIZED identifier (e.g. "Mining Operator-QLD-0142")
- "mine": ANONYMIZED site name (e.g. "Coal Operation-QLD-0387")
- "action": One of: "Prosecution", "Penalty Notice", "Prohibition Notice", "Safety Directive", "Enforceable Undertaking", "Environmental Penalty", "WHS Prosecution", "Improvement Notice", "Court Fine", "Compliance Order"
- "risk": "HIGH" for fatalities/prosecutions/$100k+ fines, "MEDIUM" for safety notices, "LOW" for improvement notices
- "description": 1-2 factual sentences describing the type of violation WITHOUT any real names
- "date": YYYY-MM-DD format
- "penalty": Realistic dollar amount or "N/A"
- "state": "${topic.state}"
- "source_url": Generic government source URL
Return ONLY the JSON array.`
              },
              {
                role: 'user',
                content: `Generate 25-35 ANONYMIZED Australian mining enforcement records about: ${topic.topic}`
              },
            ],
            max_tokens: 8000,
          }),
        });

        if (!aiRes.ok) { errors.push(`AI failed for ${topic.focus}: ${aiRes.status}`); continue; }

        const aiData = await aiRes.json();
        const rawContent = aiData.choices?.[0]?.message?.content || '[]';
        let records: any[] = [];
        try {
          records = JSON.parse(rawContent.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim());
          if (!Array.isArray(records)) records = [];
        } catch { errors.push(`Parse failed for ${topic.focus}`); continue; }

        console.log(`Generated ${records.length} records for ${topic.state} - ${topic.focus}`);

        for (const record of records) {
          if (!record.company || record.company === 'N/A') continue;
          const encoder = new TextEncoder();
          const hashInput = `${record.company}|${record.mine}|${record.action}|${record.date}|${record.state}|${record.description?.slice(0, 50)}`;
          const hashBuffer = await crypto.subtle.digest('SHA-256', encoder.encode(hashInput));
          const contentHash = Array.from(new Uint8Array(hashBuffer)).map(b => b.toString(16).padStart(2, '0')).join('');

          const state = ['QLD', 'NSW', 'WA', 'VIC', 'SA', 'TAS', 'NT', 'National'].includes(record.state) ? record.state : topic.state;

          const insertRes = await fetch(`${SUPABASE_URL}/rest/v1/mining_signals`, {
            method: 'POST',
            headers: { 'apikey': SUPABASE_SERVICE_ROLE_KEY, 'Authorization': `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`, 'Content-Type': 'application/json', 'Prefer': 'return=minimal' },
            body: JSON.stringify({
              company: record.company,
              mine: record.mine || 'Undisclosed Site',
              action: record.action || 'Enforcement Action',
              risk: ['HIGH', 'MEDIUM', 'LOW'].includes(record.risk) ? record.risk : 'MEDIUM',
              state,
              source: `AI Intelligence: ${topic.focus}`,
              description: record.description || '',
              date: record.date || 'Unknown',
              penalty: record.penalty || 'N/A',
              source_url: record.source_url || '',
              content_hash: contentHash,
            }),
          });

          if (insertRes.ok || insertRes.status === 201) totalInserted++;
        }
      } catch (err) {
        console.error(`Error for ${topic.focus}:`, err);
        errors.push(`${topic.focus}: ${err instanceof Error ? err.message : 'unknown'}`);
      }
    }

    return new Response(JSON.stringify({
      success: true, inserted: totalInserted, batch,
      topics_in_batch: topics.length, total_topics: GENERATION_TOPICS.length,
      total_batches: Math.ceil(GENERATION_TOPICS.length / batchSize),
      errors: errors.length > 0 ? errors : undefined,
    }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
  } catch (error) {
    console.error('Mining scraper error:', error);
    return new Response(JSON.stringify({ error: 'Scraper failed' }), { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
  }
});

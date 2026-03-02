const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
};

interface MiningRecord {
  company: string;
  mine: string;
  action: string;
  risk: string;
  description: string;
  date: string;
  penalty: string;
  state: string;
  source_url: string;
}

const SEARCH_QUERIES = [
  // === QUEENSLAND (15 queries) ===
  { query: 'Queensland mining prosecution penalty fine RSHQ 2024 2025 2026', state: 'QLD' },
  { query: 'Queensland coal mine safety breach prosecution Resources Safety Health', state: 'QLD' },
  { query: 'QLD mine worker death prosecution penalty Resources Safety', state: 'QLD' },
  { query: 'Queensland mining company enforceable undertaking safety regulator', state: 'QLD' },
  { query: 'RSHQ prohibition notice mine safety Queensland 2023 2024', state: 'QLD' },
  { query: 'Queensland mine methane explosion prosecution penalty', state: 'QLD' },
  { query: 'Queensland mining dust exposure silicosis prosecution fine', state: 'QLD' },
  { query: 'Grosvenor mine explosion prosecution Queensland penalty', state: 'QLD' },
  { query: 'Queensland gold mine prosecution safety breach penalty', state: 'QLD' },
  { query: 'RSHQ compliance directive mining company Queensland 2022 2023', state: 'QLD' },
  { query: 'Queensland mining environmental penalty contamination fine', state: 'QLD' },
  { query: 'Queensland underground coal mine safety prosecution court', state: 'QLD' },
  { query: 'New Hope Group Queensland mine prosecution penalty', state: 'QLD' },
  { query: 'Stanmore Resources Queensland mining prosecution enforcement', state: 'QLD' },
  { query: 'Queensland mining vehicle collision underground prosecution', state: 'QLD' },

  // === NEW SOUTH WALES (15 queries) ===
  { query: 'NSW mining prosecution Resources Regulator penalty fine 2024 2025', state: 'NSW' },
  { query: 'New South Wales mine safety breach prosecution penalty', state: 'NSW' },
  { query: 'NSW coal mine prosecution fine Resources Regulator enforcement', state: 'NSW' },
  { query: 'NSW mining company prohibition notice safety directive', state: 'NSW' },
  { query: 'NSW Resources Regulator enforceable undertaking mining 2023 2024', state: 'NSW' },
  { query: 'NSW mine worker fatality prosecution court penalty fine', state: 'NSW' },
  { query: 'Yancoal NSW mine prosecution safety breach penalty', state: 'NSW' },
  { query: 'Whitehaven Coal NSW prosecution penalty fine enforcement', state: 'NSW' },
  { query: 'NSW underground mine prosecution safety incident penalty', state: 'NSW' },
  { query: 'NSW open cut mine prosecution environmental penalty', state: 'NSW' },
  { query: 'NSW mine tailings dam prosecution penalty environmental', state: 'NSW' },
  { query: 'NSW Hunter Valley mining prosecution penalty enforcement', state: 'NSW' },
  { query: 'NSW mining WHS prosecution Work Health Safety penalty', state: 'NSW' },
  { query: 'Peabody Energy NSW mine prosecution penalty fine', state: 'NSW' },
  { query: 'NSW mine explosion prosecution penalty court fine 2020 2021 2022', state: 'NSW' },

  // === WESTERN AUSTRALIA (15 queries) ===
  { query: 'Western Australia mining prosecution DMIRS penalty fine 2024 2025', state: 'WA' },
  { query: 'WA mine safety prosecution Department Mines Industry Regulation', state: 'WA' },
  { query: 'Western Australia mining fatality prosecution penalty enforcement', state: 'WA' },
  { query: 'WA mining company safety improvement prohibition notice DMIRS', state: 'WA' },
  { query: 'WA gold mine prosecution penalty fine safety breach', state: 'WA' },
  { query: 'WA iron ore mine prosecution safety enforcement penalty', state: 'WA' },
  { query: 'Fortescue Metals WA prosecution penalty fine safety', state: 'WA' },
  { query: 'Northern Star Resources WA mine prosecution penalty', state: 'WA' },
  { query: 'WA lithium mine prosecution safety penalty enforcement', state: 'WA' },
  { query: 'DMIRS WA mine safety improvement notice 2023 2024', state: 'WA' },
  { query: 'WA Pilbara mining prosecution penalty court fine', state: 'WA' },
  { query: 'WA Goldfields mine prosecution safety penalty enforcement', state: 'WA' },
  { query: 'Regis Resources WA mine prosecution penalty safety', state: 'WA' },
  { query: 'WA mine vehicle collision prosecution penalty fine', state: 'WA' },
  { query: 'WA mining environmental prosecution penalty contamination', state: 'WA' },

  // === VICTORIA (10 queries) ===
  { query: 'Victoria mining prosecution penalty WorkSafe Earth Resources Regulation', state: 'VIC' },
  { query: 'Victorian mine safety breach prosecution fine enforcement', state: 'VIC' },
  { query: 'Victoria gold mine prosecution penalty safety breach', state: 'VIC' },
  { query: 'WorkSafe Victoria mine prosecution penalty fine', state: 'VIC' },
  { query: 'Victorian mining company enforceable undertaking prosecution', state: 'VIC' },
  { query: 'Victoria quarry mine prosecution penalty safety incident', state: 'VIC' },
  { query: 'Kirkland Lake Gold Victoria prosecution penalty', state: 'VIC' },
  { query: 'Victoria mine worker death prosecution court penalty', state: 'VIC' },
  { query: 'Earth Resources Regulation Victoria mine enforcement 2023 2024', state: 'VIC' },
  { query: 'Victorian mining environmental prosecution penalty fine', state: 'VIC' },

  // === SOUTH AUSTRALIA (8 queries) ===
  { query: 'South Australia mining prosecution penalty DEM SafeWork SA', state: 'SA' },
  { query: 'SA mine safety breach prosecution fine enforcement action', state: 'SA' },
  { query: 'South Australia Olympic Dam mine prosecution penalty', state: 'SA' },
  { query: 'BHP Olympic Dam SA prosecution penalty enforcement', state: 'SA' },
  { query: 'SafeWork SA mine prosecution penalty fine 2023 2024', state: 'SA' },
  { query: 'SA mining company safety prosecution court penalty', state: 'SA' },
  { query: 'South Australia copper mine prosecution penalty safety', state: 'SA' },
  { query: 'SA mine worker injury prosecution penalty fine court', state: 'SA' },

  // === TASMANIA (6 queries) ===
  { query: 'Tasmania mining prosecution penalty WorkSafe mines enforcement', state: 'TAS' },
  { query: 'Tasmania mine safety breach prosecution fine penalty', state: 'TAS' },
  { query: 'Tasmania tin mine prosecution penalty safety', state: 'TAS' },
  { query: 'WorkSafe Tasmania mine prosecution enforcement action', state: 'TAS' },
  { query: 'Tasmania mining environmental prosecution penalty', state: 'TAS' },
  { query: 'Tasmania mine worker prosecution penalty fine court', state: 'TAS' },

  // === NORTHERN TERRITORY (6 queries) ===
  { query: 'Northern Territory mining prosecution penalty NT WorkSafe mines', state: 'NT' },
  { query: 'NT mine safety breach prosecution fine enforcement', state: 'NT' },
  { query: 'Northern Territory gold mine prosecution penalty safety', state: 'NT' },
  { query: 'NT WorkSafe mine prosecution enforcement action penalty', state: 'NT' },
  { query: 'Northern Territory uranium mine prosecution penalty', state: 'NT' },
  { query: 'NT mining company prosecution penalty court fine', state: 'NT' },

  // === NATIONAL / CROSS-STATE (15 queries) ===
  { query: 'Australia mining company prosecution penalty fine enforcement 2024', state: 'National' },
  { query: 'Australia mining safety fatality prosecution court penalty 2025', state: 'National' },
  { query: 'Australian mining regulator enforcement action prohibition notice 2023 2024', state: 'National' },
  { query: 'BHP prosecution penalty fine Australia mining safety', state: 'National' },
  { query: 'Rio Tinto prosecution penalty fine Australia mining', state: 'National' },
  { query: 'Glencore prosecution penalty Australia mining enforcement', state: 'National' },
  { query: 'South32 prosecution penalty Australia mining safety', state: 'National' },
  { query: 'Anglo American prosecution penalty Australia mine safety', state: 'National' },
  { query: 'Evolution Mining prosecution penalty Australia safety', state: 'National' },
  { query: 'Aurelia Metals prosecution penalty Australia mine', state: 'National' },
  { query: 'Australia coal mine explosion prosecution penalty court fine', state: 'National' },
  { query: 'Australia mining company AUSTRAC penalty compliance enforcement', state: 'National' },
  { query: 'Australian mine disaster prosecution penalty court fine history', state: 'National' },
  { query: 'Australia mining prosecution penalty 2020 2021 2022 enforcement', state: 'National' },
  { query: 'Australia mining prosecution penalty 2018 2019 historical enforcement', state: 'National' },

  // === SPECIFIC INCIDENT TYPES (15 queries) ===
  { query: 'Australia mine fatality prosecution penalty court 2023 2024 2025', state: 'National' },
  { query: 'Australian mining enforceable undertaking regulator safety 2024', state: 'National' },
  { query: 'Australia mine prohibition notice safety directive regulator', state: 'National' },
  { query: 'Australia mining environmental penalty contamination prosecution', state: 'National' },
  { query: 'Australia mine WHS prosecution Work Health Safety penalty', state: 'National' },
  { query: 'Australia mine dust exposure silicosis prosecution penalty', state: 'National' },
  { query: 'Australia mine methane gas explosion prosecution penalty', state: 'National' },
  { query: 'Australia mine tailings dam failure prosecution penalty', state: 'National' },
  { query: 'Australia mine vehicle collision underground prosecution penalty', state: 'National' },
  { query: 'Australia mine electrical safety prosecution penalty fine', state: 'National' },
  { query: 'Australia mine ground control failure prosecution penalty', state: 'National' },
  { query: 'Australia mine fire prosecution penalty safety breach', state: 'National' },
  { query: 'Australia mine chemical exposure prosecution penalty', state: 'National' },
  { query: 'Australia mine plant equipment failure prosecution penalty', state: 'National' },
  { query: 'Australia mine drowning inrush prosecution penalty court', state: 'National' },

  // === SPECIFIC COMPANIES (15 queries) ===
  { query: 'Whitehaven Coal prosecution penalty fine enforcement Australia', state: 'National' },
  { query: 'Newcrest Mining prosecution penalty fine enforcement Australia', state: 'National' },
  { query: 'Peabody Energy Australia prosecution penalty mine safety', state: 'National' },
  { query: 'Fortescue Metals Group prosecution penalty safety enforcement', state: 'National' },
  { query: 'Yancoal Australia prosecution penalty mine safety breach', state: 'National' },
  { query: 'Mineral Resources prosecution penalty mine safety Australia', state: 'National' },
  { query: 'Coronado Global Resources prosecution penalty Australia mine', state: 'National' },
  { query: 'Centennial Coal prosecution penalty NSW mine safety', state: 'National' },
  { query: 'Alkane Resources prosecution penalty mine safety Australia', state: 'National' },
  { query: 'Aeris Resources prosecution penalty mine safety Australia', state: 'National' },
  { query: 'Sandfire Resources prosecution penalty mine WA safety', state: 'National' },
  { query: 'IGO Limited prosecution penalty mine safety Australia', state: 'National' },
  { query: 'Iluka Resources prosecution penalty mine safety Australia', state: 'National' },
  { query: 'Lynas Rare Earths prosecution penalty Australia enforcement', state: 'National' },
  { query: 'OZ Minerals prosecution penalty mine safety South Australia', state: 'National' },
];

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!;
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const FIRECRAWL_API_KEY = Deno.env.get('FIRECRAWL_API_KEY');
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');

    if (!FIRECRAWL_API_KEY || !LOVABLE_API_KEY) {
      return new Response(JSON.stringify({ error: 'Missing required API keys' }), {
        status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const url = new URL(req.url);
    const batch = parseInt(url.searchParams.get('batch') || '0');
    const batchSize = 5;
    const startIdx = batch * batchSize;
    const queries = SEARCH_QUERIES.slice(startIdx, startIdx + batchSize);

    if (queries.length === 0) {
      return new Response(JSON.stringify({ success: true, message: 'No more batches', total_queries: SEARCH_QUERIES.length }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    let totalInserted = 0;
    const errors: string[] = [];

    for (const sq of queries) {
      try {
        console.log(`Searching: ${sq.query}`);

        const searchRes = await fetch('https://api.firecrawl.dev/v1/search', {
          method: 'POST',
          headers: { 'Authorization': `Bearer ${FIRECRAWL_API_KEY}`, 'Content-Type': 'application/json' },
          body: JSON.stringify({
            query: sq.query,
            limit: 10,
            scrapeOptions: { formats: ['markdown'] },
          }),
        });
        const searchData = await searchRes.json();

        if (!searchData.success || !searchData.data?.length) {
          console.log(`No search results for: ${sq.query}`);
          continue;
        }

        const combinedContent = searchData.data
          .map((r: any) => `SOURCE: ${r.url}\nTITLE: ${r.title}\n${r.markdown || r.description || ''}`)
          .join('\n\n---\n\n')
          .slice(0, 12000);

        console.log(`Got ${searchData.data.length} search results, extracting records...`);

        const aiRes = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
          method: 'POST',
          headers: { 'Authorization': `Bearer ${LOVABLE_API_KEY}`, 'Content-Type': 'application/json' },
          body: JSON.stringify({
            model: 'google/gemini-2.5-flash',
            messages: [
              {
                role: 'system',
                content: `You extract REAL Australian mining enforcement records from news and government sources. Return a JSON array of up to 15 records. Each record:
- "company": REAL company name (e.g., "BHP", "Glencore", "Anglo American", "Peabody Energy"). NEVER use placeholder or generic names.
- "mine": specific mine site name if mentioned, otherwise "Not specified"
- "action": enforcement type (e.g., "Prosecution", "Penalty", "Prohibition Notice", "Safety Breach", "Fine", "Enforceable Undertaking")
- "risk": "HIGH" for fatalities/prosecutions/$100k+ fines, "MEDIUM" for smaller fines/notices, "LOW" for improvement notices
- "description": 1-2 sentence summary of the actual incident
- "date": actual date (YYYY-MM-DD format) or "Unknown"
- "penalty": actual dollar amount (e.g., "$450,000") or "N/A"
- "state": Australian state (QLD, NSW, WA, VIC, SA, TAS, NT, or National)
- "source_url": URL where this was found

CRITICAL: Only extract REAL enforcement actions with REAL company names from the provided content. Do not invent records. Return [] if no real records found. Extract as many distinct records as possible from the content.`
              },
              {
                role: 'user',
                content: `Extract mining enforcement records from these Australian sources:\n\n${combinedContent}`
              },
            ],
            max_tokens: 6000,
          }),
        });

        if (!aiRes.ok) {
          errors.push(`AI failed for query: ${sq.query} (${aiRes.status})`);
          continue;
        }

        const aiData = await aiRes.json();
        const rawContent = aiData.choices?.[0]?.message?.content || '[]';

        let records: MiningRecord[] = [];
        try {
          const jsonStr = rawContent.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
          records = JSON.parse(jsonStr);
          if (!Array.isArray(records)) records = [];
        } catch {
          errors.push(`Parse failed for: ${sq.query}`);
          continue;
        }

        console.log(`Extracted ${records.length} records from search: ${sq.query}`);

        for (const record of records) {
          if (!record.company || record.company === 'N/A' || record.company.toLowerCase().includes('sample')) continue;

          const encoder = new TextEncoder();
          const hashInput = `${record.company}|${record.mine}|${record.action}|${record.date}|${record.state}`;
          const hashBuffer = await crypto.subtle.digest('SHA-256', encoder.encode(hashInput));
          const hashArray = Array.from(new Uint8Array(hashBuffer));
          const contentHash = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');

          const state = ['QLD', 'NSW', 'WA', 'VIC', 'SA', 'TAS', 'NT', 'National'].includes(record.state) ? record.state : sq.state;

          const insertRes = await fetch(`${SUPABASE_URL}/rest/v1/mining_signals`, {
            method: 'POST',
            headers: {
              'apikey': SUPABASE_SERVICE_ROLE_KEY,
              'Authorization': `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
              'Content-Type': 'application/json',
              'Prefer': 'return=minimal',
            },
            body: JSON.stringify({
              company: record.company,
              mine: record.mine || 'Not specified',
              action: record.action || 'Enforcement Action',
              risk: ['HIGH', 'MEDIUM', 'LOW'].includes(record.risk) ? record.risk : 'MEDIUM',
              state,
              source: `Search: ${state}`,
              description: record.description || '',
              date: record.date || 'Unknown',
              penalty: record.penalty || 'N/A',
              source_url: record.source_url || '',
              content_hash: contentHash,
            }),
          });

          if (insertRes.ok || insertRes.status === 201) {
            totalInserted++;
          } else if (insertRes.status === 409) {
            console.log(`Duplicate: ${record.company}`);
          } else {
            const errText = await insertRes.text();
            console.error(`Insert failed: ${record.company}: ${insertRes.status} ${errText}`);
          }
        }
      } catch (err) {
        console.error(`Error for query ${sq.query}:`, err);
        errors.push(`${sq.query}: ${err instanceof Error ? err.message : 'unknown'}`);
      }
    }

    return new Response(JSON.stringify({
      success: true,
      inserted: totalInserted,
      batch,
      queries_in_batch: queries.length,
      total_queries: SEARCH_QUERIES.length,
      total_batches: Math.ceil(SEARCH_QUERIES.length / batchSize),
      errors: errors.length > 0 ? errors : undefined,
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Mining scraper error:', error);
    return new Response(JSON.stringify({ error: 'Scraper failed' }), {
      status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

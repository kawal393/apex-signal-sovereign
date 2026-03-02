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
  { query: 'Australia mining prosecution penalty fine 2024 2025 2026', state: 'National' },
  { query: 'Queensland mining safety prosecution penalty RSHQ', state: 'QLD' },
  { query: 'NSW mining prosecution resources regulator penalty', state: 'NSW' },
  { query: 'Western Australia mining prosecution DMIRS penalty', state: 'WA' },
  { query: 'Australia mining company prohibition notice safety breach', state: 'National' },
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

    let totalInserted = 0;
    const errors: string[] = [];

    for (const sq of SEARCH_QUERIES) {
      try {
        console.log(`Searching: ${sq.query}`);

        // Search with Firecrawl
        const searchRes = await fetch('https://api.firecrawl.dev/v1/search', {
          method: 'POST',
          headers: { 'Authorization': `Bearer ${FIRECRAWL_API_KEY}`, 'Content-Type': 'application/json' },
          body: JSON.stringify({
            query: sq.query,
            limit: 5,
            scrapeOptions: { formats: ['markdown'] },
          }),
        });
        const searchData = await searchRes.json();

        if (!searchData.success || !searchData.data?.length) {
          console.log(`No search results for: ${sq.query}`);
          continue;
        }

        // Combine all search result content
        const combinedContent = searchData.data
          .map((r: any) => `SOURCE: ${r.url}\nTITLE: ${r.title}\n${r.markdown || r.description || ''}`)
          .join('\n\n---\n\n')
          .slice(0, 8000);

        console.log(`Got ${searchData.data.length} search results, extracting records...`);

        // Extract with AI
        const aiRes = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
          method: 'POST',
          headers: { 'Authorization': `Bearer ${LOVABLE_API_KEY}`, 'Content-Type': 'application/json' },
          body: JSON.stringify({
            model: 'google/gemini-2.5-flash',
            messages: [
              {
                role: 'system',
                content: `You extract REAL Australian mining enforcement records from news and government sources. Return a JSON array. Each record:
- "company": REAL company name (e.g., "BHP", "Glencore", "Anglo American", "Peabody Energy"). NEVER use placeholder or generic names.
- "mine": specific mine site name if mentioned, otherwise "Not specified"
- "action": enforcement type (e.g., "Prosecution", "Penalty", "Prohibition Notice", "Safety Breach", "Fine", "Enforceable Undertaking")
- "risk": "HIGH" for fatalities/prosecutions/$100k+ fines, "MEDIUM" for smaller fines/notices, "LOW" for improvement notices
- "description": 1-2 sentence summary of the actual incident
- "date": actual date (YYYY-MM-DD format) or "Unknown"
- "penalty": actual dollar amount (e.g., "$450,000") or "N/A"
- "state": Australian state (QLD, NSW, WA, VIC, SA, TAS, NT, or National)
- "source_url": URL where this was found

CRITICAL: Only extract REAL enforcement actions with REAL company names from the provided content. Do not invent records. Return [] if no real records found.`
              },
              {
                role: 'user',
                content: `Extract mining enforcement records from these Australian sources:\n\n${combinedContent}`
              },
            ],
            max_tokens: 4000,
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
            console.log(`Inserted: ${record.company} (${state})`);
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
      queries_processed: SEARCH_QUERIES.length,
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

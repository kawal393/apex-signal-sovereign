const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
};

interface MiningRecord {
  company: string;
  mine: string;
  action: string;
  risk: string;
  state: string;
  source: string;
  description: string;
  date: string;
  penalty: string;
  source_url: string;
}

const REGULATOR_URLS: { url: string; state: string; source: string }[] = [
  { url: 'https://www.rshq.qld.gov.au/safety-notices', state: 'QLD', source: 'RSHQ Queensland' },
  { url: 'https://www.resourcesregulator.nsw.gov.au/safety-and-health/enforcement-activity', state: 'NSW', source: 'NSW Resources Regulator' },
  { url: 'https://www.dmirs.wa.gov.au/content/mines-safety-enforcement', state: 'WA', source: 'DMIRS Western Australia' },
  { url: 'https://earthresources.vic.gov.au/legislation-and-regulations/compliance-and-enforcement', state: 'VIC', source: 'Earth Resources VIC' },
  { url: 'https://www.energymining.sa.gov.au/industry/mining-and-quarrying/safety-and-health', state: 'SA', source: 'DEM South Australia' },
  { url: 'https://worksafe.tas.gov.au/topics/industries/mining-and-quarrying', state: 'TAS', source: 'WorkSafe Tasmania' },
  { url: 'https://worksafe.nt.gov.au/safety-and-prevention/mining', state: 'NT', source: 'NT WorkSafe' },
  { url: 'https://www.safeworkaustralia.gov.au/mining', state: 'National', source: 'Safe Work Australia' },
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

    if (!FIRECRAWL_API_KEY) {
      return new Response(JSON.stringify({ error: 'Firecrawl not configured' }), {
        status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    if (!LOVABLE_API_KEY) {
      return new Response(JSON.stringify({ error: 'Lovable AI not configured' }), {
        status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    let totalInserted = 0;
    const errors: string[] = [];

    for (const reg of REGULATOR_URLS) {
      try {
        console.log(`Scraping ${reg.source}: ${reg.url}`);

        // Scrape with Firecrawl
        const scrapeRes = await fetch('https://api.firecrawl.dev/v1/scrape', {
          method: 'POST',
          headers: { 'Authorization': `Bearer ${FIRECRAWL_API_KEY}`, 'Content-Type': 'application/json' },
          body: JSON.stringify({ url: reg.url, formats: ['markdown'], onlyMainContent: true }),
        });
        const scrapeData = await scrapeRes.json();

        if (!scrapeData.success) {
          errors.push(`${reg.source}: scrape failed`);
          continue;
        }

        const content = scrapeData.data?.markdown || scrapeData.markdown || '';
        if (content.length < 100) {
          errors.push(`${reg.source}: insufficient content`);
          continue;
        }

        // Extract structured data with Gemini
        const aiRes = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
          method: 'POST',
          headers: { 'Authorization': `Bearer ${LOVABLE_API_KEY}`, 'Content-Type': 'application/json' },
          body: JSON.stringify({
            model: 'google/gemini-2.5-flash',
            messages: [
              {
                role: 'system',
                content: `You extract mining enforcement records from regulatory website content. Return a JSON array of records. Each record must have:
- "company": company or operator name
- "mine": mine site name (or "N/A")
- "action": type of enforcement (e.g., "Prohibition Notice", "Prosecution", "Penalty", "Safety Alert", "Directive", "Improvement Notice")
- "risk": "HIGH", "MEDIUM", or "LOW"
- "description": brief summary (1-2 sentences)
- "date": date string if found (e.g., "2024-01-15") or "Unknown"
- "penalty": dollar amount if applicable or "N/A"

Rules:
- Extract REAL company names and mine sites only
- If content has no enforcement records, return empty array []
- Risk: HIGH for fatalities/serious injuries/prosecutions, MEDIUM for prohibition notices/fines, LOW for improvement notices/alerts
- Return ONLY the JSON array, no other text`
              },
              {
                role: 'user',
                content: `Extract mining enforcement records from this ${reg.source} (${reg.state}) page:\n\n${content.slice(0, 6000)}`
              },
            ],
            max_tokens: 4000,
          }),
        });

        if (!aiRes.ok) {
          errors.push(`${reg.source}: AI extraction failed (${aiRes.status})`);
          continue;
        }

        const aiData = await aiRes.json();
        const rawContent = aiData.choices?.[0]?.message?.content || '[]';

        // Parse JSON from AI response (handle markdown code blocks)
        let records: MiningRecord[] = [];
        try {
          const jsonStr = rawContent.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
          records = JSON.parse(jsonStr);
          if (!Array.isArray(records)) records = [];
        } catch {
          errors.push(`${reg.source}: failed to parse AI response`);
          continue;
        }

        // Insert records with dedup
        for (const record of records) {
          if (!record.company || record.company === 'N/A') continue;

          const encoder = new TextEncoder();
          const hashInput = `${record.company}|${record.mine}|${record.action}|${record.date}|${reg.state}`;
          const hashBuffer = await crypto.subtle.digest('SHA-256', encoder.encode(hashInput));
          const hashArray = Array.from(new Uint8Array(hashBuffer));
          const contentHash = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');

          const insertRes = await fetch(`${SUPABASE_URL}/rest/v1/mining_signals`, {
            method: 'POST',
            headers: {
              'apikey': SUPABASE_SERVICE_ROLE_KEY,
              'Authorization': `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
              'Content-Type': 'application/json',
              'Prefer': 'return=minimal,resolution=ignore-duplicates',
            },
            body: JSON.stringify({
              company: record.company,
              mine: record.mine || 'N/A',
              action: record.action || 'Enforcement Action',
              risk: ['HIGH', 'MEDIUM', 'LOW'].includes(record.risk) ? record.risk : 'MEDIUM',
              state: reg.state,
              source: reg.source,
              description: record.description || '',
              date: record.date || 'Unknown',
              penalty: record.penalty || 'N/A',
              source_url: reg.url,
              content_hash: contentHash,
            }),
          });

          if (insertRes.ok) totalInserted++;
        }

        console.log(`${reg.source}: extracted ${records.length} records`);
      } catch (err) {
        console.error(`Error processing ${reg.source}:`, err);
        errors.push(`${reg.source}: ${err instanceof Error ? err.message : 'unknown error'}`);
      }
    }

    return new Response(JSON.stringify({
      success: true,
      inserted: totalInserted,
      sources_processed: REGULATOR_URLS.length,
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

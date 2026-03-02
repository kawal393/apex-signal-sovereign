const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Global regulatory search queries by region
const REGULATORY_QUERIES: Record<string, { jurisdiction: string; country_code: string; queries: string[] }[]> = {
  AU: [
    { jurisdiction: "NDIS", country_code: "AU", queries: ["NDIS Commission enforcement action 2025 2026", "NDIS provider compliance notice"] },
    { jurisdiction: "AUSTRAC", country_code: "AU", queries: ["AUSTRAC AML enforcement penalty 2025 2026", "AUSTRAC compliance action"] },
    { jurisdiction: "Mining", country_code: "AU", queries: ["Australian mining regulator enforcement 2025 2026"] },
  ],
  US: [
    { jurisdiction: "SEC", country_code: "US", queries: ["SEC enforcement action 2025 2026 penalty", "SEC litigation release"] },
    { jurisdiction: "FTC", country_code: "US", queries: ["FTC enforcement action consumer protection 2025 2026"] },
    { jurisdiction: "FDA", country_code: "US", queries: ["FDA warning letter enforcement 2025 2026"] },
  ],
  UK: [
    { jurisdiction: "FCA", country_code: "UK", queries: ["FCA enforcement action fine 2025 2026", "FCA consumer duty enforcement"] },
    { jurisdiction: "ICO", country_code: "UK", queries: ["ICO data protection enforcement notice 2025 2026"] },
  ],
  EU: [
    { jurisdiction: "AI Act", country_code: "EU", queries: ["EU AI Act implementation update 2025 2026", "EU AI Act compliance deadline"] },
    { jurisdiction: "GDPR", country_code: "EU", queries: ["GDPR enforcement fine 2025 2026", "EU data protection authority decision"] },
  ],
  JP: [
    { jurisdiction: "FSA", country_code: "JP", queries: ["Japan FSA enforcement action 2025 2026", "JFSA financial regulation update"] },
  ],
  SG: [
    { jurisdiction: "MAS", country_code: "SG", queries: ["MAS Singapore enforcement action 2025 2026", "MAS regulatory update fintech"] },
  ],
  IN: [
    { jurisdiction: "SEBI", country_code: "IN", queries: ["SEBI enforcement order penalty 2025 2026", "SEBI regulatory circular"] },
    { jurisdiction: "RBI", country_code: "IN", queries: ["RBI regulatory action 2025 2026"] },
  ],
  AE: [
    { jurisdiction: "DFSA", country_code: "AE", queries: ["DFSA enforcement action 2025 2026", "Dubai VARA regulatory update"] },
  ],
  KR: [
    { jurisdiction: "FSC", country_code: "KR", queries: ["Korea FSC financial regulation enforcement 2025 2026"] },
  ],
  BR: [
    { jurisdiction: "CVM", country_code: "BR", queries: ["Brazil CVM securities enforcement 2025 2026"] },
    { jurisdiction: "LGPD", country_code: "BR", queries: ["Brazil ANPD LGPD enforcement 2025 2026"] },
  ],
  CA: [
    { jurisdiction: "CSA", country_code: "CA", queries: ["Canada CSA securities enforcement 2025 2026"] },
  ],
  ZA: [
    { jurisdiction: "FSCA", country_code: "ZA", queries: ["South Africa FSCA enforcement action 2025 2026"] },
  ],
};

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

    // Parse optional region filter from request body
    let targetRegions: string[] = Object.keys(REGULATORY_QUERIES);
    try {
      const body = await req.json();
      if (body?.regions && Array.isArray(body.regions)) {
        targetRegions = body.regions;
      }
    } catch { /* no body = scan all */ }

    // First check monitored_sources table
    const sourcesRes = await fetch(`${SUPABASE_URL}/rest/v1/monitored_sources?active=eq.true&limit=50`, {
      headers: { 'apikey': SUPABASE_SERVICE_ROLE_KEY, 'Authorization': `Bearer ${SUPABASE_SERVICE_ROLE_KEY}` },
    });
    const sources = await sourcesRes.json();

    let processed = 0;

    // Process monitored sources
    for (const source of sources) {
      try {
        const scrapeRes = await fetch('https://api.firecrawl.dev/v1/scrape', {
          method: 'POST',
          headers: { 'Authorization': `Bearer ${FIRECRAWL_API_KEY}`, 'Content-Type': 'application/json' },
          body: JSON.stringify({ url: source.source_url, formats: ['markdown'], onlyMainContent: true }),
        });
        const scrapeData = await scrapeRes.json();
        if (!scrapeData.success) continue;

        const content = scrapeData.data?.markdown || scrapeData.markdown || '';
        const encoder = new TextEncoder();
        const hashBuffer = await crypto.subtle.digest('SHA-256', encoder.encode(content));
        const contentHash = Array.from(new Uint8Array(hashBuffer)).map(b => b.toString(16).padStart(2, '0')).join('');

        if (contentHash === source.last_content_hash) {
          await fetch(`${SUPABASE_URL}/rest/v1/monitored_sources?id=eq.${source.id}`, {
            method: 'PATCH',
            headers: { 'apikey': SUPABASE_SERVICE_ROLE_KEY, 'Authorization': `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`, 'Content-Type': 'application/json' },
            body: JSON.stringify({ last_checked_at: new Date().toISOString() }),
          });
          continue;
        }

        const aiSummary = await analyzeContent(content, source, LOVABLE_API_KEY);

        await fetch(`${SUPABASE_URL}/rest/v1/regulatory_updates`, {
          method: 'POST',
          headers: { 'apikey': SUPABASE_SERVICE_ROLE_KEY, 'Authorization': `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`, 'Content-Type': 'application/json', 'Prefer': 'return=minimal' },
          body: JSON.stringify({
            country_code: source.country_code, jurisdiction: source.jurisdiction,
            title: aiSummary.title, summary: aiSummary.summary,
            source_url: source.source_url, source_domain: new URL(source.source_url).hostname,
            content_hash: contentHash, severity: aiSummary.severity || 'informational',
            ai_analysis: { change: aiSummary.change, impact: aiSummary.impact, action_required: aiSummary.action_required },
          }),
        });

        await fetch(`${SUPABASE_URL}/rest/v1/monitored_sources?id=eq.${source.id}`, {
          method: 'PATCH',
          headers: { 'apikey': SUPABASE_SERVICE_ROLE_KEY, 'Authorization': `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`, 'Content-Type': 'application/json' },
          body: JSON.stringify({ last_checked_at: new Date().toISOString(), last_content_hash: contentHash }),
        });
        processed++;
      } catch (err) {
        console.error(`Error processing source ${source.source_url}:`, err);
      }
    }

    // Search-based discovery for target regions
    for (const region of targetRegions) {
      const entries = REGULATORY_QUERIES[region];
      if (!entries) continue;

      for (const entry of entries) {
        for (const query of entry.queries) {
          try {
            const searchRes = await fetch('https://api.firecrawl.dev/v1/search', {
              method: 'POST',
              headers: { 'Authorization': `Bearer ${FIRECRAWL_API_KEY}`, 'Content-Type': 'application/json' },
              body: JSON.stringify({ query, limit: 3, scrapeOptions: { formats: ['markdown'] } }),
            });
            const searchData = await searchRes.json();
            if (!searchData.success || !searchData.data) continue;

            for (const result of searchData.data.slice(0, 2)) {
              if (!result.markdown || result.markdown.length < 100) continue;

              const encoder = new TextEncoder();
              const hashBuffer = await crypto.subtle.digest('SHA-256', encoder.encode(result.url + result.markdown.slice(0, 500)));
              const contentHash = Array.from(new Uint8Array(hashBuffer)).map(b => b.toString(16).padStart(2, '0')).join('');

              // Check duplicate
              const dupCheck = await fetch(`${SUPABASE_URL}/rest/v1/regulatory_updates?content_hash=eq.${contentHash}&limit=1`, {
                headers: { 'apikey': SUPABASE_SERVICE_ROLE_KEY, 'Authorization': `Bearer ${SUPABASE_SERVICE_ROLE_KEY}` },
              });
              const dups = await dupCheck.json();
              if (dups.length > 0) continue;

              const aiSummary = await analyzeContent(result.markdown, { source_name: result.title || query, jurisdiction: entry.jurisdiction, country_code: entry.country_code }, LOVABLE_API_KEY);

              await fetch(`${SUPABASE_URL}/rest/v1/regulatory_updates`, {
                method: 'POST',
                headers: { 'apikey': SUPABASE_SERVICE_ROLE_KEY, 'Authorization': `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`, 'Content-Type': 'application/json', 'Prefer': 'return=minimal' },
                body: JSON.stringify({
                  country_code: entry.country_code, jurisdiction: entry.jurisdiction,
                  title: aiSummary.title, summary: aiSummary.summary,
                  source_url: result.url, source_domain: new URL(result.url).hostname,
                  content_hash: contentHash, severity: aiSummary.severity || 'informational',
                  ai_analysis: { change: aiSummary.change, impact: aiSummary.impact, action_required: aiSummary.action_required },
                }),
              });
              processed++;
            }
          } catch (err) {
            console.error(`Search error for "${query}":`, err);
          }
        }
      }
    }

    return new Response(JSON.stringify({ success: true, processed, regions: targetRegions.length }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Regulatory monitor error:', error);
    return new Response(JSON.stringify({ error: 'Monitor failed' }), {
      status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

async function analyzeContent(content: string, source: { source_name?: string; jurisdiction: string; country_code: string }, apiKey: string | undefined) {
  let aiSummary = { title: `${source.jurisdiction} regulatory update`, summary: content.slice(0, 500), severity: 'informational', change: 'Content updated', impact: 'Under review', action_required: 'Monitor' };

  if (apiKey) {
    try {
      const aiRes = await fetch('https://ai-gateway.lovable.dev/v1/chat/completions', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'google/gemini-2.5-flash',
          messages: [
            { role: 'system', content: 'You analyze regulatory changes. Return JSON only: { "title": "...", "summary": "...", "severity": "critical|moderate|informational", "change": "...", "impact": "...", "action_required": "..." }' },
            { role: 'user', content: `Analyze this regulatory page from ${source.source_name || source.jurisdiction} (${source.jurisdiction}, ${source.country_code}):\n\n${content.slice(0, 4000)}` },
          ],
          max_tokens: 500,
        }),
      });
      const aiData = await aiRes.json();
      const raw = aiData.choices?.[0]?.message?.content || '{}';
      const cleaned = raw.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
      const parsed = JSON.parse(cleaned);
      if (parsed.title) aiSummary = parsed;
    } catch { /* Use default */ }
  }

  return aiSummary;
}

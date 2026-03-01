const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
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

    // Fetch active sources
    const sourcesRes = await fetch(`${SUPABASE_URL}/rest/v1/monitored_sources?active=eq.true&limit=10`, {
      headers: { 'apikey': SUPABASE_SERVICE_ROLE_KEY, 'Authorization': `Bearer ${SUPABASE_SERVICE_ROLE_KEY}` },
    });
    const sources = await sourcesRes.json();

    let processed = 0;
    for (const source of sources) {
      try {
        // Scrape with Firecrawl
        const scrapeRes = await fetch('https://api.firecrawl.dev/v1/scrape', {
          method: 'POST',
          headers: { 'Authorization': `Bearer ${FIRECRAWL_API_KEY}`, 'Content-Type': 'application/json' },
          body: JSON.stringify({ url: source.source_url, formats: ['markdown'], onlyMainContent: true }),
        });
        const scrapeData = await scrapeRes.json();
        if (!scrapeData.success) continue;

        const content = scrapeData.data?.markdown || scrapeData.markdown || '';
        // Simple hash
        const encoder = new TextEncoder();
        const hashBuffer = await crypto.subtle.digest('SHA-256', encoder.encode(content));
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        const contentHash = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');

        // Check if content changed
        if (contentHash === source.last_content_hash) {
          // Update last_checked_at only
          await fetch(`${SUPABASE_URL}/rest/v1/monitored_sources?id=eq.${source.id}`, {
            method: 'PATCH',
            headers: { 'apikey': SUPABASE_SERVICE_ROLE_KEY, 'Authorization': `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`, 'Content-Type': 'application/json' },
            body: JSON.stringify({ last_checked_at: new Date().toISOString() }),
          });
          continue;
        }

        // Content changed — summarize with AI
        let aiSummary = { title: `${source.jurisdiction} regulatory update`, summary: content.slice(0, 500), severity: 'informational', change: 'Content updated', impact: 'Under review', action_required: 'Monitor' };

        if (LOVABLE_API_KEY) {
          try {
            const aiRes = await fetch('https://ai-gateway.lovable.dev/v1/chat/completions', {
              method: 'POST',
              headers: { 'Authorization': `Bearer ${LOVABLE_API_KEY}`, 'Content-Type': 'application/json' },
              body: JSON.stringify({
                model: 'google/gemini-2.5-flash',
                messages: [
                  { role: 'system', content: 'You analyze regulatory changes. Return JSON only: { "title": "...", "summary": "...", "severity": "critical|moderate|informational", "change": "...", "impact": "...", "action_required": "..." }' },
                  { role: 'user', content: `Analyze this regulatory page from ${source.source_name} (${source.jurisdiction}, ${source.country_code}):\n\n${content.slice(0, 4000)}` },
                ],
                max_tokens: 500,
              }),
            });
            const aiData = await aiRes.json();
            const parsed = JSON.parse(aiData.choices?.[0]?.message?.content || '{}');
            if (parsed.title) aiSummary = parsed;
          } catch { /* Use default summary */ }
        }

        // Insert regulatory update (using service role)
        await fetch(`${SUPABASE_URL}/rest/v1/regulatory_updates`, {
          method: 'POST',
          headers: { 'apikey': SUPABASE_SERVICE_ROLE_KEY, 'Authorization': `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`, 'Content-Type': 'application/json', 'Prefer': 'return=minimal' },
          body: JSON.stringify({
            country_code: source.country_code,
            jurisdiction: source.jurisdiction,
            title: aiSummary.title,
            summary: aiSummary.summary,
            source_url: source.source_url,
            source_domain: new URL(source.source_url).hostname,
            content_hash: contentHash,
            severity: aiSummary.severity || 'informational',
            ai_analysis: { change: aiSummary.change, impact: aiSummary.impact, action_required: aiSummary.action_required },
          }),
        });

        // Update source
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

    return new Response(JSON.stringify({ success: true, processed, total: sources.length }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Regulatory monitor error:', error);
    return new Response(JSON.stringify({ error: 'Monitor failed' }), {
      status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

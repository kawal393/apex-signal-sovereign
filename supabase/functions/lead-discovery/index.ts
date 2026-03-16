import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "npm:@supabase/supabase-js@2.57.2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const SECTOR_QUERIES: Record<string, string[]> = {
  ndis: [
    "NDIS registered provider contact email site:ndiscommission.gov.au",
    "NDIS disability service provider email contact Australia",
    "NDIS provider compliance officer email",
    "NDIS support coordinator contact email",
  ],
  mining: [
    "mining company compliance officer email Australia",
    "Australian mining operator contact email",
    "mine safety manager email address Australia",
    "resources company compliance email WA QLD NSW",
  ],
  pharma: [
    "pharmaceutical company regulatory affairs email Australia",
    "TGA registered sponsor contact email",
    "biotech compliance officer email Australia",
    "pharmaceutical quality assurance manager email",
  ],
  legal: [
    "compliance law firm partner email Australia",
    "regulatory lawyer email Sydney Melbourne Brisbane",
    "corporate compliance counsel contact email",
    "risk advisory firm email Australia",
  ],
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const startTime = Date.now();

  try {
    const { sector = "ndis", batch = 0 } = await req.json();

    const firecrawlKey = Deno.env.get("FIRECRAWL_API_KEY");
    if (!firecrawlKey) throw new Error("FIRECRAWL_API_KEY not configured");

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    const queries = SECTOR_QUERIES[sector] || SECTOR_QUERIES.ndis;
    const query = queries[batch % queries.length];

    console.log(`Lead discovery: sector=${sector}, batch=${batch}, query="${query}"`);

    // Search for leads using Firecrawl
    const searchResponse = await fetch("https://api.firecrawl.dev/v1/search", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${firecrawlKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query,
        limit: 10,
        scrapeOptions: { formats: ["markdown"] },
      }),
    });

    const searchData = await searchResponse.json();

    if (!searchResponse.ok) {
      throw new Error(`Firecrawl error: ${JSON.stringify(searchData)}`);
    }

    const results = searchData.data || [];

    // Use Gemini to extract contact info from scraped content
    const extractionPrompt = `You are an email extraction AI for APEX Infrastructure, a regulatory compliance intelligence firm.

From the following web search results, extract any business contact emails you can find.
For each email found, extract:
- email: the email address
- company_name: the company or organization name
- contact_name: the person's name (if available, otherwise null)
- website: the company website URL
- state: Australian state if identifiable (NSW, VIC, QLD, WA, SA, TAS, NT, ACT)

CRITICAL RULES:
- Only extract BUSINESS emails (not personal gmail/hotmail/yahoo unless it's clearly a business contact)
- Do NOT fabricate or guess emails — only extract what's explicitly shown
- Focus on compliance officers, directors, managers, or general business contacts
- Sector: ${sector}

Return a JSON array of objects. If no emails found, return empty array [].

Search results:
${results.map((r: any) => `URL: ${r.url}\nTitle: ${r.title}\nContent: ${(r.markdown || "").slice(0, 2000)}`).join("\n\n---\n\n")}`;

    // Call Gemini via Lovable AI
    const geminiResponse = await fetch(
      `${Deno.env.get("SUPABASE_URL")}/functions/v1/proxy-ai`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "google/gemini-2.5-flash",
          messages: [{ role: "user", content: extractionPrompt }],
        }),
      }
    );

    let leads: any[] = [];

    if (geminiResponse.ok) {
      const geminiData = await geminiResponse.json();
      const content = geminiData.choices?.[0]?.message?.content || "";

      // Parse JSON from response
      const jsonMatch = content.match(/\[[\s\S]*?\]/);
      if (jsonMatch) {
        try {
          leads = JSON.parse(jsonMatch[0]);
        } catch {
          console.log("Failed to parse Gemini response as JSON");
        }
      }
    }

    // Insert discovered leads (skip duplicates)
    let inserted = 0;
    for (const lead of leads) {
      if (!lead.email || !lead.company_name) continue;

      const { error } = await supabase.from("outreach_leads").upsert(
        {
          email: lead.email.toLowerCase().trim(),
          company_name: lead.company_name,
          contact_name: lead.contact_name || null,
          website: lead.website || null,
          state: lead.state || null,
          sector,
          source: "firecrawl",
          status: "new",
        },
        { onConflict: "email", ignoreDuplicates: true }
      );

      if (!error) inserted++;
    }

    // Log the run
    await supabase.from("scraper_runs").insert({
      scraper_name: `lead-discovery-${sector}`,
      batch_number: batch,
      records_found: leads.length,
      records_inserted: inserted,
      duration_ms: Date.now() - startTime,
      status: "completed",
    });

    console.log(`Lead discovery complete: found=${leads.length}, inserted=${inserted}`);

    return new Response(
      JSON.stringify({
        success: true,
        sector,
        batch,
        leads_found: leads.length,
        leads_inserted: inserted,
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Lead discovery error:", error);
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 500 }
    );
  }
});

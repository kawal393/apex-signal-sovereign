import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const SECTORS = ["ndis", "mining", "pharma", "legal"];

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const baseUrl = Deno.env.get("SUPABASE_URL");
    const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

    if (!baseUrl || !serviceKey) throw new Error("Missing SUPABASE_URL or SERVICE_ROLE_KEY");

    const results: any[] = [];

    // Step 1: Discover leads for each sector
    for (const sector of SECTORS) {
      try {
        const discoverRes = await fetch(`${baseUrl}/functions/v1/lead-discovery`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${serviceKey}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ sector, batch: Math.floor(Math.random() * 4) }),
        });
        const discoverData = await discoverRes.json();
        results.push({ step: "discover", sector, ...discoverData });
      } catch (err) {
        results.push({ step: "discover", sector, error: err.message });
      }
    }

    // Step 2: Send outreach for each sector (5 emails per sector max)
    for (const sector of SECTORS) {
      try {
        const sendRes = await fetch(`${baseUrl}/functions/v1/send-outreach`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${serviceKey}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ sector, limit: 5 }),
        });
        const sendData = await sendRes.json();
        results.push({ step: "send", sector, ...sendData });
      } catch (err) {
        results.push({ step: "send", sector, error: err.message });
      }
    }

    console.log("Outreach scheduler completed:", JSON.stringify(results));

    return new Response(
      JSON.stringify({ success: true, results }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Scheduler error:", error);
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 500 }
    );
  }
});

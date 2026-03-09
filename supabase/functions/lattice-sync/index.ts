import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface LatticeEvent {
  event_type: string;
  title: string;
  description: string;
  severity: "low" | "medium" | "high" | "critical";
  payload?: Record<string, unknown>;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  try {
    const latticeKey = Deno.env.get("APEX_LATTICE_KEY");
    
    if (!latticeKey) {
      return new Response(JSON.stringify({ 
        error: "Lattice key not configured",
        status: "disconnected" 
      }), {
        status: 503,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const body: LatticeEvent = await req.json();

    // Validate required fields
    if (!body.event_type || !body.title || !body.description || !body.severity) {
      return new Response(JSON.stringify({ 
        error: "Missing required fields: event_type, title, description, severity" 
      }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Validate severity
    const validSeverities = ["low", "medium", "high", "critical"];
    if (!validSeverities.includes(body.severity)) {
      return new Response(JSON.stringify({ 
        error: "Invalid severity. Must be: low, medium, high, or critical" 
      }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Get lattice URL from config
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, serviceRoleKey);
    
    const { data: configData } = await supabase
      .from("lattice_config")
      .select("value")
      .eq("key", "sovereign_lattice_url")
      .single();

    const latticeUrl = configData?.value || 
      "https://uvhpmohzdwbbsldotszy.supabase.co/functions/v1/sovereign-lattice";

    // Construct the standardized cross-node payload
    const latticePayload = {
      source_node: "apex-infrastructure",
      event_type: body.event_type,
      title: body.title,
      description: body.description,
      severity: body.severity,
      payload: body.payload || {},
      timestamp: new Date().toISOString(),
    };

    // Forward to Apex Bounty Sovereign Lattice
    const response = await fetch(`${latticeUrl}?action=ingest-event`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Platform-Key": latticeKey,
        "X-Node-Id": "apex-infrastructure",
      },
      body: JSON.stringify(latticePayload),
    });

    const responseText = await response.text();
    let responseData;
    try {
      responseData = JSON.parse(responseText);
    } catch {
      responseData = { raw: responseText };
    }

    if (!response.ok) {
      console.error("Lattice sync failed:", response.status, responseData);
      return new Response(JSON.stringify({ 
        success: false,
        error: "Lattice sync failed",
        status: response.status,
        details: responseData,
      }), {
        status: 502,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ 
      success: true,
      message: "Event forwarded to Sovereign Lattice",
      lattice_response: responseData,
      event: {
        type: body.event_type,
        title: body.title,
        severity: body.severity,
      },
    }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });

  } catch (error) {
    console.error("Lattice sync error:", error);
    return new Response(JSON.stringify({ 
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});

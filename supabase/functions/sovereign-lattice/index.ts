import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-platform-key, x-node-id",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const url = new URL(req.url);
  const action = url.searchParams.get("action");

  // PING — unauthenticated liveness check
  if (action === "ping") {
    return new Response(JSON.stringify({
      status: "alive",
      node: "digital-gallows",
      timestamp: new Date().toISOString(),
    }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  // All other actions require platform key auth
  const latticeKey = Deno.env.get("APEX_LATTICE_KEY");
  const providedKey = req.headers.get("X-Platform-Key");

  if (!latticeKey || providedKey !== latticeKey) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  // INGEST-EVENT — receive cross-node intelligence
  if (action === "ingest-event" && req.method === "POST") {
    try {
      const body = await req.json();
      const { source_node, event_type, title, description, severity, payload, timestamp } = body;

      if (!event_type || !title || !description || !severity) {
        return new Response(JSON.stringify({
          error: "Missing required fields: event_type, title, description, severity",
        }), {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      const validSeverities = ["low", "medium", "high", "critical"];
      if (!validSeverities.includes(severity)) {
        return new Response(JSON.stringify({
          error: "Invalid severity. Must be: low, medium, high, or critical",
        }), {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      // Log the event to lattice_config as a structured record
      const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
      const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
      const supabase = createClient(supabaseUrl, serviceRoleKey);

      await supabase.from("lattice_config").upsert({
        key: `event_${source_node || "unknown"}_${Date.now()}`,
        value: JSON.stringify({
          source_node: source_node || "unknown",
          event_type,
          title,
          description,
          severity,
          payload: payload || {},
          received_at: new Date().toISOString(),
          original_timestamp: timestamp || null,
        }),
      });

      console.log(`[Sovereign Lattice] Ingested ${severity} event from ${source_node}: ${title}`);

      return new Response(JSON.stringify({
        success: true,
        message: "Event ingested into the Sovereign Lattice",
        event: { type: event_type, title, severity, source_node },
      }), {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    } catch (error) {
      console.error("[Sovereign Lattice] Ingest error:", error);
      return new Response(JSON.stringify({
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
  }

  // NODE-STATUS — return lattice node info
  if (action === "node-status") {
    return new Response(JSON.stringify({
      node: "digital-gallows",
      status: "operational",
      capabilities: ["ping", "ingest-event", "node-status"],
      timestamp: new Date().toISOString(),
    }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  return new Response(JSON.stringify({
    error: "Unknown action. Supported: ping, ingest-event, node-status",
  }), {
    status: 400,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
});

import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-platform-key, x-node-id",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  if (req.method !== "GET") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  try {
    // Validate platform key
    const platformKey = req.headers.get("X-Platform-Key");
    const nodeId = req.headers.get("X-Node-Id");
    
    const expectedKey = Deno.env.get("APEX_LATTICE_KEY");
    
    if (!platformKey || !nodeId) {
      return new Response(JSON.stringify({ 
        error: "Missing required headers: X-Platform-Key and X-Node-Id" 
      }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (platformKey !== expectedKey) {
      return new Response(JSON.stringify({ error: "Invalid platform key" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Create Supabase client with service role for metrics
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    
    const supabase = createClient(supabaseUrl, serviceRoleKey);

    // Gather live metrics from database
    const [
      { count: visitorCount },
      { count: accessRequestCount },
      { count: oracleConversationCount },
      { count: miningSignalCount },
      { count: regulatoryUpdateCount },
    ] = await Promise.all([
      supabase.from("visitor_profiles").select("*", { count: "exact", head: true }),
      supabase.from("access_requests").select("*", { count: "exact", head: true }),
      supabase.from("oracle_conversations").select("*", { count: "exact", head: true }),
      supabase.from("mining_signals").select("*", { count: "exact", head: true }),
      supabase.from("regulatory_updates").select("*", { count: "exact", head: true }),
    ]);

    // Get recent activity (last 24 hours)
    const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
    
    const [
      { count: recentVisitors },
      { count: recentRequests },
    ] = await Promise.all([
      supabase.from("visitor_profiles").select("*", { count: "exact", head: true })
        .gte("last_visit", twentyFourHoursAgo),
      supabase.from("access_requests").select("*", { count: "exact", head: true })
        .gte("created_at", twentyFourHoursAgo),
    ]);

    const response = {
      node: {
        id: "apex-infrastructure",
        name: "Apex Infrastructure",
        type: "operations-command",
        version: "1.0.0",
        status: "operational",
      },
      lattice: {
        network: "sovereign-lattice",
        role: "operations-node",
        connected_at: new Date().toISOString(),
      },
      metrics: {
        total_visitors: visitorCount ?? 0,
        total_access_requests: accessRequestCount ?? 0,
        total_oracle_conversations: oracleConversationCount ?? 0,
        total_mining_signals: miningSignalCount ?? 0,
        total_regulatory_updates: regulatoryUpdateCount ?? 0,
        recent_24h: {
          visitors: recentVisitors ?? 0,
          access_requests: recentRequests ?? 0,
        },
      },
      health: {
        database: "connected",
        timestamp: new Date().toISOString(),
      },
    };

    return new Response(JSON.stringify(response), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });

  } catch (error) {
    console.error("Node status error:", error);
    return new Response(JSON.stringify({ 
      error: "Internal server error",
      node: { id: "apex-infrastructure", status: "error" }
    }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});

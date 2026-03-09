import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-platform-key, x-node-id",
};

const NODES = [
  {
    id: "apex-bounty",
    name: "Apex Bounty",
    role: "orchestrator",
    url: "https://uvhpmohzdwbbsldotszy.supabase.co/functions/v1/sovereign-lattice",
  },
  {
    id: "apex-infrastructure",
    name: "Apex Infrastructure",
    role: "node",
    url: "https://bckoxhxwnuvyfgjmyrqa.supabase.co/functions/v1/sovereign-lattice",
  },
  {
    id: "digital-gallows",
    name: "Digital Gallows",
    role: "verifier",
    url: "https://bckoxhxwnuvyfgjmyrqa.supabase.co/functions/v1/sovereign-lattice",
  },
];

const THIS_NODE = {
  id: "apex-infrastructure",
  name: "Apex Infrastructure",
  role: "node",
  capabilities: ["ping", "ingest-event", "node-status", "lattice-heartbeat", "cross-node-sync", "multiverse-ping"],
};

function authenticate(req: Request): boolean {
  const latticeKey = Deno.env.get("APEX_LATTICE_KEY");
  const providedKey = req.headers.get("X-Platform-Key");
  return !!latticeKey && providedKey === latticeKey;
}

function jsonResponse(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const url = new URL(req.url);
  const action = url.searchParams.get("action");

  // ── PING — unauthenticated liveness ──
  if (action === "ping") {
    return jsonResponse({
      status: "alive",
      node: THIS_NODE.id,
      name: THIS_NODE.name,
      role: THIS_NODE.role,
      capabilities: THIS_NODE.capabilities,
      timestamp: new Date().toISOString(),
      uptime_seconds: Math.floor(performance.now() / 1000),
    });
  }

  // ── MULTIVERSE-PING — ping ALL nodes, return unified status ──
  if (action === "multiverse-ping") {
    const results = await Promise.allSettled(
      NODES.map(async (node) => {
        const start = Date.now();
        try {
          const ctrl = new AbortController();
          const timeout = setTimeout(() => ctrl.abort(), 4000);
          const res = await fetch(`${node.url}?action=ping`, {
            signal: ctrl.signal,
          });
          clearTimeout(timeout);
          const latency = Date.now() - start;
          if (res.ok) {
            const data = await res.json();
            return { ...node, status: "online", latency, data };
          }
          return { ...node, status: res.status === 401 ? "online" : "offline", latency, error: res.status };
        } catch (e) {
          return { ...node, status: "offline", latency: Date.now() - start, error: String(e) };
        }
      })
    );

    const nodes = results.map((r) => (r.status === "fulfilled" ? r.value : { status: "error" }));
    const onlineCount = nodes.filter((n: any) => n.status === "online").length;
    const latticeHealth = Math.round((onlineCount / NODES.length) * 100);

    return jsonResponse({
      lattice_health: latticeHealth,
      tri_verified: onlineCount === NODES.length,
      online_count: onlineCount,
      total_nodes: NODES.length,
      nodes,
      timestamp: new Date().toISOString(),
    });
  }

  // ── All other actions require platform key auth ──
  if (!authenticate(req)) {
    return jsonResponse({ error: "Unauthorized" }, 401);
  }

  // ── INGEST-EVENT — receive cross-node intelligence ──
  if (action === "ingest-event" && req.method === "POST") {
    try {
      const body = await req.json();
      const { source_node, event_type, title, description, severity, payload, timestamp } = body;

      if (!event_type || !title || !description || !severity) {
        return jsonResponse({ error: "Missing required fields: event_type, title, description, severity" }, 400);
      }

      const validSeverities = ["low", "medium", "high", "critical"];
      if (!validSeverities.includes(severity)) {
        return jsonResponse({ error: "Invalid severity. Must be: low, medium, high, or critical" }, 400);
      }

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

      return jsonResponse({
        success: true,
        message: "Event ingested into the Sovereign Lattice",
        event: { type: event_type, title, severity, source_node },
      });
    } catch (error) {
      console.error("[Sovereign Lattice] Ingest error:", error);
      return jsonResponse({ success: false, error: error instanceof Error ? error.message : "Unknown error" }, 500);
    }
  }

  // ── NODE-STATUS — return infrastructure metrics ──
  if (action === "node-status") {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, serviceRoleKey);

    const [{ count: eventCount }, { count: visitorCount }, { count: requestCount }] = await Promise.all([
      supabase.from("lattice_config").select("*", { count: "exact", head: true }),
      supabase.from("visitor_profiles").select("*", { count: "exact", head: true }),
      supabase.from("access_requests").select("*", { count: "exact", head: true }),
    ]);

    return jsonResponse({
      node: THIS_NODE.id,
      name: THIS_NODE.name,
      role: THIS_NODE.role,
      status: "operational",
      capabilities: THIS_NODE.capabilities,
      metrics: {
        lattice_events: eventCount || 0,
        tracked_visitors: visitorCount || 0,
        access_requests: requestCount || 0,
      },
      timestamp: new Date().toISOString(),
    });
  }

  // ── LATTICE-HEARTBEAT — broadcast status to hub ──
  if (action === "lattice-heartbeat" && req.method === "POST") {
    try {
      const latticeKey = Deno.env.get("APEX_LATTICE_KEY")!;
      const hubUrl = NODES.find((n) => n.role === "orchestrator")?.url;
      if (!hubUrl) return jsonResponse({ error: "No orchestrator configured" }, 500);

      const heartbeat = {
        source_node: THIS_NODE.id,
        event_type: "heartbeat",
        title: `${THIS_NODE.name} Heartbeat`,
        description: `Node ${THIS_NODE.id} reporting operational status`,
        severity: "low",
        payload: { role: THIS_NODE.role, capabilities: THIS_NODE.capabilities },
        timestamp: new Date().toISOString(),
      };

      const res = await fetch(`${hubUrl}?action=ingest-event`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Platform-Key": latticeKey,
          "X-Node-Id": THIS_NODE.id,
        },
        body: JSON.stringify(heartbeat),
      });

      const data = await res.json().catch(() => ({}));
      return jsonResponse({ success: res.ok, heartbeat_sent: true, hub_response: data });
    } catch (error) {
      return jsonResponse({ success: false, error: error instanceof Error ? error.message : "Unknown" }, 500);
    }
  }

  // ── CROSS-NODE-SYNC — sync critical data with other nodes ──
  if (action === "cross-node-sync" && req.method === "POST") {
    try {
      const body = await req.json();
      const { target_node, sync_type, data: syncData } = body;

      if (!target_node || !sync_type) {
        return jsonResponse({ error: "Missing target_node or sync_type" }, 400);
      }

      const target = NODES.find((n) => n.id === target_node);
      if (!target) return jsonResponse({ error: `Unknown node: ${target_node}` }, 404);

      const latticeKey = Deno.env.get("APEX_LATTICE_KEY")!;
      const res = await fetch(`${target.url}?action=ingest-event`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Platform-Key": latticeKey,
          "X-Node-Id": THIS_NODE.id,
        },
        body: JSON.stringify({
          source_node: THIS_NODE.id,
          event_type: `sync_${sync_type}`,
          title: `Cross-Node Sync: ${sync_type}`,
          description: `Sync from ${THIS_NODE.id} to ${target_node}`,
          severity: "low",
          payload: syncData || {},
          timestamp: new Date().toISOString(),
        }),
      });

      const responseData = await res.json().catch(() => ({}));
      return jsonResponse({ success: res.ok, synced_to: target_node, response: responseData });
    } catch (error) {
      return jsonResponse({ success: false, error: error instanceof Error ? error.message : "Unknown" }, 500);
    }
  }

  return jsonResponse({ error: "Unknown action. Supported: ping, multiverse-ping, ingest-event, node-status, lattice-heartbeat, cross-node-sync" }, 400);
});

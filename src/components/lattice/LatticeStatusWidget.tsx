import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Activity, Wifi, WifiOff, RefreshCw, Loader2, Zap } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface NodeStatus {
  id: string;
  name: string;
  role: string;
  status: "online" | "offline" | "checking";
  latency?: number;
}

interface LatticeState {
  nodes: NodeStatus[];
  latticeHealth: number;
  triVerified: boolean;
  lastCheck: string | null;
  checking: boolean;
}

export default function LatticeStatusWidget() {
  const [state, setState] = useState<LatticeState>({
    nodes: [
      { id: "apex-bounty", name: "Apex Bounty", role: "orchestrator", status: "checking" },
      { id: "apex-infrastructure", name: "Apex Infrastructure", role: "node", status: "checking" },
      { id: "digital-gallows", name: "Digital Gallows", role: "verifier", status: "checking" },
    ],
    latticeHealth: 0,
    triVerified: false,
    lastCheck: null,
    checking: true,
  });

  const checkLattice = useCallback(async () => {
    setState((s) => ({ ...s, checking: true }));
    try {
      const { data, error } = await supabase.functions.invoke("sovereign-lattice?action=multiverse-ping", {
        method: "GET",
      });

      if (error) throw error;

      const nodes = (data.nodes || []).map((n: any) => ({
        id: n.id,
        name: n.name,
        role: n.role,
        status: n.status === "online" ? "online" : "offline",
        latency: n.latency,
      }));

      setState({
        nodes,
        latticeHealth: data.lattice_health || 0,
        triVerified: data.tri_verified || false,
        lastCheck: new Date().toISOString(),
        checking: false,
      });
    } catch {
      setState((s) => ({
        ...s,
        checking: false,
        lastCheck: new Date().toISOString(),
      }));
    }
  }, []);

  useEffect(() => {
    checkLattice();
    const interval = setInterval(checkLattice, 10000);
    return () => clearInterval(interval);
  }, [checkLattice]);

  const getRoleLabel = (role: string) => {
    switch (role) {
      case "orchestrator": return "HUB";
      case "verifier": return "VERIFIER";
      default: return "NODE";
    }
  };

  return (
    <div className="rounded-xl bg-grey-900/60 border border-grey-800/50 backdrop-blur-xl overflow-hidden">
      {/* Header */}
      <div className="px-6 py-4 border-b border-grey-800/40 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="relative">
            <Zap className="w-5 h-5 text-primary" />
            {state.triVerified && (
              <motion.div
                className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-primary"
                animate={{ scale: [1, 1.3, 1], opacity: [1, 0.7, 1] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              />
            )}
          </div>
          <div>
            <h3 className="text-sm font-medium text-grey-200 tracking-wide">SOVEREIGN LATTICE</h3>
            <p className="text-[10px] text-grey-500 uppercase tracking-widest">Distributed Mesh Network</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-right">
            <div className={`text-lg font-mono font-medium ${state.latticeHealth >= 100 ? "text-primary" : state.latticeHealth >= 50 ? "text-yellow-500" : "text-destructive"}`}>
              {state.latticeHealth}%
            </div>
            <div className="text-[9px] text-grey-500 uppercase tracking-widest">Health</div>
          </div>
          <button
            onClick={checkLattice}
            disabled={state.checking}
            className="p-2 rounded-lg hover:bg-grey-800/50 transition-colors disabled:opacity-50"
          >
            {state.checking ? (
              <Loader2 className="w-4 h-4 animate-spin text-grey-400" />
            ) : (
              <RefreshCw className="w-4 h-4 text-grey-400" />
            )}
          </button>
        </div>
      </div>

      {/* Nodes */}
      <div className="p-4 space-y-2">
        {state.nodes.map((node, i) => (
          <motion.div
            key={node.id}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.1 }}
            className="flex items-center justify-between p-3 rounded-lg bg-grey-800/20 border border-grey-800/30"
          >
            <div className="flex items-center gap-3">
              {/* Status indicator */}
              <div className="relative">
                <div className={`w-3 h-3 rounded-full ${
                  node.status === "online" ? "bg-primary" :
                  node.status === "checking" ? "bg-grey-600" : "bg-destructive"
                }`} />
                {node.status === "online" && (
                  <motion.div
                    className="absolute inset-0 rounded-full bg-primary"
                    animate={{ scale: [1, 2], opacity: [0.5, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                )}
              </div>
              <div>
                <span className="text-sm text-grey-200">{node.name}</span>
                <span className="ml-2 text-[9px] px-1.5 py-0.5 rounded bg-grey-800/50 text-grey-400 uppercase tracking-wider">
                  {getRoleLabel(node.role)}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {node.latency !== undefined && (
                <span className="text-[10px] font-mono text-grey-500">{node.latency}ms</span>
              )}
              {node.status === "online" ? (
                <Wifi className="w-3.5 h-3.5 text-primary" />
              ) : node.status === "checking" ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin text-grey-500" />
              ) : (
                <WifiOff className="w-3.5 h-3.5 text-destructive" />
              )}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Connection lines visualization */}
      <div className="px-6 pb-4">
        <div className="relative h-12 flex items-center justify-center">
          <svg className="w-full h-full" viewBox="0 0 300 40">
            {/* Lines from each node to center */}
            {[50, 150, 250].map((x, i) => (
              <motion.line
                key={i}
                x1={x} y1="5" x2="150" y2="35"
                stroke={state.nodes[i]?.status === "online" ? "hsl(var(--primary))" : "hsl(var(--grey-700))"}
                strokeWidth="1"
                strokeDasharray="4 2"
                animate={{ opacity: state.nodes[i]?.status === "online" ? [0.3, 0.8, 0.3] : 0.2 }}
                transition={{ duration: 2, repeat: Infinity, delay: i * 0.3 }}
              />
            ))}
            {/* Center node */}
            <motion.circle
              cx="150" cy="35" r="3"
              fill={state.triVerified ? "hsl(var(--primary))" : "hsl(var(--grey-600))"}
              animate={state.triVerified ? { scale: [1, 1.5, 1], opacity: [0.8, 1, 0.8] } : {}}
              transition={{ duration: 2, repeat: Infinity }}
            />
          </svg>
        </div>
      </div>

      {/* Footer */}
      {state.lastCheck && (
        <div className="px-6 pb-4 flex items-center justify-between text-[9px] text-grey-600 uppercase tracking-widest">
          <span>Last check: {new Date(state.lastCheck).toLocaleTimeString()}</span>
          <span>Auto-refresh: 10s</span>
        </div>
      )}
    </div>
  );
}

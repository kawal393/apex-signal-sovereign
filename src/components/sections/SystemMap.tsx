import { motion, useInView } from "framer-motion";
import { Suspense, lazy, useRef } from "react";
import { Link } from "react-router-dom";
import LivingNode from "@/components/nodes/LivingNode";
import { getLiveNodes, getSealedNodes, getDormantNodes } from "@/data/nodes";

const UltimateMapBackground = lazy(() => import("@/components/3d/UltimateMapBackground"));

interface Node {
  id: number;
  name: string;
  status: "Active" | "Frozen" | "Dormant";
  category?: string;
  nodeId?: string; // For linking to detail pages
}

// Map from data/nodes.ts to the format expected by LivingNode
const liveNodesData = getLiveNodes();
const sealedNodesData = getSealedNodes();
const dormantNodesData = getDormantNodes();

// Convert to display format
const activeNodes: Node[] = liveNodesData.map((n, i) => ({
  id: i + 1,
  name: n.name,
  status: "Active" as const,
  category: n.domain?.split(' ')[0] || "Signals",
  nodeId: n.id,
}));

const frozenNodes: Node[] = sealedNodesData.map((n, i) => ({
  id: i + 10,
  name: n.name,
  status: "Frozen" as const,
  category: n.domain?.split(' ')[0] || "Sealed",
  nodeId: n.id,
}));

const dormantNodes: Node[] = dormantNodesData.map((n, i) => ({
  id: i + 20,
  name: n.name,
  status: "Dormant" as const,
  category: n.domain?.split(' ')[0] || "Reserved",
  nodeId: n.id,
}));

const allNodes = [...activeNodes, ...frozenNodes, ...dormantNodes];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 1, ease: [0.16, 1, 0.3, 1] },
  },
};

export default function SystemMap() {
  // Permanent performance fix: only mount the heavy WebGL scene when near viewport
  const mapRef = useRef<HTMLDivElement | null>(null);
  const mapInView = useInView(mapRef, { margin: '400px 0px', amount: 0.1 });

  return (
    <section id="system-map" className="relative py-24 md:py-32 border-b border-border/5">
      <div className="container mx-auto px-6 relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="text-center mb-16"
        >
          <span className="text-[10px] uppercase tracking-[0.5em] text-muted-foreground/40 mb-5 block font-medium">
            Network Topology
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-extralight text-foreground mb-6 tracking-wide">
            The <span className="text-gradient-gold font-medium">System Map</span>
          </h2>
          <p className="text-muted-foreground/50 max-w-2xl mx-auto text-base font-light leading-relaxed tracking-wide">
            A living constellation. Active nodes emit signal. Sealed nodes await conditions. Dormant nodes mark inevitable expansion.
          </p>
        </motion.div>
        
        {/* 3D Network Visualization */}
        <motion.div
          ref={mapRef}
          initial={{ opacity: 0, scale: 0.97 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.5, delay: 0.3 }}
          className="mb-20"
        >
          <div className="w-full h-[550px] md:h-[650px] relative">
            <Suspense fallback={
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-10 h-10 border border-primary/20 border-t-primary/60 rounded-full animate-spin" />
              </div>
            }>
              {mapInView ? (
                <UltimateMapBackground />
              ) : (
                <div className="absolute inset-0 rounded-md bg-muted/10 border border-border/10" />
              )}
            </Suspense>
          </div>
        </motion.div>

        {/* Living Stats - Updated with all three tiers */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: 0.4 }}
          className="grid grid-cols-4 gap-4 md:gap-12 max-w-3xl mx-auto mb-20"
        >
          {[
            { value: activeNodes.length, label: "Live", color: "text-primary" },
            { value: frozenNodes.length, label: "Sealed", color: "text-grey-400" },
            { value: dormantNodes.length, label: "Dormant", color: "text-grey-600" },
            { value: allNodes.length, label: "Total", color: "text-muted-foreground/40" },
          ].map((stat, i) => (
            <motion.div 
              key={i} 
              className="text-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5 + i * 0.1, duration: 0.8 }}
            >
              <motion.div 
                className={`text-2xl md:text-4xl font-extralight mb-3 ${stat.color}`}
              >
                {stat.value}
              </motion.div>
              <div className="text-[9px] md:text-[10px] uppercase tracking-[0.25em] text-muted-foreground/40 font-medium">
                {stat.label}
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Active Nodes - Living */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="mb-12"
        >
          <motion.h3 
            variants={itemVariants}
            className="text-[10px] uppercase tracking-[0.4em] text-primary/60 mb-6 text-center flex items-center justify-center gap-3"
          >
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            Live Nodes
          </motion.h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 max-w-5xl mx-auto">
            {activeNodes.map((node) => (
              <motion.div key={node.id} variants={itemVariants}>
                <Link to={`/nodes/${node.nodeId}`}>
                  <LivingNode {...node} />
                </Link>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Sealed Nodes */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="mb-12"
        >
          <motion.h3 
            variants={itemVariants}
            className="text-[10px] uppercase tracking-[0.4em] text-muted-foreground/30 mb-6 text-center flex items-center justify-center gap-3"
          >
            <span className="w-2 h-2 rounded-full bg-grey-600" />
            Sealed Nodes — Monitoring Active
          </motion.h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 max-w-4xl mx-auto">
            {frozenNodes.map((node) => (
              <motion.div key={node.id} variants={itemVariants}>
                <Link to={`/nodes/${node.nodeId}`}>
                  <LivingNode {...node} />
                </Link>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Dormant Nodes */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <motion.h3 
            variants={itemVariants}
            className="text-[10px] uppercase tracking-[0.4em] text-grey-700 mb-4 text-center flex items-center justify-center gap-3"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-grey-800" />
            Dormant Nodes — Infrastructure Reserved
          </motion.h3>
          <motion.p
            variants={itemVariants}
            className="text-grey-600 text-xs text-center mb-6 max-w-xl mx-auto"
          >
            Planned expansion across regulated, capital-intensive, and irreversible decision domains.
          </motion.p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 max-w-4xl mx-auto">
            {dormantNodes.map((node) => (
              <motion.div key={node.id} variants={itemVariants}>
                <Link to={`/nodes/${node.nodeId}`} className="opacity-50 hover:opacity-70 transition-opacity">
                  <LivingNode {...node} />
                </Link>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}

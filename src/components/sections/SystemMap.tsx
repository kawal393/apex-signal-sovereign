import { motion, useInView } from "framer-motion";
import { Suspense, lazy, useRef } from "react";
import LivingNode from "@/components/nodes/LivingNode";

const UltimateMapBackground = lazy(() => import("@/components/3d/UltimateMapBackground"));

interface Node {
  id: number;
  name: string;
  status: "Active" | "Frozen";
  category?: string;
}

// APEX-prefixed node names
const nodes: Node[] = [
  { id: 1, name: "APEX NDIS Watchtower", status: "Active", category: "Signals" },
  { id: 2, name: "APEX Corporate Translator", status: "Active", category: "Operations" },
  { id: 3, name: "APEX-ATA Ledger", status: "Active", category: "Trust" },
  { id: 4, name: "APEX Grant Radar", status: "Frozen", category: "Capital" },
  { id: 5, name: "APEX Insurance Drift", status: "Frozen", category: "Risk" },
  { id: 6, name: "APEX DCP Arbitrage", status: "Frozen", category: "Markets" },
  { id: 7, name: "APEX Grid Constraint", status: "Frozen", category: "Energy" },
  { id: 8, name: "APEX Pharma Zombie", status: "Frozen", category: "Health" },
  { id: 9, name: "APEX Verified", status: "Frozen", category: "Trust" },
  { id: 10, name: "APEX Optionality Vault", status: "Frozen", category: "Strategy" },
];

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
  const activeNodes = nodes.filter(n => n.status === "Active");
  const frozenNodes = nodes.filter(n => n.status === "Frozen");

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
            A living constellation. Active nodes emit signal. Sealed nodes await conditions.
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

        {/* Living Stats */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: 0.4 }}
          className="grid grid-cols-3 gap-8 md:gap-16 max-w-2xl mx-auto mb-20"
        >
          {[
            { value: activeNodes.length, label: "Active Nodes" },
            { value: frozenNodes.length, label: "Sealed Nodes" },
            { value: nodes.length, label: "Total Network" },
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
                className={`text-2xl md:text-4xl font-extralight mb-3 ${
                  i === 0 ? "text-primary" : "text-muted-foreground/40"
                }`}
              >
                {stat.value}
              </motion.div>
              <div className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground/40 font-medium">
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
            className="text-[10px] uppercase tracking-[0.4em] text-primary/60 mb-6 text-center"
          >
            Active Nodes
          </motion.h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-4xl mx-auto">
            {activeNodes.map((node) => (
              <motion.div key={node.id} variants={itemVariants}>
                <LivingNode {...node} />
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Frozen Nodes - Sealed */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <motion.h3 
            variants={itemVariants}
            className="text-[10px] uppercase tracking-[0.4em] text-muted-foreground/30 mb-6 text-center"
          >
            Sealed Nodes
          </motion.h3>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
            {frozenNodes.map((node) => (
              <motion.div key={node.id} variants={itemVariants}>
                <LivingNode {...node} />
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}

import { motion } from "framer-motion";
import { Suspense, lazy } from "react";

const MapBackground = lazy(() => import("@/components/3d/MapBackground"));

interface Node {
  id: number;
  name: string;
  status: "Active" | "Operating" | "Frozen";
  category?: string;
}

const nodes: Node[] = [
  { id: 1, name: "NDIS Watchtower", status: "Active", category: "Signals" },
  { id: 2, name: "Corporate Translator", status: "Active", category: "Operations" },
  { id: 3, name: "APEX-ATA Ledger", status: "Active", category: "Signals" },
  { id: 4, name: "Grant Radar", status: "Frozen", category: "Capital" },
  { id: 5, name: "Insurance Wording Drift Watchtower", status: "Frozen", category: "Risk" },
  { id: 6, name: "DCP Arbitrage Tracker", status: "Frozen", category: "Markets" },
  { id: 7, name: "Grid Constraint Watchtower", status: "Frozen", category: "Energy" },
  { id: 8, name: "Pharma Zombie Detector", status: "Frozen", category: "Health" },
  { id: 9, name: "APEX Verified", status: "Frozen", category: "Trust" },
  { id: 10, name: "Optionality Vault", status: "Frozen", category: "Strategy" },
];

const getStatusClass = (status: Node["status"]) => {
  switch (status) {
    case "Active":
      return "bg-[#00d4ff]/15 text-[#00d4ff] border-[#00d4ff]/40 shadow-[0_0_15px_rgba(0,212,255,0.25)]";
    case "Operating":
      return "bg-primary/15 text-primary border-primary/40";
    case "Frozen":
      return "bg-muted/10 text-muted-foreground border-muted/20";
  }
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.06 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 15, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] },
  },
};

export default function SystemMap() {
  return (
    <section id="system-map" className="px-6 py-16 border-b border-border relative overflow-hidden">
      <div className="max-w-7xl mx-auto relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="mb-8 text-center"
        >
          <span className="text-xs uppercase tracking-[0.3em] text-muted-foreground mb-3 block">
            Network Topology
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground tracking-tight">
            System Map
          </h2>
        </motion.div>

        {/* 3D Network Visualization */}
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="mb-12 glass-card border-primary/10 overflow-hidden rounded-lg"
        >
          <Suspense fallback={
            <div className="w-full h-[500px] md:h-[600px] flex items-center justify-center bg-background/50">
              <div className="w-10 h-10 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
            </div>
          }>
            <MapBackground />
          </Suspense>
        </motion.div>

        {/* Node Cards Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3"
        >
          {nodes.map((node) => (
            <motion.div
              key={node.id}
              variants={itemVariants}
              whileHover={{ scale: 1.03, y: -3 }}
              className="glass-card p-4 group hover:border-primary/30 transition-all duration-300 cursor-pointer relative overflow-hidden"
            >
              {/* Hover glow effect */}
              <div className="absolute inset-0 bg-gradient-radial from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              
              <div className="relative z-10">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <span className="text-[10px] text-muted-foreground/40 font-mono">
                    {String(node.id).padStart(2, "0")}
                  </span>
                  <span className={`text-[9px] py-0.5 px-2 rounded-full font-medium uppercase tracking-wider ${getStatusClass(node.status)}`}>
                    {node.status}
                  </span>
                </div>
                <h3 className="text-xs font-medium text-foreground leading-tight group-hover:text-primary transition-colors duration-300 mb-1">
                  {node.name}
                </h3>
                {node.category && (
                  <span className="text-[10px] text-muted-foreground/60 uppercase tracking-wider">
                    {node.category}
                  </span>
                )}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

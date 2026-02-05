import { motion } from "framer-motion";
import { Suspense, lazy } from "react";

const UltimateMapBackground = lazy(() => import("@/components/3d/UltimateMapBackground"));

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
      return "bg-[#00d4ff]/15 text-[#00d4ff] border-[#00d4ff]/50 shadow-[0_0_20px_rgba(0,212,255,0.3)]";
    case "Operating":
      return "bg-primary/15 text-primary border-primary/50";
    case "Frozen":
      return "bg-muted/10 text-muted-foreground border-muted/20";
  }
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.05 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] },
  },
};

export default function SystemMap() {
  return (
    <section id="system-map" className="relative py-20 md:py-28 border-b border-border/20">
      <div className="container mx-auto px-6 relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <span className="text-xs uppercase tracking-[0.35em] text-muted-foreground mb-4 block font-medium">
            Network Topology
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-extralight text-foreground mb-5">
            The <span className="text-gradient-gold font-medium">System Map</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-base md:text-lg font-light leading-relaxed">
            A living network of truth nodes. Active pathways illuminate. Frozen assets await resurrection.
          </p>
        </motion.div>
        
        {/* 3D Network Visualization */}
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: 0.2 }}
          className="mb-16"
        >
          <Suspense fallback={
            <div className="w-full h-[550px] md:h-[650px] flex items-center justify-center">
              <div className="w-16 h-16 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
            </div>
          }>
            <UltimateMapBackground />
          </Suspense>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="grid grid-cols-3 gap-6 md:gap-12 max-w-3xl mx-auto mb-16"
        >
          {[
            { value: "147", label: "Active Nodes", color: "text-[#00d4ff]" },
            { value: "2.4M", label: "Total Value", color: "text-primary" },
            { value: "89", label: "Frozen Assets", color: "text-muted-foreground" },
          ].map((stat, i) => (
            <div key={i} className="text-center">
              <div className={`text-2xl md:text-4xl font-light ${stat.color} mb-2`}>
                {stat.value}
              </div>
              <div className="text-xs uppercase tracking-[0.2em] text-muted-foreground font-medium">
                {stat.label}
              </div>
            </div>
          ))}
        </motion.div>

        {/* Node Cards Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4"
        >
          {nodes.map((node) => (
            <motion.div
              key={node.id}
              variants={itemVariants}
              whileHover={{ scale: 1.04, y: -4 }}
              className="glass-card p-5 group hover:border-primary/40 transition-all duration-400 cursor-pointer relative overflow-hidden"
            >
              {/* Hover glow effect */}
              <div className="absolute inset-0 bg-gradient-radial from-primary/8 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-400" />
              
              <div className="relative z-10">
                <div className="flex items-start justify-between gap-2 mb-3">
                  <span className="text-[10px] text-muted-foreground/50 font-mono">
                    {String(node.id).padStart(2, "0")}
                  </span>
                  <span className={`text-[9px] py-1 px-2.5 rounded-full font-semibold uppercase tracking-wider ${getStatusClass(node.status)}`}>
                    {node.status}
                  </span>
                </div>
                <h3 className="text-sm font-medium text-foreground leading-tight group-hover:text-primary transition-colors duration-300 mb-2">
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

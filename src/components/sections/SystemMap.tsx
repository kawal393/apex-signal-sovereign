import { motion } from "framer-motion";
import { Suspense, lazy } from "react";

const UltimateMapBackground = lazy(() => import("@/components/3d/UltimateMapBackground"));

interface Node {
  id: number;
  name: string;
  status: "Active" | "Frozen";
  category?: string;
}

// APEX-prefixed node names (MANDATORY)
const nodes: Node[] = [
  { id: 1, name: "APEX NDIS Watchtower", status: "Active", category: "Signals" },
  { id: 2, name: "APEX Corporate Translator", status: "Active", category: "Operations" },
  { id: 3, name: "APEX-ATA Ledger", status: "Active", category: "Trust" },
  { id: 4, name: "APEX Grant Radar", status: "Frozen", category: "Capital" },
  { id: 5, name: "APEX Insurance Wording Drift", status: "Frozen", category: "Risk" },
  { id: 6, name: "APEX DCP Arbitrage Tracker", status: "Frozen", category: "Markets" },
  { id: 7, name: "APEX Grid Constraint Watchtower", status: "Frozen", category: "Energy" },
  { id: 8, name: "APEX Pharma Zombie Detector", status: "Frozen", category: "Health" },
  { id: 9, name: "APEX Verified", status: "Frozen", category: "Trust" },
  { id: 10, name: "APEX Optionality Vault", status: "Frozen", category: "Strategy" },
];

const getStatusStyles = (status: Node["status"]) => {
  if (status === "Active") {
    return {
      badge: "bg-[hsl(42,90%,55%,0.12)] text-primary border-primary/40",
      card: "border-primary/20 hover:border-primary/40",
      glow: "shadow-[0_0_40px_hsl(42,90%,55%,0.08)]",
    };
  }
  return {
    badge: "bg-muted/20 text-muted-foreground/50 border-muted/20",
    card: "border-border/10 opacity-60",
    glow: "",
  };
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30, scale: 0.96 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.9, ease: [0.16, 1, 0.3, 1] },
  },
};

export default function SystemMap() {
  return (
    <section id="system-map" className="relative py-24 md:py-32 border-b border-border/10">
      <div className="container mx-auto px-6 relative z-10">
        {/* Section Header - ritualistic */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="text-center mb-16"
        >
          <span className="text-[10px] uppercase tracking-[0.5em] text-muted-foreground/50 mb-5 block font-medium">
            Network Topology
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-extralight text-foreground mb-6 tracking-wide">
            The <span className="text-gradient-gold font-medium">APEX System Map</span>
          </h2>
          <p className="text-muted-foreground/60 max-w-2xl mx-auto text-base font-light leading-relaxed tracking-wide">
            A living constellation of truth nodes. Active pathways illuminate with energy. 
            Frozen assets await resurrection.
          </p>
        </motion.div>
        
        {/* 3D Network Visualization */}
        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.5, delay: 0.3 }}
          className="mb-20"
        >
          <Suspense fallback={
            <div className="w-full h-[550px] md:h-[650px] flex items-center justify-center">
              <motion.div 
                className="w-12 h-12 border border-primary/30 border-t-primary rounded-full"
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              />
            </div>
          }>
            <UltimateMapBackground />
          </Suspense>
        </motion.div>

        {/* Stats - ceremonial presentation */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: 0.4 }}
          className="grid grid-cols-3 gap-8 md:gap-16 max-w-3xl mx-auto mb-20"
        >
          {[
            { value: "147", label: "Active Nodes", active: true },
            { value: "2.4M", label: "Total Value", active: true },
            { value: "89", label: "Frozen Assets", active: false },
          ].map((stat, i) => (
            <motion.div 
              key={i} 
              className="text-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5 + i * 0.1, duration: 0.8 }}
            >
              <div className={`text-2xl md:text-4xl font-extralight mb-3 ${
                stat.active ? "text-primary" : "text-muted-foreground/40"
              }`}>
                {stat.value}
              </div>
              <div className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground/50 font-medium">
                {stat.label}
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Node Cards Grid - floating in Z-space */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4"
        >
          {nodes.map((node) => {
            const styles = getStatusStyles(node.status);
            return (
              <motion.div
                key={node.id}
                variants={itemVariants}
                whileHover={{ 
                  scale: 1.04, 
                  y: -8,
                  rotateX: 2,
                  rotateY: -1,
                }}
                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                className={`glass-card p-5 group transition-all duration-700 cursor-pointer relative overflow-hidden ${styles.card} ${styles.glow}`}
              >
                {/* Hover energy glow */}
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                
                {/* Top energy line */}
                <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                
                <div className="relative z-10">
                  <div className="flex items-start justify-between gap-2 mb-4">
                    <span className="text-[9px] text-muted-foreground/30 font-mono tracking-wider">
                      {String(node.id).padStart(2, "0")}
                    </span>
                    <span className={`text-[8px] py-1 px-2.5 rounded-full font-semibold uppercase tracking-[0.15em] border ${styles.badge}`}>
                      {node.status}
                    </span>
                  </div>
                  <h3 className={`text-sm font-medium leading-snug mb-3 transition-colors duration-500 ${
                    node.status === "Active" 
                      ? "text-foreground group-hover:text-primary" 
                      : "text-muted-foreground/50"
                  }`}>
                    {node.name}
                  </h3>
                  {node.category && (
                    <span className="text-[9px] text-muted-foreground/40 uppercase tracking-[0.2em]">
                      {node.category}
                    </span>
                  )}
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}

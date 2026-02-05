import { motion } from "framer-motion";
import { Suspense, lazy } from "react";

const NetworkMap = lazy(() => import("@/components/3d/NetworkMap"));

interface Node {
  id: number;
  name: string;
  status: "Active" | "Operating" | "Frozen";
}

const nodes: Node[] = [
  { id: 1, name: "NDIS Watchtower", status: "Active" },
  { id: 2, name: "Corporate Translator", status: "Active" },
  { id: 3, name: "APEX-ATA Ledger", status: "Active" },
  { id: 4, name: "Grant Radar", status: "Frozen" },
  { id: 5, name: "Insurance Wording Drift Watchtower", status: "Frozen" },
  { id: 6, name: "DCP Arbitrage Tracker", status: "Frozen" },
  { id: 7, name: "Grid Constraint Watchtower", status: "Frozen" },
  { id: 8, name: "Pharma Zombie Detector", status: "Frozen" },
  { id: 9, name: "APEX Verified", status: "Frozen" },
  { id: 10, name: "Optionality Vault", status: "Frozen" },
];

const getStatusClass = (status: Node["status"]) => {
  switch (status) {
    case "Active":
      return "status-active";
    case "Operating":
      return "status-operating";
    case "Frozen":
      return "status-frozen";
  }
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.5,
      ease: [0.16, 1, 0.3, 1],
    },
  },
};

export default function SystemMap() {
  return (
    <section id="system-map" className="px-6 py-20 border-b border-border relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[600px] bg-gradient-radial from-status-active/10 to-transparent blur-[100px]" />
      </div>
      
      <div className="max-w-7xl mx-auto relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="mb-10 text-center"
        >
          <span className="text-xs uppercase tracking-[0.3em] text-muted-foreground mb-3 block">
            Network Topology
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground tracking-tight">
            System Map
          </h2>
          <p className="mt-3 text-muted-foreground">
            10 operational nodes. Real-time status monitoring.
          </p>
        </motion.div>

        {/* 3D Network Visualization */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="mb-16 glass-card border-primary/10 overflow-hidden"
        >
          <Suspense fallback={
            <div className="w-full h-[400px] md:h-[500px] flex items-center justify-center">
              <div className="w-8 h-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
            </div>
          }>
            <NetworkMap />
          </Suspense>
        </motion.div>

        {/* Nodes Grid */}
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
              whileHover={{ scale: 1.02, y: -2 }}
              className="glass-card p-4 group hover:border-primary/30 transition-all duration-300 cursor-pointer"
            >
              <div className="flex items-start justify-between gap-2 mb-3">
                <span className="text-[10px] text-muted-foreground/50 font-mono">
                  {String(node.id).padStart(2, "0")}
                </span>
                <span className={`${getStatusClass(node.status)} text-[10px] py-0.5 px-2`}>
                  {node.status}
                </span>
              </div>
              <h3 className="text-xs font-medium text-foreground leading-tight group-hover:text-primary transition-colors duration-300">
                {node.name}
              </h3>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

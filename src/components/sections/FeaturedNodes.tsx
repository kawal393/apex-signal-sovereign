import { motion } from "framer-motion";
import { Eye, FileText, Shield, Activity } from "lucide-react";

interface FeaturedNode {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  category: string;
}

const featuredNodes: FeaturedNode[] = [
  {
    id: "ndis",
    name: "NDIS Watchtower",
    description: "Compliance enforcement signals and risk monitoring.",
    icon: <Eye className="w-5 h-5" />,
    category: "Signals",
  },
  {
    id: "translator",
    name: "Corporate Translator",
    description: "Daily verdicts translating complex reports into action.",
    icon: <FileText className="w-5 h-5" />,
    category: "Operations",
  },
  {
    id: "ledger",
    name: "APEX-ATA Ledger",
    description: "Immutable audit trail of verdicts and signals.",
    icon: <Shield className="w-5 h-5" />,
    category: "Trust",
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.12 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 25, scale: 0.98 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] },
  },
};

export default function FeaturedNodes() {
  return (
    <section id="featured-nodes" className="px-6 py-20 border-b border-border relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/4 w-[400px] h-[400px] bg-gradient-radial from-primary/8 to-transparent blur-[80px]" />
        <div className="absolute top-1/2 right-1/4 w-[300px] h-[300px] bg-gradient-radial from-[#00d4ff]/5 to-transparent blur-[60px]" />
      </div>
      
      <div className="max-w-7xl mx-auto relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="mb-12 text-center"
        >
          <span className="text-xs uppercase tracking-[0.3em] text-muted-foreground mb-3 block">
            Active Nodes
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground tracking-tight">
            Featured Nodes
          </h2>
        </motion.div>

        {/* Featured Cards - Enhanced styling like reference */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-3 gap-5"
        >
          {featuredNodes.map((node) => (
            <motion.div
              key={node.id}
              variants={itemVariants}
              whileHover={{ scale: 1.02, y: -5 }}
              className="glass-card p-6 group hover:border-primary/40 transition-all duration-500 relative overflow-hidden cursor-pointer"
            >
              {/* Top glow line */}
              <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              
              {/* Hover glow effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-primary/8 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              
              <div className="relative z-10">
                {/* Header row with icon and status */}
                <div className="flex items-center justify-between mb-5">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center group-hover:bg-primary/20 group-hover:border-primary/40 transition-all duration-300">
                    <span className="text-primary">
                      {node.icon}
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Activity className="w-3 h-3 text-[#00d4ff]" />
                    <span className="text-[10px] uppercase tracking-wider text-[#00d4ff] font-medium">
                      Active
                    </span>
                  </div>
                </div>

                {/* Category tag */}
                <div className="mb-3">
                  <span className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground/60 bg-muted/30 px-2 py-1 rounded">
                    {node.category}
                  </span>
                </div>

                {/* Content */}
                <h3 className="text-lg font-semibold text-foreground mb-2 group-hover:text-primary transition-colors duration-300">
                  {node.name}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {node.description}
                </p>

                {/* Bottom action hint */}
                <div className="mt-5 pt-4 border-t border-border/50 flex items-center justify-between">
                  <span className="text-xs text-muted-foreground/60 uppercase tracking-wider">
                    View Node
                  </span>
                  <span className="text-primary opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    →
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

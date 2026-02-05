import { motion } from "framer-motion";
import { useState } from "react";

interface FeaturedNode {
  id: string;
  name: string;
  description: string;
  longDescription: string;
  sigil: string;
  category: string;
  status: "active" | "processing" | "dormant";
  signalCount: number;
}

// APEX-prefixed names (MANDATORY)
const featuredNodes: FeaturedNode[] = [
  {
    id: "ndis",
    name: "APEX NDIS Watchtower",
    description: "Compliance enforcement signals and sovereign risk monitoring.",
    longDescription: "Real-time surveillance of NDIS compliance landscapes. Automated detection of regulatory drift, provider risk scoring, and early warning systems for sector-wide disruptions.",
    sigil: "◈",
    category: "Signals",
    status: "active",
    signalCount: 1247,
  },
  {
    id: "translator",
    name: "APEX Corporate Translator",
    description: "Daily verdicts translating complex reports into action.",
    longDescription: "Natural language processing of dense corporate communications. Extracting intent, risk vectors, and actionable intelligence from quarterly reports, board minutes, and regulatory filings.",
    sigil: "◇",
    category: "Operations",
    status: "processing",
    signalCount: 892,
  },
  {
    id: "ledger",
    name: "APEX-ATA Ledger",
    description: "Immutable audit trail of verdicts and sovereign signals.",
    longDescription: "Cryptographically secured record of all system decisions. Complete lineage tracking from signal to verdict, ensuring transparency and accountability in algorithmic governance.",
    sigil: "◆",
    category: "Trust",
    status: "active",
    signalCount: 3421,
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.2 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 50, scale: 0.96 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 1.2, ease: [0.16, 1, 0.3, 1] },
  },
};

export default function FeaturedNodes() {
  const [expandedNode, setExpandedNode] = useState<string | null>(null);
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);

  const getStatusColor = (status: FeaturedNode["status"]) => {
    switch (status) {
      case "active": return "bg-primary text-primary";
      case "processing": return "bg-silver-mid text-silver-light";
      case "dormant": return "bg-grey-600 text-grey-400";
    }
  };

  return (
    <section id="featured-nodes" className="px-6 py-28 md:py-36 border-b border-border/5 relative overflow-hidden">
      {/* Background energy */}
      <div className="absolute inset-0 pointer-events-none">
        <motion.div 
          className="absolute top-1/2 left-1/3 w-[600px] h-[600px] rounded-full"
          style={{
            background: 'radial-gradient(circle, hsl(42 90% 55% / 0.03) 0%, transparent 70%)',
          }}
          animate={{ opacity: [0.3, 0.6, 0.3], scale: [1, 1.15, 1] }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>
      
      <div className="max-w-6xl mx-auto relative z-10">
        {/* Section Header - BIGGER FONTS */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          viewport={{ once: true }}
          className="mb-20 text-center"
        >
          <span className="text-[11px] uppercase tracking-[0.6em] text-grey-500 mb-6 block font-medium">
            Active Nodes
          </span>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-extralight text-grey-300 tracking-wide">
            Featured <span className="text-gradient-gold font-medium">APEX Nodes</span>
          </h2>
          <p className="text-lg text-grey-500 mt-6 max-w-xl mx-auto font-light">
            The infrastructure that never sleeps. Click to explore.
          </p>
        </motion.div>

        {/* Featured Cards - Interactive with expanded state */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          {featuredNodes.map((node) => {
            const isExpanded = expandedNode === node.id;
            const isHovered = hoveredNode === node.id;
            
            return (
              <motion.div
                key={node.id}
                variants={itemVariants}
                onMouseEnter={() => setHoveredNode(node.id)}
                onMouseLeave={() => setHoveredNode(null)}
                onClick={() => setExpandedNode(isExpanded ? null : node.id)}
                whileHover={{ 
                  scale: 1.03, 
                  y: -12,
                }}
                animate={{
                  height: isExpanded ? 'auto' : 'auto',
                }}
                transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                className={`glass-card p-8 group cursor-pointer transition-all duration-700 relative overflow-hidden ${
                  isExpanded ? 'border-primary/40 shadow-[0_0_80px_hsl(42,95%,55%,0.1)]' : 
                  isHovered ? 'border-primary/25' : ''
                }`}
              >
                {/* Top energy line */}
                <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                
                {/* Hover glow */}
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                
                <div className="relative z-10">
                  {/* Header with sigil and status */}
                  <div className="flex items-center justify-between mb-6">
                    <motion.div 
                      className="w-14 h-14 rounded-xl bg-grey-800/80 border border-grey-700/50 flex items-center justify-center group-hover:bg-primary/10 group-hover:border-primary/30 transition-all duration-500"
                      animate={isHovered ? { rotate: 5 } : { rotate: 0 }}
                    >
                      <span className="text-primary text-2xl">{node.sigil}</span>
                    </motion.div>
                    
                    <div className="flex items-center gap-3">
                      <motion.div 
                        className={`w-2 h-2 rounded-full ${getStatusColor(node.status).split(' ')[0]}`}
                        animate={{ opacity: [0.5, 1, 0.5], scale: [0.9, 1.1, 0.9] }}
                        transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
                      />
                      <span className={`text-[10px] uppercase tracking-[0.2em] font-medium ${getStatusColor(node.status).split(' ')[1]}`}>
                        {node.status}
                      </span>
                    </div>
                  </div>

                  {/* Category */}
                  <div className="mb-4">
                    <span className="text-[10px] uppercase tracking-[0.25em] text-grey-600 bg-grey-800/50 px-3 py-1.5 rounded">
                      {node.category}
                    </span>
                  </div>

                  {/* Content - BIGGER FONTS */}
                  <h3 className="text-xl md:text-2xl font-medium text-foreground mb-4 group-hover:text-primary transition-colors duration-500 tracking-wide">
                    {node.name}
                  </h3>
                  <p className="text-base text-grey-400 leading-relaxed">
                    {node.description}
                  </p>

                  {/* Expanded content */}
                  <motion.div
                    initial={false}
                    animate={{ 
                      height: isExpanded ? 'auto' : 0,
                      opacity: isExpanded ? 1 : 0,
                      marginTop: isExpanded ? 24 : 0,
                    }}
                    transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                    className="overflow-hidden"
                  >
                    <div className="pt-6 border-t border-grey-800/30">
                      <p className="text-sm text-grey-500 leading-relaxed mb-6">
                        {node.longDescription}
                      </p>
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="text-[10px] uppercase tracking-widest text-grey-600 block mb-1">
                            Signals Processed
                          </span>
                          <span className="text-2xl font-light text-primary">
                            {node.signalCount.toLocaleString()}
                          </span>
                        </div>
                        <motion.button
                          className="px-4 py-2 rounded-md border border-primary/30 text-primary text-sm hover:bg-primary/10 transition-colors"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={(e) => e.stopPropagation()}
                        >
                          View Node →
                        </motion.button>
                      </div>
                    </div>
                  </motion.div>

                  {/* Bottom action */}
                  <motion.div 
                    className="mt-8 pt-6 border-t border-grey-800/20 flex items-center justify-between"
                    animate={{ opacity: isExpanded ? 0 : 1 }}
                  >
                    <span className="text-[10px] text-grey-600 uppercase tracking-[0.2em]">
                      {isExpanded ? '' : 'Click to expand'}
                    </span>
                    <motion.span 
                      className="text-primary/50 group-hover:text-primary transition-all duration-500"
                      animate={{ rotate: isExpanded ? 90 : 0 }}
                    >
                      →
                    </motion.span>
                  </motion.div>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}

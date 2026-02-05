import { motion } from "framer-motion";

interface FeaturedNode {
  id: string;
  name: string;
  description: string;
  sigil: string;
  category: string;
}

// APEX-prefixed names (MANDATORY)
const featuredNodes: FeaturedNode[] = [
  {
    id: "ndis",
    name: "APEX NDIS Watchtower",
    description: "Compliance enforcement signals and sovereign risk monitoring.",
    sigil: "◈",
    category: "Signals",
  },
  {
    id: "translator",
    name: "APEX Corporate Translator",
    description: "Daily verdicts translating complex reports into action.",
    sigil: "◇",
    category: "Operations",
  },
  {
    id: "ledger",
    name: "APEX-ATA Ledger",
    description: "Immutable audit trail of verdicts and sovereign signals.",
    sigil: "◆",
    category: "Trust",
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 40, scale: 0.97 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 1, ease: [0.16, 1, 0.3, 1] },
  },
};

export default function FeaturedNodes() {
  return (
    <section id="featured-nodes" className="px-6 py-24 md:py-32 border-b border-border/10 relative overflow-hidden">
      {/* Background energy */}
      <div className="absolute inset-0 pointer-events-none">
        <motion.div 
          className="absolute top-1/2 left-1/3 w-[500px] h-[500px] rounded-full"
          style={{
            background: 'radial-gradient(circle, hsl(42 90% 55% / 0.04) 0%, transparent 70%)',
          }}
          animate={{ opacity: [0.3, 0.6, 0.3], scale: [1, 1.1, 1] }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>
      
      <div className="max-w-6xl mx-auto relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          viewport={{ once: true }}
          className="mb-16 text-center"
        >
          <span className="text-[10px] uppercase tracking-[0.5em] text-muted-foreground/50 mb-5 block font-medium">
            Active Nodes
          </span>
          <h2 className="text-3xl md:text-4xl font-extralight text-foreground tracking-wide">
            Featured <span className="text-gradient-gold font-medium">APEX Nodes</span>
          </h2>
        </motion.div>

        {/* Featured Cards - floating in Z-space */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          {featuredNodes.map((node) => (
            <motion.div
              key={node.id}
              variants={itemVariants}
              whileHover={{ 
                scale: 1.03, 
                y: -10,
                rotateX: 1,
                rotateY: -0.5,
              }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              className="glass-card p-7 group hover:border-primary/30 transition-all duration-700 relative overflow-hidden cursor-pointer"
              style={{
                boxShadow: '0 20px 60px hsl(0 0% 0% / 0.3), 0 0 40px hsl(42 90% 55% / 0.03)',
              }}
            >
              {/* Top energy line */}
              <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
              
              {/* Hover glow */}
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
              
              <div className="relative z-10">
                {/* Header with sigil and status */}
                <div className="flex items-center justify-between mb-6">
                  <motion.div 
                    className="w-12 h-12 rounded-lg bg-primary/8 border border-primary/15 flex items-center justify-center group-hover:bg-primary/12 group-hover:border-primary/30 transition-all duration-500"
                    whileHover={{ rotate: 5 }}
                  >
                    <span className="text-primary text-xl">{node.sigil}</span>
                  </motion.div>
                  
                  <div className="flex items-center gap-2">
                    <motion.div 
                      className="w-1.5 h-1.5 rounded-full bg-primary"
                      animate={{ opacity: [0.5, 1, 0.5], scale: [0.9, 1.1, 0.9] }}
                      transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                    />
                    <span className="text-[9px] uppercase tracking-[0.2em] text-primary/70 font-medium">
                      Active
                    </span>
                  </div>
                </div>

                {/* Category */}
                <div className="mb-3">
                  <span className="text-[9px] uppercase tracking-[0.25em] text-muted-foreground/40 bg-muted/20 px-2.5 py-1 rounded">
                    {node.category}
                  </span>
                </div>

                {/* Content */}
                <h3 className="text-lg font-medium text-foreground mb-3 group-hover:text-primary transition-colors duration-500 tracking-wide">
                  {node.name}
                </h3>
                <p className="text-sm text-muted-foreground/60 leading-relaxed">
                  {node.description}
                </p>

                {/* Bottom action */}
                <div className="mt-6 pt-5 border-t border-border/20 flex items-center justify-between">
                  <span className="text-[10px] text-muted-foreground/40 uppercase tracking-[0.2em]">
                    View Node
                  </span>
                  <motion.span 
                    className="text-primary/50 group-hover:text-primary transition-all duration-500"
                    initial={{ x: 0, opacity: 0 }}
                    whileHover={{ x: 4 }}
                    animate={{ opacity: 1 }}
                  >
                    →
                  </motion.span>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

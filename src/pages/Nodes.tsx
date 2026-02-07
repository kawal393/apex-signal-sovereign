import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ExternalLink } from "lucide-react";
import ApexNav from "@/components/layout/ApexNav";
import ApexFooter from "@/components/layout/ApexFooter";
import { ApexButton } from "@/components/ui/apex-button";
import MobileVoid from "@/components/effects/MobileVoid";
import { useIsMobile } from "@/hooks/use-mobile";
import { getLiveNodes, getSealedNodes } from "@/data/nodes";

const Nodes = () => {
  const isMobile = useIsMobile();
  const liveNodes = getLiveNodes();
  const sealedNodes = getSealedNodes();

  return (
    <div className="relative min-h-screen bg-black">
      {/* Background */}
      {isMobile && <MobileVoid />}
      <div className="fixed inset-0 pointer-events-none z-[1]">
        <div className="absolute inset-0 bg-black/80" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,hsl(42_50%_20%/0.08)_0%,transparent_60%)]" />
      </div>

      <ApexNav />

      <main className="relative z-10 pt-32 pb-24 px-6">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
            className="text-center mb-20"
          >
            <span className="text-[10px] uppercase tracking-[0.6em] text-grey-500 block mb-4">
              Signal Infrastructure
            </span>
            <h1 className="text-5xl md:text-7xl font-semibold text-foreground tracking-wide mb-6">
              NODES
            </h1>
            <p className="text-lg md:text-xl text-grey-400 max-w-2xl mx-auto">
              Active monitoring engines and sealed future capacity.
            </p>
          </motion.div>

          {/* Live Nodes Grid */}
          <section className="mb-24">
            <motion.h2
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-xs uppercase tracking-[0.4em] text-primary mb-8 flex items-center gap-3"
            >
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              Live Nodes
            </motion.h2>

            <div className="grid md:grid-cols-2 gap-6">
              {liveNodes.map((node, i) => (
                <motion.div
                  key={node.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 + i * 0.1, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                  className="glass-card p-8 group"
                >
                  <div className="flex items-start justify-between mb-6">
                    <div>
                      <span className="status-active mb-3 inline-block">LIVE</span>
                      <h3 className="text-xl font-medium text-foreground mt-2">{node.name}</h3>
                    </div>
                  </div>

                  <p className="text-grey-400 text-sm leading-relaxed mb-8">
                    {node.purpose}
                  </p>

                  <div className="flex flex-col sm:flex-row gap-3">
                    <ApexButton 
                      variant="primary" 
                      size="sm" 
                      className="flex-1 gap-2"
                      onClick={() => window.open(node.externalUrl, '_blank', 'noopener,noreferrer')}
                    >
                      OPEN LIVE TOOL
                      <ExternalLink className="w-3.5 h-3.5" />
                    </ApexButton>
                    <Link to="/request-access" className="flex-1">
                      <ApexButton variant="outline" size="sm" className="w-full">
                        REQUEST VERDICT BRIEF
                      </ApexButton>
                    </Link>
                  </div>

                  <Link
                    to={`/nodes/${node.id}`}
                    className="block mt-4 text-[10px] uppercase tracking-[0.3em] text-grey-500 hover:text-grey-300 transition-colors text-center"
                  >
                    Read Node →
                  </Link>
                </motion.div>
              ))}
            </div>
          </section>

          {/* Sealed Nodes Grid */}
          <section>
            <motion.h2
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="text-xs uppercase tracking-[0.4em] text-grey-500 mb-8 flex items-center gap-3"
            >
              <span className="w-2 h-2 rounded-full bg-grey-600" />
              Sealed Nodes
            </motion.h2>

            <div className="grid md:grid-cols-3 gap-6">
              {sealedNodes.map((node, i) => (
                <motion.div
                  key={node.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                  className="glass-card p-6 opacity-60"
                >
                  <span className="status-frozen mb-3 inline-block">SEALED</span>
                  <h3 className="text-lg font-medium text-grey-300 mt-2 mb-4">{node.name}</h3>
                  <p className="text-grey-500 text-sm leading-relaxed mb-6">
                    {node.purpose}
                  </p>
                  <Link to="/request-access">
                    <ApexButton variant="ghost" size="sm" className="w-full text-grey-400">
                      REQUEST VERDICT BRIEF
                    </ApexButton>
                  </Link>

                  <Link
                    to={`/nodes/${node.id}`}
                    className="block mt-3 text-[10px] uppercase tracking-[0.3em] text-grey-600 hover:text-grey-400 transition-colors text-center"
                  >
                    Read Node →
                  </Link>
                </motion.div>
              ))}
            </div>
          </section>
        </div>
      </main>

      <ApexFooter />
    </div>
  );
};

export default Nodes;

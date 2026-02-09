import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ExternalLink, Lock, CircleDot } from "lucide-react";
import ApexNav from "@/components/layout/ApexNav";
import ApexFooter from "@/components/layout/ApexFooter";
import { ApexButton } from "@/components/ui/apex-button";
import MobileVoid from "@/components/effects/MobileVoid";
import { useIsMobile } from "@/hooks/use-mobile";
import { getLiveNodes, getSealedNodes, getDormantNodes } from "@/data/nodes";

const Nodes = () => {
  const isMobile = useIsMobile();
  const liveNodes = getLiveNodes();
  const sealedNodes = getSealedNodes();
  const dormantNodes = getDormantNodes();

  // Global index tracker for sequence numbers
  let globalIndex = 0;

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
            className="text-center mb-12"
          >
            <span className="text-[10px] uppercase tracking-[0.6em] text-grey-500 block mb-4">
              Empire Architecture
            </span>
            <h1 className="text-5xl md:text-7xl font-semibold text-foreground tracking-wide mb-6">
              THE <span className="text-gradient-gold">CONSTELLATION</span>
            </h1>
            <p className="text-lg md:text-xl text-grey-400 max-w-2xl mx-auto leading-relaxed">
              A sovereign infrastructure spanning regulated, capital-intensive, and irreversible domains.
            </p>
          </motion.div>

          {/* Phase Indicator */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="flex flex-wrap items-center justify-center gap-4 md:gap-8 mb-16"
          >
            {[
              { id: 1, label: "Authority Online", status: "current" },
              { id: 2, label: "Sealed Expansion", status: "upcoming" },
              { id: 3, label: "Global Dominion", status: "future" },
            ].map((phase, i) => (
              <div key={phase.id} className="flex items-center gap-4">
                <div className={`flex items-center gap-3 px-4 py-2 rounded-full border ${
                  phase.status === 'current' 
                    ? 'border-primary/40 bg-primary/5 text-primary' 
                    : phase.status === 'upcoming'
                    ? 'border-grey-600/30 bg-grey-800/20 text-grey-400'
                    : 'border-grey-700/20 bg-grey-900/10 text-grey-600'
                }`}>
                  <span className={`text-[10px] uppercase tracking-[0.3em] font-medium ${
                    phase.status === 'current' ? 'text-primary' : ''
                  }`}>
                    Phase {phase.id}
                  </span>
                  <span className="text-[9px] tracking-wide">
                    {phase.label}
                  </span>
                  {phase.status === 'current' && (
                    <motion.span
                      animate={{ scale: [1, 1.2, 1], opacity: [0.6, 1, 0.6] }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className="w-1.5 h-1.5 rounded-full bg-primary"
                    />
                  )}
                </div>
                {i < 2 && (
                  <div className="hidden md:block w-8 h-px bg-gradient-to-r from-grey-700/40 to-transparent" />
                )}
              </div>
            ))}
          </motion.div>

          {/* Network Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="grid grid-cols-4 gap-6 max-w-xl mx-auto mb-20"
          >
            {[
              { count: liveNodes.length, label: "Live", color: "text-primary" },
              { count: sealedNodes.length, label: "Sealed", color: "text-grey-400" },
              { count: dormantNodes.length, label: "Dormant", color: "text-grey-600" },
              { count: liveNodes.length + sealedNodes.length + dormantNodes.length, label: "Total", color: "text-foreground/60" },
            ].map((stat, i) => (
              <div key={i} className="text-center">
                <span className={`text-3xl font-light ${stat.color}`}>{stat.count}</span>
                <span className="block text-[10px] uppercase tracking-[0.3em] text-grey-500 mt-2">{stat.label}</span>
              </div>
            ))}
          </motion.div>

          {/* Live Nodes Grid */}
          <section className="mb-24">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="flex items-center gap-3 mb-8"
            >
              <motion.span
                animate={{ scale: [1, 1.3, 1], opacity: [0.6, 1, 0.6] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="w-2.5 h-2.5 rounded-full bg-primary"
              />
              <h2 className="text-xs uppercase tracking-[0.4em] text-primary font-medium">
                Live Nodes — System Operational
              </h2>
            </motion.div>

            <div className="grid md:grid-cols-2 gap-6">
              {liveNodes.map((node, i) => {
                const sequenceNum = String(globalIndex + 1).padStart(2, '0');
                globalIndex++;
                return (
                  <motion.div
                    key={node.id}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 + i * 0.1, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                    className="glass-card p-8 group border-primary/20 hover:border-primary/40 transition-all duration-500 hover:shadow-[0_0_60px_hsl(42_95%_55%/0.15)]"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-start gap-4">
                        <span className="text-3xl font-light text-primary/70 tabular-nums">{sequenceNum}</span>
                        <div>
                          <div className="flex items-center gap-3 mb-2">
                            <span className="status-active">LIVE</span>
                            <motion.span
                              animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
                              transition={{ duration: 2, repeat: Infinity }}
                              className="w-1.5 h-1.5 rounded-full bg-primary"
                            />
                            <span className="text-[9px] uppercase tracking-[0.2em] text-primary/60">Pulse: ACTIVE</span>
                          </div>
                          <h3 className="text-xl font-medium text-foreground group-hover:text-primary transition-colors">{node.name}</h3>
                        </div>
                      </div>
                    </div>

                    {node.domain && (
                      <p className="text-[10px] uppercase tracking-[0.2em] text-grey-500 mb-4">
                        {node.domain}
                      </p>
                    )}

                    <p className="text-grey-400 text-sm leading-relaxed mb-8">
                      {node.purpose}
                    </p>

                    <div className="flex flex-col sm:flex-row gap-3">
                      <ApexButton 
                        variant="primary" 
                        size="sm" 
                        className="flex-1 gap-2"
                        onClick={(e) => {
                          e.preventDefault();
                          const newWindow = window.open(node.externalUrl, '_blank', 'noopener,noreferrer');
                          if (!newWindow || newWindow.closed || typeof newWindow.closed === 'undefined') {
                            window.location.href = node.externalUrl!;
                          }
                        }}
                      >
                        OPEN LIVE TOOL
                        <ExternalLink className="w-3.5 h-3.5" />
                      </ApexButton>
                      <Link to="/request-verdict" className="flex-1">
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
                );
              })}
            </div>
          </section>

          {/* Sealed Nodes Grid */}
          <section className="mb-24">
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="flex items-center gap-3 mb-8"
            >
              <Lock className="w-4 h-4 text-grey-500" />
              <h2 className="text-xs uppercase tracking-[0.4em] text-grey-400 font-medium">
                Sealed Nodes — Monitoring Active
              </h2>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {sealedNodes.map((node, i) => {
                const sequenceNum = String(globalIndex + 1).padStart(2, '0');
                globalIndex++;
                return (
                  <motion.div
                    key={node.id}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                    className="glass-card p-6 opacity-80 hover:opacity-100 transition-all duration-500 group border-grey-600/20 hover:border-grey-500/40"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <span className="text-2xl font-light text-grey-500/60 tabular-nums">{sequenceNum}</span>
                      <div className="flex items-center gap-2">
                        <Lock className="w-3 h-3 text-grey-500/60" />
                        <span className="w-1.5 h-1.5 rounded-full bg-grey-500" />
                      </div>
                    </div>
                    <span className="status-frozen mb-3 inline-block">SEALED</span>
                    <h3 className="text-lg font-medium text-grey-300 mt-2 mb-2">{node.name}</h3>
                    {node.domain && (
                      <p className="text-[9px] uppercase tracking-[0.15em] text-grey-600 mb-4">
                        {node.domain}
                      </p>
                    )}
                    <p className="text-grey-500 text-sm leading-relaxed mb-4">
                      {node.purpose}
                    </p>
                    <span className="text-[9px] uppercase tracking-[0.2em] text-grey-600 block mb-4">
                      Pulse: MONITORING
                    </span>
                    <Link to={`/nodes/${node.id}`}>
                      <ApexButton variant="ghost" size="sm" className="w-full text-grey-400">
                        View Details →
                      </ApexButton>
                    </Link>
                  </motion.div>
                );
              })}
            </div>
          </section>

          {/* Dormant Nodes Grid */}
          <section>
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="flex items-center gap-3 mb-4"
            >
              <CircleDot className="w-4 h-4 text-grey-600" />
              <h2 className="text-xs uppercase tracking-[0.4em] text-grey-500 font-medium">
                Dormant Nodes — Infrastructure Reserved
              </h2>
            </motion.div>

            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="text-grey-600 text-sm mb-8 max-w-2xl"
            >
              Capacity allocated for future activation. Each node represents planned expansion 
              into regulated, capital-intensive, or irreversible decision domains.
            </motion.p>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {dormantNodes.map((node, i) => {
                const sequenceNum = String(globalIndex + 1).padStart(2, '0');
                globalIndex++;
                return (
                  <motion.div
                    key={node.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.05, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                    className="glass-card p-5 opacity-50 hover:opacity-70 transition-all duration-500 border-grey-800/30 group"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <span className="text-xl font-light text-grey-700/60 tabular-nums">{sequenceNum}</span>
                      <CircleDot className="w-3 h-3 text-grey-700" />
                    </div>
                    <div className="flex items-center gap-2 mb-3">
                      <span className="w-1.5 h-1.5 rounded-full bg-grey-700" />
                      <span className="text-[9px] uppercase tracking-[0.2em] text-grey-700">Dormant</span>
                    </div>
                    <h3 className="text-sm font-medium text-grey-500 mb-2">{node.name}</h3>
                    {node.domain && (
                      <p className="text-[9px] text-grey-700 leading-relaxed mb-3">
                        {node.domain}
                      </p>
                    )}
                    <span className="text-[8px] uppercase tracking-[0.2em] text-grey-700 block mb-4">
                      Pulse: RESERVED
                    </span>
                    <Link
                      to={`/nodes/${node.id}`}
                      className="block text-[9px] uppercase tracking-[0.2em] text-grey-700 hover:text-grey-500 transition-colors"
                    >
                      View Reserved →
                    </Link>
                  </motion.div>
                );
              })}
            </div>
          </section>
        </div>
      </main>

      <ApexFooter />
    </div>
  );
};

export default Nodes;

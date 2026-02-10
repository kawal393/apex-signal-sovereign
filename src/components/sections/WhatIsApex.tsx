import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ExternalLink, ArrowRight } from "lucide-react";
import { ApexButton } from "@/components/ui/apex-button";

/**
 * WHAT IS APEX INFRASTRUCTURE
 * 
 * Deep paragraph section with clear CTAs.
 * Institutional, calm, powerful. No sales language.
 */
export default function WhatIsApex() {
  const handleOpenWatchtower = () => {
    const url = "https://kawal393.github.io/ndis-signal-board/";
    const newWindow = window.open(url, '_blank', 'noopener,noreferrer');
    if (!newWindow || newWindow.closed || typeof newWindow.closed === 'undefined') {
      window.location.href = url;
    }
  };

  return (
    <section className="relative py-28 md:py-36 border-b border-border/5">
      {/* Subtle background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,hsl(42_30%_8%/0.04)_0%,transparent_60%)]" />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-4xl mx-auto"
        >
          {/* Section Header */}
          <div className="text-center mb-12">
            <motion.span
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2, duration: 1 }}
              className="text-[10px] uppercase tracking-[0.6em] text-grey-500 block mb-5"
            >
              Foundation
            </motion.span>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-semibold text-foreground tracking-wide">
              What is <span className="text-gradient-gold">Apex Infrastructure</span>?
            </h2>
          </div>

          {/* Deep Paragraph */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3, duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
            className="text-center space-y-8 mb-16"
          >
            <p className="text-base md:text-lg lg:text-xl text-grey-200 leading-[1.9] max-w-3xl mx-auto">
              APEX Infrastructure is a multi-domain regulatory intelligence layer built for operators who cannot afford ambiguity. 
              We monitor public enforcement signals across Australian sectors (NDIS, energy/grid, pharmaceuticals, corporate) 
              and convert them into structured Verdict Briefs — clear calls under uncertainty with a validation test and a stop condition.
            </p>
            
            <p className="text-base md:text-lg text-grey-400 leading-[1.8] max-w-3xl mx-auto">
              Some nodes are public, some are sealed for partners, and some remain dormant until unlocked. 
              The objective is simple: reduce decision risk before it becomes cost.
            </p>

            <p className="text-sm md:text-base text-grey-500 leading-[1.8] max-w-2xl mx-auto italic">
              The engine remains disciplined by design: structured judgment, recorded memory, and clear boundaries.
            </p>
          </motion.div>

          {/* Output Snapshot — 3 Capability Bullets */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5, duration: 1, ease: [0.16, 1, 0.3, 1] }}
            className="grid md:grid-cols-3 gap-6 mb-16"
          >
            {[
              {
                icon: "◆",
                title: "Live Monitoring Nodes",
                description: "Public intelligence across regulated sectors",
              },
              {
                icon: "◈",
                title: "Verdict Briefs",
                description: "Advance / Hold / Partner-Only / Drop",
              },
              {
                icon: "◇",
                title: "ATA Ledger",
                description: "Institutional memory — immutable and citeable",
              },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.6 + i * 0.1, duration: 0.8 }}
                className="glass-card p-6 text-center border-grey-700/30 hover:border-primary/30 hover:shadow-[0_0_30px_hsl(42_95%_55%/0.08)] transition-all duration-300 group"
              >
                <span className="text-primary text-2xl mb-4 block group-hover:scale-110 transition-transform duration-300">
                  {item.icon}
                </span>
                <h3 className="text-sm uppercase tracking-[0.2em] text-foreground font-medium mb-2">
                  {item.title}
                </h3>
                <p className="text-grey-500 text-sm">
                  {item.description}
                </p>
              </motion.div>
            ))}
          </motion.div>

          {/* Decision Authority block */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.65, duration: 1 }}
            className="glass-card p-8 mb-16 border-grey-700/30 text-center"
          >
            <h3 className="text-xl md:text-2xl font-semibold text-foreground mb-4">
              Apex Is a Decision Layer — <span className="text-grey-500">Not a Tool</span>
            </h3>
            <p className="text-grey-400 leading-relaxed max-w-2xl mx-auto mb-6">
              Information, analysis, and recommendations all serve the decision.
              Apex is the decision itself — accountable, recorded, and final.
              You invoke Apex when other systems can no longer decide.
            </p>
            <Link to="/how-it-works">
              <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }}>
                <ApexButton variant="ghost" className="gap-2 text-primary hover:text-foreground">
                  How Apex Works
                  <ArrowRight className="w-4 h-4" />
                </ApexButton>
              </motion.div>
            </Link>
          </motion.div>

          {/* CTA Block - Primary Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.7, duration: 1, ease: [0.16, 1, 0.3, 1] }}
            className="text-center space-y-6"
          >
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              {/* Primary CTA */}
              <motion.button
                onClick={handleOpenWatchtower}
                whileHover={{ scale: 1.03, y: -3 }}
                whileTap={{ scale: 0.98 }}
                transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                className="group px-8 py-4 rounded-md bg-primary/10 border border-primary/40 text-primary font-medium tracking-[0.15em] uppercase text-sm flex items-center gap-3 hover:bg-primary/20 hover:border-primary/60 hover:shadow-[0_0_40px_hsl(42_95%_55%/0.2)] transition-all duration-300"
              >
                View Live NDIS Watchtower
                <ExternalLink className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </motion.button>

              {/* Secondary CTA */}
              <Link to="/request-verdict">
                <motion.div
                  whileHover={{ scale: 1.03, y: -3 }}
                  whileTap={{ scale: 0.98 }}
                  transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                >
                  <ApexButton 
                    variant="outline" 
                    size="lg"
                    className="px-8 py-4 tracking-[0.15em]"
                  >
                    Request Verdict Brief
                  </ApexButton>
                </motion.div>
              </Link>
            </div>

            {/* Tertiary Link */}
            <Link 
              to="/ledger" 
              className="inline-flex items-center gap-2 text-grey-400 hover:text-grey-200 text-sm tracking-wide transition-colors duration-300 group"
            >
              See ATA Ledger
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </Link>

            {/* Authority Line */}
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 1, duration: 0.8 }}
              className="text-grey-600 text-xs tracking-wide pt-4"
            >
              Verdicts are recorded to the ATA Ledger. Sealed entries are citeable.
            </motion.p>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

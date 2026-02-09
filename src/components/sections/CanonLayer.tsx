import { motion } from "framer-motion";

/**
 * Canon Layer Section
 * "APEX Infrastructure — A Judgment Standard for the AI Age"
 * 
 * PERFORMANCE OPTIMIZED: Reduced animation complexity, GPU-accelerated transforms only.
 * Institutional, restrained, inevitable positioning.
 */
export default function CanonLayer() {
  return (
    <section className="relative py-24 md:py-32 border-b border-border/5">
      {/* Subtle background - simplified for performance */}
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{ 
          background: 'radial-gradient(ellipse at center, hsl(42 30% 10% / 0.03) 0%, transparent 60%)',
          willChange: 'auto'
        }}
      />

      <div className="container mx-auto px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-4xl mx-auto"
          style={{ willChange: 'transform, opacity' }}
        >
          {/* Header - Simplified animation */}
          <div className="text-center mb-12">
            <span className="text-[10px] uppercase tracking-[0.6em] text-grey-500 block mb-5">
              Foundation
            </span>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-semibold text-foreground tracking-wide leading-tight">
              APEX <span className="text-gradient-gold">Infrastructure</span>
            </h2>
            <p className="text-grey-500 text-sm tracking-wide mt-4">
              A Judgment Standard for the AI Age
            </p>
          </div>

          {/* Core statements - optimized with reduced motion */}
          <div className="space-y-6 text-center">
            <p className="text-lg md:text-xl text-grey-200 leading-relaxed max-w-3xl mx-auto font-light">
              Apex Infrastructure is a sovereign decision-authority system operating across regulated, 
              capital-intensive, and irreversible domains.
            </p>
            
            <p className="text-base md:text-lg text-grey-400 leading-relaxed max-w-3xl mx-auto">
              In an era where AI produces unlimited answers, Apex exists to issue structured human judgment 
              and record it immutably.
            </p>
          </div>

          {/* Constraints - static render, no per-item animation */}
          <div className="mt-12 pt-10 border-t border-grey-800/20">
            <div className="grid md:grid-cols-3 gap-8 text-center">
              {[
                { statement: "Apex does not execute.", subtext: "Observation only" },
                { statement: "Apex does not represent.", subtext: "Independence preserved" },
                { statement: "Apex issues Verdict Briefs.", subtext: "Authority recorded" },
              ].map((item, i) => (
                <div
                  key={i}
                  className="py-4 border-l border-grey-700/15 first:border-l-0 md:border-l"
                >
                  <p className="text-base md:text-lg text-foreground font-medium tracking-wide mb-2">
                    {item.statement}
                  </p>
                  <span className="text-[9px] uppercase tracking-[0.25em] text-grey-600">
                    {item.subtext}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* ATA Ledger reference - simple fade */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="mt-12 text-center"
          >
            <p className="text-grey-500 text-sm tracking-wide">
              All verdicts are maintained in the <span className="text-grey-300 font-medium">ATA Ledger</span> — 
              a permanent record of decision authority.
            </p>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

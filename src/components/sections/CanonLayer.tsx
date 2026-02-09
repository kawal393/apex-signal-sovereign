import { motion } from "framer-motion";

/**
 * Canon Layer Section
 * "APEX Infrastructure — A Judgment Standard for the AI Age"
 * 
 * Institutional, restrained, inevitable positioning.
 * This section establishes the foundational identity of APEX.
 */
export default function CanonLayer() {
  return (
    <section className="relative py-32 md:py-40 border-b border-border/5">
      {/* Subtle background presence */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,hsl(42_30%_10%/0.04)_0%,transparent_70%)]" />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1.8, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-4xl mx-auto"
        >
          {/* Header */}
          <div className="text-center mb-16">
            <motion.span
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3, duration: 1.2 }}
              className="text-[10px] uppercase tracking-[0.6em] text-grey-500 block mb-6"
            >
              Foundation
            </motion.span>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-light text-foreground tracking-wide leading-tight">
              APEX Infrastructure — <br className="hidden md:block" />
              <span className="text-gradient-gold font-normal">A Judgment Standard for the AI Age</span>
            </h2>
          </div>

          {/* Core statements */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4, duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
            className="space-y-8 text-center"
          >
            <p className="text-lg md:text-xl text-grey-300 leading-relaxed max-w-3xl mx-auto">
              Apex Infrastructure is a decision-authority system operating across regulated, 
              capital-intensive, and irreversible domains.
            </p>
            
            <p className="text-lg md:text-xl text-grey-400 leading-relaxed max-w-3xl mx-auto">
              In an era where AI produces unlimited answers, Apex exists to issue 
              structured human judgment, recorded immutably.
            </p>
          </motion.div>

          {/* Constraints - institutional clarity */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.6, duration: 1, ease: [0.16, 1, 0.3, 1] }}
            className="mt-16 pt-12 border-t border-grey-800/30"
          >
            <div className="grid md:grid-cols-3 gap-8 text-center">
              {[
                { statement: "Apex does not execute.", subtext: "Observation only" },
                { statement: "Apex does not represent.", subtext: "Independence preserved" },
                { statement: "Apex issues Verdict Briefs.", subtext: "Authority recorded" },
              ].map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.8 + i * 0.15, duration: 0.8 }}
                  className="group"
                >
                  <p className="text-foreground font-medium tracking-wide mb-2">
                    {item.statement}
                  </p>
                  <span className="text-[10px] uppercase tracking-[0.3em] text-grey-600">
                    {item.subtext}
                  </span>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* ATA Ledger reference */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 1.2, duration: 1 }}
            className="mt-16 text-center"
          >
            <p className="text-grey-500 text-sm tracking-wide">
              All verdicts are maintained in the <span className="text-grey-400">ATA Ledger</span> — 
              a permanent record of decision authority.
            </p>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ApexButton } from "@/components/ui/apex-button";

const verdictLadder = [
  {
    step: "01",
    title: "Free Public Signal",
    description: "Informational output from public nodes. Not citeable. No identity required.",
    status: "open",
  },
  {
    step: "02",
    title: "Identity Authorization",
    description: "Verification of requesting entity. Nominal fee ($1 AUD). Required to proceed.",
    status: "gate",
  },
  {
    step: "03",
    title: "Watermarked Conditional Preview",
    description: "Unsealed verdict draft. For internal review only. Not citeable or recordable.",
    status: "preview",
  },
  {
    step: "04",
    title: "Sealed Verdict Brief",
    description: "Final verdict with ATA Ledger seal. Citeable. Permanently recorded.",
    status: "sealed",
  },
];

const ConditionalVerdicts = () => {
  return (
    <section className="relative py-32 px-6 border-t border-border/5">
      <div className="max-w-5xl mx-auto">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          className="text-center mb-20"
        >
          <span className="text-[10px] uppercase tracking-[0.6em] text-grey-300 block mb-4">
            Verdict Authority
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-semibold text-foreground tracking-wide mb-6">
            Conditional Verdicts
          </h2>
          <p className="text-grey-400 max-w-2xl mx-auto leading-relaxed">
            APEX provides structured decision verdicts: Advance, Hold, Partner-Only, or Drop. 
            Public tools provide signals and information only. Official decisions require a Conditional Verdict request.
          </p>
        </motion.div>

        {/* Core Distinction */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 1, delay: 0.2 }}
          className="glass-card p-8 mb-16"
        >
          <div className="grid md:grid-cols-2 gap-8">
            <div className="border-l-2 border-grey-700 pl-6">
              <h3 className="text-lg font-medium text-foreground mb-3">Public Nodes</h3>
              <p className="text-grey-400 text-base leading-relaxed">
                Free signals, open tools, real-time data. Useful for awareness and monitoring. 
                Output is informational only and carries no institutional weight.
              </p>
            </div>
            <div className="border-l-2 border-primary/60 pl-6">
              <h3 className="text-lg font-medium text-foreground mb-3">Conditional Verdicts</h3>
              <p className="text-grey-400 text-base leading-relaxed">
                Structured assessments for irreversible decisions. Begin unsealed (preview) and become 
                citeable only when sealed and recorded in the ATA Ledger.
              </p>
            </div>
          </div>
        </motion.div>

        {/* The Verdict Ladder */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 1, delay: 0.3 }}
          className="mb-16"
        >
          <h3 className="text-[11px] uppercase tracking-[0.4em] text-grey-300 text-center mb-10">
            The Verdict Ladder
          </h3>
          <div className="space-y-4">
            {verdictLadder.map((item, i) => (
              <motion.div
                key={item.step}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 * i, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                className={`glass-card p-6 flex gap-6 items-start ${
                  item.status === 'sealed' ? 'border-primary/30' : ''
                }`}
              >
                <span className={`text-2xl font-light ${
                  item.status === 'sealed' ? 'text-primary' : 'text-grey-600'
                }`}>
                  {item.step}
                </span>
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h4 className="text-lg font-medium text-foreground">{item.title}</h4>
                    {item.status === 'open' && (
                      <span className="text-[9px] uppercase tracking-[0.2em] px-2 py-0.5 rounded bg-grey-800/50 text-grey-300">
                        Public
                      </span>
                    )}
                    {item.status === 'gate' && (
                      <span className="text-[9px] uppercase tracking-[0.2em] px-2 py-0.5 rounded bg-primary/10 text-primary/70">
                        Gate
                      </span>
                    )}
                    {item.status === 'preview' && (
                      <span className="text-[9px] uppercase tracking-[0.2em] px-2 py-0.5 rounded bg-grey-700/50 text-grey-400">
                        Unsealed
                      </span>
                    )}
                    {item.status === 'sealed' && (
                      <span className="text-[9px] uppercase tracking-[0.2em] px-2 py-0.5 rounded bg-primary/20 text-primary">
                        Citeable
                      </span>
                    )}
                  </div>
                  <p className="text-grey-400 text-base">{item.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Confidence Lock */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 1, delay: 0.4 }}
          className="glass-card p-8 mb-16 border-grey-700/50"
        >
          <h3 className="text-[11px] uppercase tracking-[0.4em] text-grey-300 mb-6">
            Confidence Lock
          </h3>
          <div className="space-y-4 text-grey-400 text-base leading-relaxed">
            <p>
              APEX guarantees delivery, structure, and completeness of all Verdict Briefs within the stated window.
            </p>
            <p>
              Refunds apply only if the Verdict is incomplete, structurally invalid, or not delivered 
              within the agreed timeframe.
            </p>
            <p className="text-grey-300 border-t border-grey-800 pt-4 mt-4">
              APEX does not issue refunds based on disagreement with verdict content, 
              external outcomes, or subjective interpretation.
            </p>
          </div>
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: 0.5 }}
          className="text-center"
        >
          <Link to="/request-verdict">
            <ApexButton variant="primary" size="lg">
              Request Conditional Verdict
            </ApexButton>
          </Link>
          <p className="text-grey-600 text-base mt-4 tracking-wide">
            Verdicts begin unsealed. Sealing is optional and separate.
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default ConditionalVerdicts;

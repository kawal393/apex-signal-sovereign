import { motion } from "framer-motion";

const comparisons = [
  { label: "Google", what: "Warehouse of information", limit: "No accountability, no structure" },
  { label: "AI", what: "Infinite analysis", limit: "No judgment, no stop condition" },
  { label: "Consultants", what: "Options without accountability", limit: "No recorded attestation" },
  { label: "APEX", what: "Decision + recorded attestation", limit: "Verdict with test + kill rule", isApex: true },
];

export default function WhyApexGrid() {
  return (
    <section className="relative py-24 border-b border-border/5">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-4xl mx-auto"
        >
          <div className="text-center mb-12">
            <span className="text-[10px] uppercase tracking-[0.6em] text-grey-500 block mb-5">
              Comparison
            </span>
            <h2 className="text-3xl md:text-4xl font-semibold text-foreground tracking-wide">
              Why Apex — not Google, not AI, not <span className="text-grey-500">consultants</span>
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-4 mb-10">
            {comparisons.map((c, i) => (
              <motion.div
                key={c.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08, duration: 0.6 }}
                className={`glass-card p-6 ${c.isApex ? 'border-primary/30 bg-primary/5' : 'border-grey-700/30'}`}
              >
                <span className={`text-[9px] uppercase tracking-[0.2em] ${c.isApex ? 'text-primary' : 'text-grey-600'} block mb-2`}>
                  {c.label}
                </span>
                <p className={`text-sm font-medium ${c.isApex ? 'text-foreground' : 'text-grey-300'} mb-1`}>{c.what}</p>
                <p className={`text-xs ${c.isApex ? 'text-primary/70' : 'text-grey-600'}`}>{c.limit}</p>
              </motion.div>
            ))}
          </div>

          <motion.blockquote
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="text-center text-lg md:text-xl text-grey-300 italic max-w-2xl mx-auto"
          >
            "Apex is not here to help you think. It is here to help you decide."
          </motion.blockquote>
        </motion.div>
      </div>
    </section>
  );
}

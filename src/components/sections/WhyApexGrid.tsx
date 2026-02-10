import { motion } from "framer-motion";

const layers = [
  {
    label: "Execution Layer",
    description: "Tools, software, agents, teams",
    output: "Executes once a decision exists",
  },
  {
    label: "Recommendation Layer",
    description: "Consultants, analysts, advisors",
    output: "Offers options, no accountability",
  },
  {
    label: "Information Layer",
    description: "Google, search, AI models",
    output: "Infinite answers, zero ownership",
  },
];

const inevitabilityPoints = [
  "Because execution keeps getting cheaper, while wrong decisions get more expensive",
  "Because regulated, irreversible domains cannot rely on consensus or probability alone",
  "Because once a decision is sealed and cited, it becomes precedent — not opinion",
];

const ease = [0.16, 1, 0.3, 1] as const;

export default function WhyApexGrid() {
  return (
    <section className="relative py-28 md:py-36 border-b border-border/5">
      <div className="container mx-auto px-6">
        <div className="max-w-4xl mx-auto">

          {/* ── 1. Headline ── */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1.2, ease }}
            className="text-center mb-16"
          >
            <span className="text-[10px] uppercase tracking-[0.6em] text-grey-500 block mb-5">
              Doctrine
            </span>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-semibold text-foreground tracking-wide mb-8">
              Why Apex Exists
            </h2>
            <p className="text-grey-300 text-base md:text-lg leading-[1.9] max-w-3xl mx-auto">
              Apex does not compete with Google, AI, consultants, or tools.
              Those systems generate information, options, or execution.
              Apex exists to terminate uncertainty — by issuing a single accountable decision
              when the cost of being wrong is irreversible.
            </p>
          </motion.div>

          {/* ── 2. A Different Layer Entirely ── */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1.2, ease }}
            className="mb-20"
          >
            <h3 className="text-2xl md:text-3xl font-semibold text-foreground text-center mb-8">
              Apex Is Not a Tool. It Is a Decision Layer.
            </h3>
            <div className="max-w-3xl mx-auto space-y-6 text-grey-300 text-base md:text-lg leading-[1.9]">
              <p>
                Google retrieves information.{" "}
                <span className="text-grey-500">AI generates possibilities.</span>{" "}
                Consultants recommend options.{" "}
                <span className="text-grey-500">Software executes instructions.</span>
              </p>
              <p>
                None of them are accountable for the final call.
              </p>
              <p>
                Apex exists where decisions cannot be crowdsourced, optimized, or retried —
                when capital, reputation, compliance, or time only move forward.
              </p>
              <p className="text-foreground font-medium">
                Apex does not help you do more.
                Apex tells you what must be done — or stopped.
              </p>
            </div>
          </motion.div>

          {/* ── 3. The Decision Stack ── */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1, ease }}
            className="mb-20"
          >
            <h3 className="text-2xl md:text-3xl font-semibold text-foreground text-center mb-10">
              The Decision Stack
            </h3>

            <div className="space-y-3 max-w-2xl mx-auto">
              {/* Lower layers */}
              {layers.map((layer, i) => (
                <motion.div
                  key={layer.label}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08, duration: 0.6 }}
                  className="glass-card p-5 border-grey-700/30"
                >
                  <span className="text-[9px] uppercase tracking-[0.2em] text-grey-600 block mb-1">
                    {layer.label}
                  </span>
                  <p className="text-sm text-grey-400 mb-1">{layer.description}</p>
                  <p className="text-xs text-grey-600">→ {layer.output}</p>
                </motion.div>
              ))}

              {/* Apex — elevated */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3, duration: 0.8 }}
                className="glass-card p-6 border-primary/30 bg-primary/5 relative"
              >
                <div className="absolute -top-3 left-6 px-3 py-0.5 bg-black border border-primary/40 rounded text-[9px] uppercase tracking-[0.3em] text-primary">
                  Decision Authority
                </div>
                <span className="text-[9px] uppercase tracking-[0.2em] text-primary block mb-1 mt-1">
                  Apex — Decision Authority Layer
                </span>
                <p className="text-sm text-foreground font-medium mb-1">
                  Verdicts, tests, kill rules
                </p>
                <p className="text-xs text-primary/70">
                  → One accountable judgment, recorded and irreversible
                </p>
              </motion.div>

              <motion.p
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.5, duration: 0.8 }}
                className="text-center text-sm text-grey-500 italic pt-4"
              >
                Apex operates only at the point where ambiguity must end.
              </motion.p>
            </div>
          </motion.div>

          {/* ── 4. Non-Substitution Doctrine ── */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1.2, ease }}
            className="mb-20"
          >
            <h3 className="text-xl md:text-2xl font-semibold text-foreground text-center mb-8">
              Apex Does Not Replace Anything.{" "}
              <span className="text-grey-500">It Commands the Moment They Fail.</span>
            </h3>
            <div className="max-w-2xl mx-auto text-grey-300 text-base leading-[1.9] space-y-6">
              <p>
                Use Google. Use AI. Use consultants. Use software.
              </p>
              <p>
                Then, when all of them disagree — or when delay becomes risk — Apex issues the verdict.
              </p>
              <p className="text-foreground font-medium">
                You don't adopt Apex instead of other systems.
                You invoke Apex when other systems can no longer decide.
              </p>
            </div>
          </motion.div>

          {/* ── 5. Inevitability ── */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1.2, ease }}
          >
            <h3 className="text-xl md:text-2xl font-semibold text-foreground text-center mb-8">
              Why Apex Becomes Inevitable
            </h3>
            <ul className="max-w-2xl mx-auto space-y-4 mb-10">
              {inevitabilityPoints.map((point, i) => (
                <motion.li
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1, duration: 0.6 }}
                  className="flex items-start gap-3 text-grey-300 text-sm md:text-base leading-relaxed"
                >
                  <span className="text-primary mt-1 text-xs">◆</span>
                  {point}
                </motion.li>
              ))}
            </ul>
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4, duration: 0.8 }}
              className="text-center text-grey-500 text-sm italic"
            >
              Apex is used when the cost of indecision exceeds the cost of judgment.
            </motion.p>
          </motion.div>

        </div>
      </div>
    </section>
  );
}

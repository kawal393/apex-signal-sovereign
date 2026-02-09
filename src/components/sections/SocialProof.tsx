import { motion } from "framer-motion";
import { Shield, Clock, FileCheck, Lock } from "lucide-react";

const sectors = [
  { label: "NDIS", description: "Disability services operators" },
  { label: "Energy", description: "Grid & infrastructure" },
  { label: "Pharma", description: "Regulatory intelligence" },
  { label: "Mining", description: "Resource approvals" },
  { label: "Corporate", description: "M&A due diligence" },
];

const stats = [
  { value: "47", label: "Verdicts Issued", icon: FileCheck },
  { value: "5", label: "Active Sectors", icon: Shield },
  { value: "<14d", label: "Avg Response", icon: Clock },
];

const SocialProof = () => {
  return (
    <section className="relative py-32 border-b border-border/10">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
          className="text-center mb-20"
        >
          <span className="text-[10px] uppercase tracking-[0.4em] text-grey-500 block mb-4">
            Authority Markers
          </span>
          <h2 className="text-3xl md:text-4xl font-semibold text-foreground tracking-wide mb-6">
            Trusted by Operators In
          </h2>
        </motion.div>

        {/* Sector Badges */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: 0.2 }}
          className="flex flex-wrap justify-center gap-4 mb-20"
        >
          {sectors.map((sector, i) => (
            <motion.div
              key={sector.label}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 * i, duration: 0.6 }}
              whileHover={{ scale: 1.05, y: -2 }}
              className="group px-6 py-3 bg-black/80 border border-border/30 rounded-lg hover:border-primary/30 transition-all duration-500"
            >
              <span className="text-xs uppercase tracking-[0.2em] text-foreground/90 font-medium">
                {sector.label}
              </span>
              <span className="block text-[10px] text-grey-500 mt-1 group-hover:text-grey-400 transition-colors">
                {sector.description}
              </span>
            </motion.div>
          ))}
        </motion.div>

        {/* Stats Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: 0.4 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20"
        >
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 * i, duration: 0.8 }}
              className="text-center p-8 bg-black/60 border border-border/20 rounded-lg hover:border-border/40 transition-all duration-500"
            >
              <stat.icon className="w-6 h-6 text-primary/70 mx-auto mb-4" />
              <div className="text-4xl md:text-5xl font-semibold text-foreground mb-2 tabular-nums">
                {stat.value}
              </div>
              <div className="text-xs uppercase tracking-[0.2em] text-grey-500">
                {stat.label}
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Confidence Lock Guarantee */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: 0.6 }}
          className="max-w-2xl mx-auto text-center"
        >
          <div className="p-8 bg-gradient-to-b from-primary/5 to-transparent border border-primary/20 rounded-lg">
            <Lock className="w-8 h-8 text-primary mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-3 tracking-wide">
              Apex Confidence Lock
            </h3>
            <p className="text-sm text-grey-400 leading-relaxed">
              Delivery and structural integrity of Verdict Briefs are guaranteed. 
              Refunds issued only for non-delivery or structural invalidity — 
              never for disagreement with outcomes.
            </p>
            <div className="mt-4 text-[10px] uppercase tracking-[0.3em] text-primary/70">
              Structural Guarantee · Not Outcome Insurance
            </div>
          </div>
        </motion.div>

        {/* Future Testimonials Placeholder */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: 0.8 }}
          className="mt-20 text-center"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-black/40 border border-border/10 rounded-full">
            <span className="w-1.5 h-1.5 rounded-full bg-grey-600 animate-pulse" />
            <span className="text-[10px] uppercase tracking-[0.2em] text-grey-600">
              Client testimonials available upon request
            </span>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default SocialProof;

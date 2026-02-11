import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const tiers = [
  { name: "Standard Verdict Brief", price: "$249", time: "72 hours" },
  { name: "Complex Verdict", price: "$999", time: "48–72 hours" },
  { name: "Partner / Institutional", price: "Request terms", time: "Custom" },
];

export default function MiniAccessConditions() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
      className="w-full max-w-2xl mx-auto mt-16"
    >
      <div className="glass-card p-6 md:p-8">
        <span className="text-[9px] uppercase tracking-[0.5em] text-grey-500 block mb-4">
          Access Conditions
        </span>
        <p className="text-xs text-grey-400 mb-5">
          This is the cost to access judgment under uncertainty.
        </p>
        <div className="space-y-3">
          {tiers.map((t) => (
            <div key={t.name} className="flex items-center justify-between py-2 border-b border-grey-800/40 last:border-0">
              <span className="text-sm text-foreground/80 font-medium">{t.name}</span>
              <div className="flex items-center gap-3">
                <span className="text-xs text-grey-500">{t.time}</span>
                <span className="text-sm text-primary font-semibold">{t.price}</span>
              </div>
            </div>
          ))}
        </div>
        <Link
          to="/pricing"
          className="block mt-5 text-center text-[10px] uppercase tracking-[0.3em] text-grey-500 hover:text-primary transition-colors duration-300"
        >
          Full Access Conditions →
        </Link>
      </div>
    </motion.div>
  );
}

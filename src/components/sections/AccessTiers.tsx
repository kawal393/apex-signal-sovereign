import { motion } from "framer-motion";

interface Tier {
  id: string;
  name: string;
  price: string;
  period: string;
  features: string[];
  highlighted?: boolean;
  locked?: boolean;
}

const tiers: Tier[] = [
  {
    id: "observer",
    name: "Observer",
    price: "Free",
    period: "",
    features: [
      "Public signal access",
      "Weekly digest reports",
      "Community forum access",
    ],
  },
  {
    id: "operator",
    name: "Operator",
    price: "$99",
    period: "/month",
    features: [
      "Real-time signal alerts",
      "Advanced analytics dashboard",
      "Priority support channel",
    ],
    highlighted: true,
  },
  {
    id: "sovereign",
    name: "Sovereign",
    price: "$299",
    period: "/month",
    features: [
      "Full node access",
      "Custom alert configurations",
      "API integration access",
    ],
  },
  {
    id: "institutional",
    name: "Institutional",
    price: "Custom",
    period: "",
    features: [
      "Dedicated infrastructure",
      "White-glove onboarding",
      "Custom SLA agreements",
    ],
    locked: true,
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.12 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 40, scale: 0.96 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 1, ease: [0.16, 1, 0.3, 1] },
  },
};

export default function AccessTiers() {
  return (
    <section id="access-tiers" className="px-6 py-24 md:py-32 border-b border-border/10">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          viewport={{ once: true }}
          className="mb-16 text-center"
        >
          <span className="text-[10px] uppercase tracking-[0.5em] text-muted-foreground/50 mb-5 block font-medium">
            Access Protocol
          </span>
          <h2 className="text-3xl md:text-4xl font-extralight text-foreground tracking-wide mb-4">
            <span className="text-gradient-gold font-medium">APEX</span> Access Tiers
          </h2>
          <p className="text-muted-foreground/60 max-w-lg mx-auto font-light">
            Structured access. Verified intelligence. Choose your gate.
          </p>
        </motion.div>

        {/* Tiers Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5"
        >
          {tiers.map((tier) => (
            <motion.div
              key={tier.id}
              variants={itemVariants}
              whileHover={!tier.locked ? { 
                scale: 1.03, 
                y: -8,
                rotateX: 1,
              } : {}}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              className={`glass-card p-7 relative overflow-hidden transition-all duration-700 ${
                tier.highlighted
                  ? "border-primary/30 shadow-[0_0_60px_hsl(42,90%,55%,0.08)]"
                  : tier.locked
                  ? "opacity-50 cursor-not-allowed"
                  : "hover:border-primary/20"
              }`}
            >
              {/* Highlighted badge */}
              {tier.highlighted && (
                <div className="absolute top-4 right-4">
                  <motion.span 
                    className="text-[8px] uppercase tracking-[0.2em] text-primary bg-primary/10 px-2.5 py-1 rounded-full border border-primary/25 font-medium"
                    animate={{ opacity: [0.7, 1, 0.7] }}
                    transition={{ duration: 3, repeat: Infinity }}
                  >
                    Recommended
                  </motion.span>
                </div>
              )}

              {/* Locked overlay */}
              {tier.locked && (
                <div className="absolute inset-0 bg-background/40 backdrop-blur-[1px] z-10 flex items-center justify-center">
                  <span className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground/50 font-medium">
                    Request Access
                  </span>
                </div>
              )}

              {/* Tier name */}
              <h3 className="text-lg font-medium text-foreground mb-3 tracking-wide">
                {tier.name}
              </h3>

              {/* Price */}
              <div className="mb-7">
                <span className="text-3xl font-extralight text-foreground">
                  {tier.price}
                </span>
                <span className="text-muted-foreground/50 text-sm ml-1">
                  {tier.period}
                </span>
              </div>

              {/* Features */}
              <ul className="space-y-4">
                {tier.features.map((feature, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <span className="text-primary/60 mt-0.5 text-xs">◇</span>
                    <span className="text-sm text-muted-foreground/70 leading-relaxed">
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>

              {/* Bottom divider */}
              <div className="mt-7 pt-5 border-t border-border/20">
                <motion.div 
                  className={`text-[10px] uppercase tracking-[0.25em] ${
                    tier.highlighted ? "text-primary/70" : "text-muted-foreground/40"
                  }`}
                  whileHover={{ x: 3 }}
                >
                  {tier.locked ? "Contact →" : "Select Tier →"}
                </motion.div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

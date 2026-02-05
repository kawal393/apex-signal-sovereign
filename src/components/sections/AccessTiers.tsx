import { motion } from "framer-motion";
import { useState } from "react";

interface Tier {
  id: string;
  name: string;
  level: number;
  description: string;
  sigil: string;
  benefits: string[];
  requirements: string[];
  color: "silver" | "gold" | "crimson";
}

const tiers: Tier[] = [
  {
    id: "observer",
    name: "Observer",
    level: 1,
    description: "You have entered. The system now watches you watching it.",
    sigil: "◇",
    benefits: [
      "Access to public signal streams",
      "Weekly APEX Digest transmissions",
      "Node visibility (read-only)",
      "Community forum participation",
    ],
    requirements: [
      "Arrive",
      "Observe without interference",
      "Demonstrate patience",
    ],
    color: "silver",
  },
  {
    id: "acknowledged",
    name: "Acknowledged",
    level: 2,
    description: "Your presence has been noted. The system has begun to respond.",
    sigil: "◈",
    benefits: [
      "Real-time signal alerts",
      "Advanced analytics dashboard",
      "Node interaction capabilities",
      "Priority signal queue",
      "Monthly private briefings",
    ],
    requirements: [
      "Minimum 30 days as Observer",
      "Demonstrated behavioral consistency",
      "Approved access request",
    ],
    color: "gold",
  },
  {
    id: "inner-circle",
    name: "Inner Circle",
    level: 3,
    description: "The veil parts. You have become infrastructure.",
    sigil: "◆",
    benefits: [
      "Full sovereign node access",
      "API integration privileges",
      "Custom alert configurations",
      "Direct channel to APEX Core",
      "Institutional-grade intelligence",
      "Governance participation rights",
    ],
    requirements: [
      "Invitation only",
      "Demonstrated alignment with system values",
      "Behavioral score threshold exceeded",
    ],
    color: "crimson",
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.2 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 60, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 1.2, ease: [0.16, 1, 0.3, 1] },
  },
};

export default function AccessTiers() {
  const [hoveredTier, setHoveredTier] = useState<string | null>(null);

  const getColorClasses = (color: Tier["color"], isHovered: boolean) => {
    const colors = {
      silver: {
        border: isHovered ? "border-silver-light/40" : "border-silver-dark/20",
        glow: "shadow-[0_0_80px_hsl(0,0%,70%,0.08)]",
        sigil: "text-silver-light",
        badge: "bg-silver-dark/20 text-silver-light border-silver-mid/30",
      },
      gold: {
        border: isHovered ? "border-primary/50" : "border-primary/20",
        glow: "shadow-[0_0_100px_hsl(42,95%,55%,0.12)]",
        sigil: "text-primary",
        badge: "bg-primary/15 text-gold-bright border-primary/40",
      },
      crimson: {
        border: isHovered ? "border-crimson-bright/50" : "border-crimson-deep/25",
        glow: "shadow-[0_0_100px_hsl(0,80%,55%,0.1)]",
        sigil: "text-crimson-bright",
        badge: "bg-crimson-deep/20 text-crimson-bright border-crimson-bright/30",
      },
    };
    return colors[color];
  };

  return (
    <section id="access-tiers" className="px-6 py-32 md:py-40 border-b border-border/5 relative overflow-hidden">
      {/* Deep void background effects */}
      <div className="absolute inset-0 pointer-events-none">
        <motion.div 
          className="absolute top-1/4 left-1/4 w-[800px] h-[800px] rounded-full"
          style={{
            background: 'radial-gradient(circle, hsl(42 90% 55% / 0.03) 0%, transparent 60%)',
          }}
          animate={{ opacity: [0.3, 0.6, 0.3], scale: [1, 1.1, 1] }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div 
          className="absolute bottom-1/4 right-1/4 w-[600px] h-[600px] rounded-full"
          style={{
            background: 'radial-gradient(circle, hsl(0 70% 50% / 0.02) 0%, transparent 60%)',
          }}
          animate={{ opacity: [0.2, 0.5, 0.2], scale: [1, 1.15, 1] }}
          transition={{ duration: 18, repeat: Infinity, ease: "easeInOut", delay: 3 }}
        />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Section Header - BIGGER FONTS */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          viewport={{ once: true }}
          className="mb-20 text-center"
        >
          <span className="text-[11px] uppercase tracking-[0.6em] text-grey-500 mb-6 block font-medium">
            Access Protocol
          </span>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-extralight text-grey-300 tracking-wide mb-6">
            Tiered <span className="text-gradient-gold font-medium">Access</span>
          </h2>
          <p className="text-lg md:text-xl text-grey-500 max-w-2xl mx-auto font-light leading-relaxed">
            Entry is not purchased. It is recognized. Your behavior determines your elevation.
          </p>
        </motion.div>

        {/* Tiers Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 lg:grid-cols-3 gap-8"
        >
          {tiers.map((tier) => {
            const isHovered = hoveredTier === tier.id;
            const colorClasses = getColorClasses(tier.color, isHovered);
            
            return (
              <motion.div
                key={tier.id}
                variants={itemVariants}
                onMouseEnter={() => setHoveredTier(tier.id)}
                onMouseLeave={() => setHoveredTier(null)}
                whileHover={{ 
                  scale: 1.02, 
                  y: -12,
                }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                className={`relative p-8 md:p-10 rounded-lg bg-grey-900/80 backdrop-blur-xl border ${colorClasses.border} ${isHovered ? colorClasses.glow : ''} transition-all duration-700 cursor-default group`}
              >
                {/* Top accent line */}
                <div className={`absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent ${tier.color === 'gold' ? 'via-primary/60' : tier.color === 'crimson' ? 'via-crimson-bright/50' : 'via-silver-mid/40'} to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700`} />
                
                {/* Level indicator */}
                <div className="flex items-center justify-between mb-8">
                  <motion.div 
                    className={`w-16 h-16 rounded-xl bg-grey-800/80 border ${colorClasses.border} flex items-center justify-center transition-all duration-500`}
                    whileHover={{ rotate: 5 }}
                  >
                    <span className={`${colorClasses.sigil} text-3xl`}>{tier.sigil}</span>
                  </motion.div>
                  
                  <div className={`px-4 py-2 rounded-full border ${colorClasses.badge} text-[10px] uppercase tracking-[0.25em] font-semibold`}>
                    Level {tier.level}
                  </div>
                </div>

                {/* Tier name - BIGGER */}
                <h3 className="text-2xl md:text-3xl font-medium text-foreground mb-4 tracking-wide">
                  {tier.name}
                </h3>
                
                {/* Description */}
                <p className="text-base text-grey-400 leading-relaxed mb-8 font-light">
                  {tier.description}
                </p>

                {/* Benefits */}
                <div className="mb-8">
                  <span className="text-[10px] uppercase tracking-[0.3em] text-grey-500 mb-4 block font-medium">
                    Privileges
                  </span>
                  <ul className="space-y-3">
                    {tier.benefits.map((benefit, index) => (
                      <motion.li 
                        key={index} 
                        className="flex items-start gap-3"
                        initial={{ opacity: 0, x: -10 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                      >
                        <span className={`${colorClasses.sigil} mt-1 text-sm`}>+</span>
                        <span className="text-sm text-grey-300 leading-relaxed">
                          {benefit}
                        </span>
                      </motion.li>
                    ))}
                  </ul>
                </div>

                {/* Requirements */}
                <div className="pt-6 border-t border-grey-800/50">
                  <span className="text-[10px] uppercase tracking-[0.3em] text-grey-600 mb-4 block font-medium">
                    Requirements
                  </span>
                  <ul className="space-y-2">
                    {tier.requirements.map((req, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <span className="text-grey-600 mt-1 text-xs">○</span>
                        <span className="text-xs text-grey-500 leading-relaxed">
                          {req}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.5 }}
          viewport={{ once: true }}
          className="mt-16 text-center"
        >
          <p className="text-grey-500 text-sm tracking-wide">
            Your current level: <span className="text-silver-light font-medium">Observer</span>
          </p>
        </motion.div>
      </div>
    </section>
  );
}

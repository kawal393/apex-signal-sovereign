import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Shield, Pickaxe, HeartPulse, Brain, ArrowRight, Globe } from "lucide-react";
import { toast } from "@/hooks/use-toast";

const pathways = [
  {
    id: "ndis",
    label: "NDIS INTEGRITY",
    subtitle: "Sovereign Care Protocol",
    icon: HeartPulse,
    description: "Participant-controlled compliance ledger mapped to NDIS Practice Standards.",
    href: "/ndis-watchtower",
    deadline: "JUL 2026 REGISTRATION",
    color: "text-purple-light",
    borderColor: "border-purple-mid/30",
    glowColor: "hsl(280 60% 72% / 0.15)",
    comingSoon: false,
  },
  {
    id: "mining",
    label: "MINING INTEGRITY",
    subtitle: "Graticular Verification",
    icon: Pickaxe,
    description: "Sovereign mineral gap verification for Victorian critical mineral compliance.",
    href: "/mining-watchtower",
    deadline: "ACTIVE MONITORING",
    color: "text-gold-bright",
    borderColor: "border-primary/30",
    glowColor: "hsl(42 95% 55% / 0.15)",
    comingSoon: false,
  },
  {
    id: "ai-act",
    label: "EU AI ACT",
    subtitle: "Digital Gallows Protocol",
    icon: Brain,
    description: "ZK-SNARK compliance verification with multi-party sovereign attestation.",
    href: "/protocol",
    deadline: "COMING SOON",
    color: "text-sky-400",
    borderColor: "border-sky-500/30",
    glowColor: "hsl(200 90% 55% / 0.15)",
    comingSoon: true,
  },
  {
    id: "pharma",
    label: "PHARMA SNIPER",
    subtitle: "TGA Compliance Layer",
    icon: Shield,
    description: "Regulatory signal monitoring for pharmaceutical compliance deadlines.",
    href: "/protocol",
    deadline: "COMING SOON",
    color: "text-crimson-bright",
    borderColor: "border-crimson-deep/30",
    glowColor: "hsl(0 80% 60% / 0.15)",
    comingSoon: true,
  },
];

const SovereignPathways = () => {
  return (
    <section className="relative py-32 px-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
          className="text-center mb-20"
        >
          <span className="text-[10px] uppercase tracking-[0.6em] text-grey-400 block mb-4">
            Sovereign Solutions
          </span>
          <h2 className="text-3xl md:text-5xl font-semibold text-foreground tracking-wide mb-6">
            Choose Your Domain
          </h2>
          <p className="text-lg text-grey-300 max-w-2xl mx-auto">
            Each vertical operates under the PSI Protocol — Proof of Sovereign Integrity.
            Select your compliance domain or explore the full infrastructure.
          </p>
        </motion.div>

        {/* Pathway Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          {pathways.map((pathway, i) => (
            <motion.div
              key={pathway.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ delay: i * 0.1, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            >
              <Link to={pathway.href}>
                <motion.div
                  whileHover={{ y: -4, scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                  className={`relative p-8 rounded-lg border ${pathway.borderColor} bg-card/50 backdrop-blur-sm hover:bg-card/80 transition-all duration-500 group cursor-pointer`}
                  style={{ boxShadow: `0 0 60px ${pathway.glowColor}` }}
                >
                  {/* Deadline badge */}
                  <div className="absolute top-4 right-4">
                    <span className="text-[9px] uppercase tracking-[0.2em] text-grey-500 bg-black/60 px-2.5 py-1 rounded border border-border/20">
                      {pathway.deadline}
                    </span>
                  </div>

                  <div className="flex items-start gap-5">
                    <div className={`p-3 rounded-lg border ${pathway.borderColor} bg-black/40`}>
                      <pathway.icon className={`w-6 h-6 ${pathway.color}`} />
                    </div>
                    <div className="flex-1">
                      <h3 className={`text-lg font-semibold ${pathway.color} tracking-wide mb-1`}>
                        {pathway.label}
                      </h3>
                      <span className="text-[10px] uppercase tracking-[0.3em] text-grey-500 block mb-3">
                        {pathway.subtitle}
                      </span>
                      <p className="text-sm text-grey-400 leading-relaxed">
                        {pathway.description}
                      </p>
                    </div>
                  </div>

                  {/* Hover arrow */}
                  <motion.div
                    className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  >
                    <ArrowRight className={`w-4 h-4 ${pathway.color}`} />
                  </motion.div>
                </motion.div>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Full System CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4, duration: 0.8 }}
          className="text-center"
        >
          <Link to="/commons">
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="inline-flex items-center gap-4 px-10 py-5 rounded-lg border border-primary/30 bg-primary/5 hover:bg-primary/10 transition-all duration-500 group"
            >
              <Globe className="w-5 h-5 text-primary" />
              <span className="text-sm uppercase tracking-[0.4em] text-primary font-medium">
                Explore Full Infrastructure
              </span>
              <ArrowRight className="w-4 h-4 text-primary group-hover:translate-x-1 transition-transform" />
            </motion.div>
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default SovereignPathways;

import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Globe, HeartPulse, Pickaxe, Brain, Shield } from "lucide-react";
import ApexNav from "@/components/layout/ApexNav";
import ApexFooter from "@/components/layout/ApexFooter";
import MobileVoid from "@/components/effects/MobileVoid";
import AmbientParticles from "@/components/effects/AmbientParticles";
import { useIsMobile } from "@/hooks/use-mobile";
import { toast } from "@/hooks/use-toast";
import apexLogo from "@/assets/apex-logo.png";

const industries = [
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
    glowColor: "hsl(280 60% 72% / 0.12)",
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
    glowColor: "hsl(42 95% 55% / 0.12)",
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
    glowColor: "hsl(200 90% 55% / 0.12)",
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
    glowColor: "hsl(0 80% 60% / 0.12)",
    comingSoon: true,
  },
];

const Index = () => {
  const isMobile = useIsMobile();
  const navigate = useNavigate();

  return (
    <div className="relative min-h-screen bg-black">
      {isMobile && <MobileVoid />}
      <AmbientParticles />

      {/* Dark atmospheric base */}
      <div className="fixed inset-0 pointer-events-none z-[1]">
        <div className="absolute inset-0 bg-black/80" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,hsl(42_50%_20%/0.06)_0%,transparent_60%)]" />
      </div>

      <ApexNav />

      <main className="relative z-10 pt-28 md:pt-36 pb-16 px-6">
        <div className="max-w-5xl mx-auto">

          {/* Logo + Title */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
            className="text-center mb-6"
          >
            <img
              src={apexLogo}
              alt="APEX"
              className="h-16 md:h-20 w-auto mx-auto mb-6 drop-shadow-[0_0_30px_rgba(212,160,32,0.3)]"
            />
            <h1 className="text-3xl md:text-5xl lg:text-6xl font-semibold text-foreground tracking-wide mb-4">
              The Open Standard for Verifiable <span className="text-gradient-gold">Sovereign Integrity</span>
            </h1>
            <p className="text-grey-300 text-base md:text-lg max-w-2xl mx-auto leading-relaxed">
              Mathematical proof of compliance for High-Stakes Industries:
              AI (EU Act), Mining (Critical Minerals), and NDIS (Integrity Reform).
            </p>
          </motion.div>

          {/* Divider */}
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ delay: 0.4, duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
            className="h-px max-w-xs mx-auto mb-16"
            style={{ background: 'linear-gradient(90deg, transparent, hsl(42 95% 55% / 0.4), transparent)' }}
          />

          {/* THE CHOICE — Industry Cards */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 1 }}
          >
            <span className="block text-center text-[10px] uppercase tracking-[0.6em] text-grey-400 mb-8">
              Select Your Domain
            </span>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-12">
              {industries.map((industry, i) => {
                const cardContent = (
                  <motion.div
                    whileHover={{ y: -4, scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                    transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                    className={`relative p-7 md:p-8 rounded-lg border ${industry.borderColor} bg-card/50 backdrop-blur-sm hover:bg-card/80 transition-all duration-500 group cursor-pointer ${industry.comingSoon ? 'opacity-70 hover:opacity-90' : ''}`}
                    style={{ boxShadow: `0 0 60px ${industry.glowColor}` }}
                  >
                    <div className="absolute top-4 right-4">
                      <span className={`text-[9px] uppercase tracking-[0.2em] px-2.5 py-1 rounded border ${industry.comingSoon ? 'text-primary bg-primary/10 border-primary/30' : 'text-grey-500 bg-black/60 border-border/20'}`}>
                        {industry.deadline}
                      </span>
                    </div>

                    <div className="flex items-start gap-4 md:gap-5">
                      <div className={`p-3 rounded-lg border ${industry.borderColor} bg-black/40`}>
                        <industry.icon className={`w-6 h-6 ${industry.color}`} />
                      </div>
                      <div className="flex-1">
                        <h2 className={`text-lg font-semibold ${industry.color} tracking-wide mb-1`}>
                          {industry.label}
                        </h2>
                        <span className="text-[10px] uppercase tracking-[0.3em] text-grey-500 block mb-3">
                          {industry.subtitle}
                        </span>
                        <p className="text-sm text-grey-400 leading-relaxed">
                          {industry.description}
                        </p>
                      </div>
                    </div>

                    <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <ArrowRight className={`w-4 h-4 ${industry.color}`} />
                    </div>
                  </motion.div>
                );

                return (
                  <motion.div
                    key={industry.id}
                    initial={{ opacity: 0, y: 25 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 + i * 0.1, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                  >
                    {industry.comingSoon ? (
                      <div onClick={() => toast({ title: `${industry.label} — Coming Soon`, description: "This module is under development. Contact apexinfrastructure369@gmail.com for early access." })}>
                        {cardContent}
                      </div>
                    ) : (
                      <Link to={industry.href}>{cardContent}</Link>
                    )}
                  </motion.div>
                );
              })}
            </div>
          </motion.div>

          {/* OR — Full Tour CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9, duration: 0.8 }}
            className="text-center mb-20"
          >
            <span className="block text-[10px] uppercase tracking-[0.5em] text-grey-500 mb-5">
              Or
            </span>
            <Link to="/commons">
              <motion.div
                whileHover={{ scale: 1.03, y: -3 }}
                whileTap={{ scale: 0.98 }}
                className="inline-flex items-center gap-4 px-10 py-5 rounded-lg border border-primary/30 bg-primary/5 hover:bg-primary/10 transition-all duration-500 group"
                style={{ boxShadow: '0 0 60px hsl(42 95% 55% / 0.08)' }}
              >
                <Globe className="w-5 h-5 text-primary" />
                <span className="text-sm uppercase tracking-[0.4em] text-primary font-medium">
                  Explore Full Infrastructure
                </span>
                <ArrowRight className="w-4 h-4 text-primary group-hover:translate-x-1 transition-transform" />
              </motion.div>
            </Link>
          </motion.div>

          {/* Member Access */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2, duration: 1 }}
            className="text-center pt-12 border-t border-grey-800/30"
          >
            <h3 className="text-xs uppercase tracking-[0.5em] text-grey-300 mb-4">
              Member Access
            </h3>
            <p className="text-sm text-grey-400 mb-6 max-w-sm mx-auto">
              Registered members access the Sovereign Grid, partner dashboard, and sealed verdicts.
            </p>
            <div className="flex items-center justify-center gap-4 mb-6">
              <Link
                to="/auth"
                className="px-8 py-3 bg-primary/10 border border-primary/40 rounded-md text-primary text-xs uppercase tracking-[0.3em] hover:bg-primary/20 hover:border-primary/60 transition-all duration-500"
              >
                Login
              </Link>
              <Link
                to="/auth"
                className="px-8 py-3 bg-primary/20 border border-primary/50 rounded-md text-primary text-xs uppercase tracking-[0.3em] hover:bg-primary/30 transition-all duration-500 font-medium"
                style={{ boxShadow: '0 0 30px hsl(42 95% 55% / 0.1)' }}
              >
                Sign Up
              </Link>
            </div>
            <a
              href="mailto:apexinfrastructure369@gmail.com"
              className="text-grey-300 hover:text-primary text-xs tracking-[0.2em] transition-colors duration-500 inline-block"
            >
              apexinfrastructure369@gmail.com
            </a>
          </motion.div>

        </div>
      </main>

      <ApexFooter />
    </div>
  );
};

export default Index;

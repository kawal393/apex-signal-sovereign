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
    description: "Real-time monitoring of NDIS Commission enforcement actions, provider banning orders, and compliance signals across all states.",
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
    subtitle: "Safety & Compliance Intelligence",
    icon: Pickaxe,
    description: "Automated scraping of mining safety prosecutions, prohibition notices, and enforceable undertakings across Australian states.",
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
    description: "Protocol LDSL — compliance without IP loss. ZK-SNARK verification for August 2026 EU AI Act fines.",
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
    description: "ZK-Compliance Docket for fast-track TGA generic entry. Regulatory signal monitoring for pharmaceutical deadlines.",
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

          {/* Live Intelligence Ticker */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 1 }}
            className="mb-8 overflow-hidden rounded-md border border-border/10 bg-card/20 backdrop-blur-sm"
          >
            <motion.div
              animate={{ x: [0, -1200] }}
              transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
              className="flex items-center gap-8 py-2 px-4 whitespace-nowrap"
            >
              {[
                "⛏️ Mining Safety & Compliance Signals",
                "🏥 NDIS Provider Enforcement Monitoring",
                "💊 TGA Regulatory Alerts",
                "⚖️ Court Judgment Tracking",
                "🌍 Global Sanctions Screening",
                "🏢 Corporate Director Actions",
                "📊 ASX Disclosure Monitoring",
                "🔒 Regulatory Change Detection",
              ].map((signal, i) => (
                <span key={i} className="text-[10px] text-grey-400 tracking-wide flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary/60" />
                  {signal}
                </span>
              ))}
            </motion.div>
          </motion.div>

          {/* Powered by badge */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="flex justify-center mb-6"
          >
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-primary/20 bg-primary/5 text-[9px] uppercase tracking-[0.3em] text-primary/70">
              <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
              Regulatory Intelligence Infrastructure
            </span>
          </motion.div>

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
              Automated regulatory intelligence for high-stakes industries:
              NDIS (Integrity Reform), Mining (Critical Minerals), and more.
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

          {/* Strategic Synergy Table */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.0, duration: 0.8 }}
            className="mb-20"
          >
            <span className="block text-center text-[10px] uppercase tracking-[0.6em] text-grey-400 mb-8">
              Why They Buy
            </span>
            <div className="border border-border/20 rounded-lg overflow-hidden bg-card/30 backdrop-blur-sm">
              <div className="grid grid-cols-3 text-[9px] uppercase tracking-[0.3em] text-grey-500 border-b border-border/20 px-6 py-3">
                <span>Vertical</span>
                <span>The Pain</span>
                <span>APEX Solution</span>
              </div>
              {[
                { vertical: "NDIS", pain: "July 2026 Registration/Audit fear", solution: "Audit-Ready Ledger — saves 30% admin", color: "text-purple-light" },
                { vertical: "Mining", pain: "Victorian Expenditure/Gap Rules", solution: "Graticular Gap Verification — secures ELs", color: "text-gold-bright" },
                { vertical: "Pharma", pain: "TGA Generic Deadline pressure", solution: "ZK-Compliance Docket — fast-track entry", color: "text-crimson-bright" },
                { vertical: "AI", pain: "August 2026 EU AI Act fines", solution: "Protocol LDSL — compliance without IP loss", color: "text-sky-400" },
              ].map((row, i) => (
                <div key={i} className="grid grid-cols-3 text-sm px-6 py-4 border-b border-border/10 last:border-0 hover:bg-card/50 transition-colors">
                  <span className={`font-semibold ${row.color} tracking-wide`}>{row.vertical}</span>
                  <span className="text-grey-400">{row.pain}</span>
                  <span className="text-grey-300">{row.solution}</span>
                </div>
              ))}
            </div>
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

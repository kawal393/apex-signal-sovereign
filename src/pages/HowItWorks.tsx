import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import ApexNav from "@/components/layout/ApexNav";
import ApexFooter from "@/components/layout/ApexFooter";
import MobileVoid from "@/components/effects/MobileVoid";
import { ApexButton } from "@/components/ui/apex-button";
import { useIsMobile } from "@/hooks/use-mobile";
import AmbientParticles from "@/components/effects/AmbientParticles";

const steps = [
  {
    number: "01",
    title: "Signal Monitoring",
    description: "APEX continuously monitors public regulatory and enforcement signals across Australian sectors — NDIS, energy/grid, pharmaceuticals, and corporate governance.",
  },
  {
    number: "02",
    title: "Noise → Structure",
    description: "Raw data is filtered, cross-referenced, and converted into structured intelligence. Public signals become readable through live nodes. Complex signals are flagged for deeper analysis.",
  },
  {
    number: "03",
    title: "Verdict Brief Request",
    description: "Operators facing irreversible decisions submit their context. APEX assesses the decision domain, urgency, and exposure. A quote and timeline are issued if accepted.",
  },
  {
    number: "04",
    title: "Structured Judgment",
    description: "A one-page Verdict Brief is delivered with 5 elements: Tier (Advance / Hold / Partner-Only / Drop), Confidence level, Why (3 structural reasons), Next Cheapest Test, and Kill Rule.",
  },
  {
    number: "05",
    title: "ATA Ledger Recording",
    description: "Sealed Verdicts are recorded to the ATA Ledger — an immutable registry of decision authority. Sealed entries are citeable in institutional documentation.",
  },
];

const HowItWorks = () => {
  const isMobile = useIsMobile();

  return (
    <div className="relative min-h-screen bg-black">
      {isMobile && <MobileVoid />}
      <AmbientParticles />
      <div className="fixed inset-0 pointer-events-none z-[1]">
        <div className="absolute inset-0 bg-black/80" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,hsl(42_50%_20%/0.06)_0%,transparent_60%)]" />
      </div>

      <ApexNav />

      <main className="relative z-10 pt-32 pb-24 px-6">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
            className="text-center mb-20"
          >
            <span className="text-[10px] uppercase tracking-[0.6em] text-grey-500 block mb-4">
              Operating Doctrine
            </span>
            <h1 className="text-4xl md:text-5xl font-semibold text-foreground tracking-wide mb-6">
              How <span className="text-gradient-gold">Apex</span> Works
            </h1>
            <p className="text-grey-400 max-w-2xl mx-auto text-lg leading-relaxed">
              From raw signal to structured judgment. Five steps. No ambiguity.
            </p>
          </motion.div>

          {/* Steps */}
          <div className="space-y-8 mb-24">
            {steps.map((step, i) => (
              <motion.div
                key={step.number}
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 + i * 0.12, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                className="glass-card p-8 border-grey-700/30 hover:border-primary/30 transition-all duration-300 group"
              >
                <div className="flex items-start gap-6">
                  <span className="text-4xl font-light text-primary/50 tabular-nums group-hover:text-primary/80 transition-colors">
                    {step.number}
                  </span>
                  <div>
                    <h3 className="text-xl font-medium text-foreground mb-3">{step.title}</h3>
                    <p className="text-grey-400 leading-relaxed">{step.description}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Decision Authority Doctrine */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 1 }}
            className="mb-20"
          >
            <h2 className="text-3xl md:text-4xl font-semibold text-foreground tracking-wide text-center mb-4">
              A Different Layer Entirely
            </h2>
            <p className="text-grey-400 text-center max-w-2xl mx-auto mb-6 text-lg leading-relaxed">
              Information, analysis, recommendations, and execution all serve the decision.
              Apex is the decision itself — accountable, recorded, and final.
            </p>
            <p className="text-grey-500 text-center max-w-2xl mx-auto text-sm italic">
              You invoke Apex when other systems can no longer decide.
            </p>
          </motion.div>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2, duration: 0.8 }}
            className="text-center space-y-6"
          >
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/request-verdict">
                <ApexButton variant="primary" size="lg" className="gap-2 px-8">
                  Request a Verdict Brief
                  <ArrowRight className="w-4 h-4" />
                </ApexButton>
              </Link>
              <Link to="/nodes">
                <ApexButton variant="outline" size="lg" className="px-8">
                  Explore Live Nodes
                </ApexButton>
              </Link>
            </div>
            <a
              href="mailto:apex@apex-infrastructure.com"
              className="text-grey-500 hover:text-primary text-xs tracking-[0.15em] transition-colors duration-300 inline-block"
            >
              apex@apex-infrastructure.com
            </a>
          </motion.div>
        </div>
      </main>

      <ApexFooter />
    </div>
  );
};

export default HowItWorks;

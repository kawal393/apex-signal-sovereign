import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { CheckCircle, ArrowRight } from "lucide-react";
import ApexNav from "@/components/layout/ApexNav";
import ApexFooter from "@/components/layout/ApexFooter";
import MobileVoid from "@/components/effects/MobileVoid";
import AmbientParticles from "@/components/effects/AmbientParticles";
import { ApexButton } from "@/components/ui/apex-button";
import { useIsMobile } from "@/hooks/use-mobile";

const ThankYou = () => {
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
        <div className="max-w-2xl mx-auto text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="w-24 h-24 rounded-full border border-primary/40 flex items-center justify-center mx-auto mb-10"
          >
            <CheckCircle className="w-12 h-12 text-primary" />
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 1, ease: [0.16, 1, 0.3, 1] }}
            className="text-4xl md:text-5xl font-semibold text-foreground tracking-wide mb-6"
          >
            <span className="text-gradient-gold">Payment Received.</span>
          </motion.h1>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.8 }}
            className="space-y-6"
          >
            <p className="text-grey-300 text-lg leading-relaxed max-w-lg mx-auto">
              Your Verdict Brief request has been logged and queued for processing.
              You will receive a confirmation email with your reference ID.
            </p>

            <div className="glass-card p-8 max-w-md mx-auto border-grey-700/30 space-y-4">
              <h3 className="text-foreground font-medium text-lg">What happens next</h3>
              <ul className="space-y-3 text-left">
                {[
                  "Confirmation email sent within 1 hour",
                  "Verdict Brief sealed within delivery window",
                  "Delivered to your email as a structured document",
                  "Unsealed ledger entry published on completion",
                ].map((step, i) => (
                  <li key={i} className="flex items-start gap-3 text-grey-400 text-base">
                    <span className="text-primary font-mono text-sm mt-0.5">{String(i + 1).padStart(2, '0')}</span>
                    {step}
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Link to="/">
                <ApexButton variant="outline" size="lg" className="gap-2">
                  Return to Portal <ArrowRight className="w-4 h-4" />
                </ApexButton>
              </Link>
              <Link to="/ledger">
                <ApexButton variant="primary" size="lg" className="gap-2">
                  View Ledger <ArrowRight className="w-4 h-4" />
                </ApexButton>
              </Link>
            </div>
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 0.6 }}
            className="text-grey-600 text-sm tracking-wide mt-12"
          >
            Apex delivers judgment, not comfort.
          </motion.p>
        </div>
      </main>

      <ApexFooter />
    </div>
  );
};

export default ThankYou;

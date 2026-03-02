import { motion } from "framer-motion";
import ApexNav from "@/components/layout/ApexNav";
import ApexFooter from "@/components/layout/ApexFooter";
import MobileVoid from "@/components/effects/MobileVoid";
import { useIsMobile } from "@/hooks/use-mobile";
import { useJurisdictionDisclaimer } from "@/hooks/useJurisdictionDisclaimer";

const Terms = () => {
  const isMobile = useIsMobile();
  const { termsGoverningLaw, countryName } = useJurisdictionDisclaimer();

  return (
    <div className="relative min-h-screen bg-black">
      {isMobile && <MobileVoid />}
      <div className="fixed inset-0 pointer-events-none z-[1]">
        <div className="absolute inset-0 bg-black/80" />
      </div>

      <ApexNav />

      <main className="relative z-10 pt-32 pb-24 px-6">
        <div className="max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
            className="text-center mb-16"
          >
            <span className="text-[10px] uppercase tracking-[0.6em] text-grey-300 block mb-4">
              Protocol
            </span>
            <h1 className="text-4xl md:text-5xl font-semibold text-foreground tracking-wide mb-6">
              Terms of Service
            </h1>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="glass-card p-8 space-y-8 text-grey-400 leading-relaxed"
          >
            <section>
              <h2 className="text-lg font-medium text-foreground mb-3">Acceptance</h2>
              <p>By accessing APEX Infrastructure, you accept these terms. If you do not agree, do not use the service.</p>
            </section>

            <section>
              <h2 className="text-lg font-medium text-foreground mb-3">Service Description</h2>
              <p>APEX provides opinion-based operational risk assessments delivered as Verdict Briefs. These are analytical products, not professional advice requiring licensure.</p>
            </section>

            <section>
              <h2 className="text-lg font-medium text-foreground mb-3">Payment</h2>
              <p>Upon request acceptance, an invoice is issued. Payment is required before delivery. All fees are non-refundable once work has commenced.</p>
            </section>

            <section>
              <h2 className="text-lg font-medium text-foreground mb-3">Intellectual Property</h2>
              <p>Delivered Verdict Briefs become client property upon payment. APEX retains rights to methodologies, frameworks, and internal processes.</p>
            </section>

            <section>
              <h2 className="text-lg font-medium text-foreground mb-3">Limitation of Liability</h2>
              <p>APEX liability is limited to the fee paid for the specific deliverable in question. We are not liable for decisions made or outcomes resulting from use of our assessments.</p>
            </section>

            <section className="border-t border-primary/20 pt-8">
              <h2 className="text-lg font-medium text-foreground mb-1">Governing Law & Dispute Resolution</h2>
              <span className="text-[9px] uppercase tracking-[0.2em] text-primary/60 block mb-3">
                Adapted for: {countryName}
              </span>
              <p>{termsGoverningLaw}</p>
            </section>
          </motion.div>
        </div>
      </main>

      <ApexFooter />
    </div>
  );
};

export default Terms;

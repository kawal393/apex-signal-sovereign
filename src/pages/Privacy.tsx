import { motion } from "framer-motion";
import ApexNav from "@/components/layout/ApexNav";
import ApexFooter from "@/components/layout/ApexFooter";
import MobileVoid from "@/components/effects/MobileVoid";
import { useIsMobile } from "@/hooks/use-mobile";

const Privacy = () => {
  const isMobile = useIsMobile();

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
            <span className="text-[10px] uppercase tracking-[0.6em] text-grey-500 block mb-4">
              Data Protocol
            </span>
            <h1 className="text-4xl md:text-5xl font-semibold text-foreground tracking-wide mb-6">
              Privacy Policy
            </h1>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="glass-card p-8 space-y-8 text-grey-400 leading-relaxed"
          >
            <section>
              <h2 className="text-lg font-medium text-foreground mb-3">Information Collection</h2>
              <p>
                We collect information you provide directly (name, email, request details) and basic analytics data (page views, session duration). We do not sell personal data.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-medium text-foreground mb-3">Use of Information</h2>
              <p>
                Information is used to process requests, deliver services, and improve system operations. Analytics inform interface improvements.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-medium text-foreground mb-3">Data Retention</h2>
              <p>
                Request data is retained for the duration of the engagement plus a reasonable period for record-keeping. You may request deletion of your data at any time.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-medium text-foreground mb-3">Third Parties</h2>
              <p>
                We may use third-party services for hosting, analytics, and payment processing. These parties are bound by their own privacy policies.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-medium text-foreground mb-3">Contact</h2>
              <p>
                For privacy inquiries, submit a request through the standard access gate.
              </p>
            </section>
          </motion.div>
        </div>
      </main>

      <ApexFooter />
    </div>
  );
};

export default Privacy;

import { motion } from "framer-motion";
import ApexNav from "@/components/layout/ApexNav";
import ApexFooter from "@/components/layout/ApexFooter";
import MobileVoid from "@/components/effects/MobileVoid";
import { useIsMobile } from "@/hooks/use-mobile";

const Protocol = () => {
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
            <span className="text-[10px] uppercase tracking-[0.6em] text-grey-300 block mb-4">
              Engagement
            </span>
            <h1 className="text-4xl md:text-5xl font-semibold text-foreground tracking-wide mb-6">
              Protocol
            </h1>
            <p className="text-grey-400">
              How engagement with APEX Infrastructure operates.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="space-y-6"
          >
            {[
              {
                step: "01",
                title: "Request",
                description: "Submit decision context through the access gate. Describe what you need clarity on.",
              },
              {
                step: "02",
                title: "Assessment",
                description: "Your request is evaluated for fit. Not all requests are accepted.",
              },
              {
                step: "03",
                title: "Invoice",
                description: "If accepted, an invoice is issued with scope and timeline.",
              },
              {
                step: "04",
                title: "Delivery",
                description: "Upon payment, work begins. Delivery is a one-page Verdict Brief.",
              },
              {
                step: "05",
                title: "Record",
                description: "The engagement is logged. The signal becomes part of the ledger.",
              },
            ].map((item, i) => (
              <motion.div
                key={item.step}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + i * 0.1, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                className="glass-card p-6 flex gap-6"
              >
                <span className="text-3xl font-light text-primary/40">{item.step}</span>
                <div>
                  <h3 className="text-lg font-medium text-foreground mb-2">{item.title}</h3>
                  <p className="text-grey-400">{item.description}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </main>

      <ApexFooter />
    </div>
  );
};

export default Protocol;

import { motion } from "framer-motion";
import ApexNav from "@/components/layout/ApexNav";
import ApexFooter from "@/components/layout/ApexFooter";
import MobileVoid from "@/components/effects/MobileVoid";
import { useIsMobile } from "@/hooks/use-mobile";

const Ledger = () => {
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
              Record
            </span>
            <h1 className="text-4xl md:text-5xl font-semibold text-foreground tracking-wide mb-6">
              Ledger
            </h1>
            <p className="text-grey-400 max-w-lg mx-auto">
              The permanent record of signal events and system state.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="glass-card p-8 text-center"
          >
            <div className="w-16 h-16 rounded-full border border-grey-700 flex items-center justify-center mx-auto mb-6">
              <span className="text-2xl text-grey-500">◆</span>
            </div>
            <p className="text-grey-400 mb-4">
              Public ledger interface is currently reserved.
            </p>
            <p className="text-grey-500 text-sm">
              Authorized operators may access the APEX-ATA Ledger through the Nodes interface.
            </p>
          </motion.div>
        </div>
      </main>

      <ApexFooter />
    </div>
  );
};

export default Ledger;

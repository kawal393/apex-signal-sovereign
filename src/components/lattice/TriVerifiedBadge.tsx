import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Shield, ShieldCheck } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

export default function TriVerifiedBadge() {
  const [verified, setVerified] = useState(false);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const check = async () => {
      try {
        const { data } = await supabase.functions.invoke("sovereign-lattice?action=multiverse-ping", {
          method: "GET",
        });
        setVerified(data?.tri_verified || false);
      } catch {
        setVerified(false);
      } finally {
        setChecking(false);
      }
    };

    check();
    const interval = setInterval(check, 10000);
    return () => clearInterval(interval);
  }, []);

  if (checking) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg border backdrop-blur-sm ${
          verified
            ? "border-primary/40 bg-primary/10 text-primary"
            : "border-grey-700/40 bg-grey-800/30 text-grey-500"
        }`}
      >
        {verified ? (
          <>
            <motion.div
              animate={{ rotate: [0, 5, -5, 0] }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              <ShieldCheck className="w-4 h-4" />
            </motion.div>
            <span className="text-[10px] font-medium uppercase tracking-[0.2em]">
              APEX LATTICE ACTIVE
            </span>
            <motion.div
              className="w-2 h-2 rounded-full bg-primary"
              animate={{ opacity: [1, 0.4, 1] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            />
          </>
        ) : (
          <>
            <Shield className="w-4 h-4" />
            <span className="text-[10px] font-medium uppercase tracking-[0.2em]">
              LATTICE PARTIAL
            </span>
          </>
        )}
      </motion.div>
    </AnimatePresence>
  );
}

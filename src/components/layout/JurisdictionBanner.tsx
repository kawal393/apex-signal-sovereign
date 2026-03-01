import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Globe } from "lucide-react";
import { useGeo } from "@/contexts/GeoContext";

const JurisdictionBanner = () => {
  const [dismissed, setDismissed] = useState(false);
  const geo = useGeo();

  if (dismissed || geo.loading) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.5 }}
        className="fixed top-[73px] left-0 right-0 z-40 bg-primary/5 border-b border-primary/10 backdrop-blur-md"
      >
        <div className="max-w-7xl mx-auto px-6 py-2 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Globe className="w-3.5 h-3.5 text-primary/70" />
            <span className="text-[10px] uppercase tracking-[0.2em] text-primary/80">
              Currently monitoring: {geo.jurisdiction.primary.join(" · ")}
            </span>
            <span className="text-[9px] text-muted-foreground/50 tracking-wide hidden sm:inline">
              — {geo.country}
            </span>
          </div>
          <button
            onClick={() => setDismissed(true)}
            className="text-muted-foreground/40 hover:text-muted-foreground transition-colors"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default JurisdictionBanner;

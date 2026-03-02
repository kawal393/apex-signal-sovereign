import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Shield, X } from "lucide-react";
import { useJurisdictionDisclaimer } from "@/hooks/useJurisdictionDisclaimer";

const GeoConsentBanner = () => {
  const [visible, setVisible] = useState(false);
  const { consentType, consentText, countryName } = useJurisdictionDisclaimer();

  useEffect(() => {
    const consent = localStorage.getItem("apex_cookie_consent");
    if (!consent) setVisible(true);
  }, []);

  const accept = (level: "all" | "essential") => {
    localStorage.setItem("apex_cookie_consent", JSON.stringify({ level, ts: Date.now() }));
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 100, opacity: 0 }}
        transition={{ duration: 0.5 }}
        className="fixed bottom-0 left-0 right-0 z-50 p-4 md:p-6"
      >
        <div className="max-w-3xl mx-auto bg-card/95 backdrop-blur-xl border border-border/40 rounded-xl p-5 md:p-6 shadow-2xl">
          <div className="flex items-start gap-3">
            <Shield className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
            <div className="flex-1">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-medium text-foreground">
                  {consentType === "gdpr" ? "Cookie Consent Required" : consentType === "ccpa" ? "Privacy Notice" : "Cookie Notice"}
                </h3>
                <button onClick={() => accept("essential")} className="text-muted-foreground hover:text-foreground transition-colors">
                  <X className="w-4 h-4" />
                </button>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed mb-3">
                {consentText}
              </p>
              <div className="text-[9px] text-muted-foreground/50 mb-3 uppercase tracking-[0.15em]">
                Detected jurisdiction: {countryName}
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => accept("all")}
                  className="px-4 py-2 text-xs font-medium bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
                >
                  Accept All
                </button>
                {consentType === "gdpr" && (
                  <button
                    onClick={() => accept("essential")}
                    className="px-4 py-2 text-xs font-medium border border-border text-foreground rounded-lg hover:bg-accent transition-colors"
                  >
                    Essential Only
                  </button>
                )}
                {consentType === "ccpa" && (
                  <button
                    onClick={() => accept("essential")}
                    className="px-4 py-2 text-xs font-medium border border-border text-foreground rounded-lg hover:bg-accent transition-colors"
                  >
                    Do Not Sell My Info
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default GeoConsentBanner;

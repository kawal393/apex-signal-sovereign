import { motion } from "framer-motion";
import ApexNav from "@/components/layout/ApexNav";
import ApexFooter from "@/components/layout/ApexFooter";
import MobileVoid from "@/components/effects/MobileVoid";
import { useIsMobile } from "@/hooks/use-mobile";
import { useJurisdictionDisclaimer } from "@/hooks/useJurisdictionDisclaimer";

const disclaimers = [
  {
    title: "Opinion-Based Assessments",
    content: "All APEX deliverables constitute opinion-based operational risk assessments. They represent analysis and interpretation of available information, not objective truth or guaranteed outcomes.",
  },
  {
    title: "Not Legal Advice",
    content: "Nothing provided by APEX Infrastructure constitutes legal advice. We do not provide legal opinions, legal strategy, or recommendations that require legal licensing. Consult a qualified legal professional for legal matters.",
  },
  {
    title: "Information Sources",
    content: "APEX assessments are based on publicly available information and/or materials provided by the client. We do not guarantee the accuracy, completeness, or timeliness of source materials.",
  },
  {
    title: "No Guarantees",
    content: "APEX makes no guarantees regarding outcomes, results, or the accuracy of predictions. All assessments are provided as-is, representing our analysis at a point in time.",
  },
  {
    title: "Client Responsibility",
    content: "The client remains solely responsible for all decisions and actions taken based on APEX deliverables. Use of our assessments is at the client's own risk and discretion.",
  },
  {
    title: "Confidentiality Boundaries",
    content: "While we treat client inquiries with discretion, APEX is not bound by attorney-client privilege or similar legal protections. Do not share information you require to remain privileged.",
  },
];

const Disclaimers = () => {
  const isMobile = useIsMobile();
  const { disclaimerAddendum, countryName } = useJurisdictionDisclaimer();

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
              Boundary
            </span>
            <h1 className="text-4xl md:text-5xl font-semibold text-foreground tracking-wide mb-6">
              Disclaimers
            </h1>
            <p className="text-grey-400">
              Clear boundaries for clear operations.
            </p>
          </motion.div>

          <div className="space-y-8">
            {disclaimers.map((item, i) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + i * 0.1, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                className="glass-card p-6"
              >
                <h2 className="text-lg font-medium text-foreground mb-3">
                  {item.title}
                </h2>
                <p className="text-grey-400 leading-relaxed">
                  {item.content}
                </p>
              </motion.div>
            ))}

            {disclaimerAddendum && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8, duration: 0.8 }}
                className="glass-card p-6 border-primary/20"
              >
                <h2 className="text-lg font-medium text-foreground mb-1">
                  Jurisdiction-Specific Notice
                </h2>
                <span className="text-[9px] uppercase tracking-[0.2em] text-primary/60 block mb-3">
                  Detected: {countryName}
                </span>
                <p className="text-grey-400 leading-relaxed">
                  {disclaimerAddendum}
                </p>
              </motion.div>
            )}
          </div>
        </div>
      </main>

      <ApexFooter />
    </div>
  );
};

export default Disclaimers;

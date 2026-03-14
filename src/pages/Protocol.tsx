import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import ApexNav from "@/components/layout/ApexNav";
import ApexFooter from "@/components/layout/ApexFooter";
import MobileVoid from "@/components/effects/MobileVoid";
import { useIsMobile } from "@/hooks/use-mobile";
import { ArrowRight, ExternalLink } from "lucide-react";

const regulatoryMap = [
  {
    law: "EU AI Act Art. 12",
    requirement: "Automatic logging of high-risk AI system events",
    psiImpl: "Immutable Event Streaming via RFC 8785 JSON Canonicalization",
    status: "IMPLEMENTED",
  },
  {
    law: "EU AI Act Art. 14",
    requirement: "Human oversight with full understanding of AI capabilities",
    psiImpl: "Human-in-the-Loop Multi-Sig Notary with MPC Verification",
    status: "IMPLEMENTED",
  },
  {
    law: "EU AI Act Art. 9",
    requirement: "Risk management system throughout AI lifecycle",
    psiImpl: "Digital Gallows Kill-Switch with <5s automated response",
    status: "ACTIVE",
  },
  {
    law: "NDIS Standard 1.2",
    requirement: "Participant rights and service agreement transparency",
    psiImpl: "Participant-Controlled Payment Integrity Ledger",
    status: "BUILDING",
  },
  {
    law: "Mining Act Sec. 48",
    requirement: "Graticular compliance and mineral rights verification",
    psiImpl: "Sovereign Graticular Gap Verification Scanner",
    status: "ACTIVE",
  },
  {
    law: "MiFID II Art. 25",
    requirement: "Record-keeping and transaction audit trails",
    psiImpl: "Bitcoin-Anchored Merkle Root Audit Chain",
    status: "IMPLEMENTED",
  },
  {
    law: "DORA Art. 11",
    requirement: "ICT incident reporting and classification",
    psiImpl: "Automated Incident Sequencing with Non-Repudiation",
    status: "PLANNED",
  },
  {
    law: "TGA Compliance",
    requirement: "Pharmaceutical regulatory signal monitoring",
    psiImpl: "Pharma Sniper — Deadline-Triggered Compliance Alerts",
    status: "BUILDING",
  },
  {
    law: "EU AI Act Art. 15",
    requirement: "Accuracy, robustness and cybersecurity of high-risk AI",
    psiImpl: "Zero-Knowledge Integrity Proofs (ZK-SNARKs) for Model Validation",
    status: "PLANNED",
  },
  {
    law: "NDIS Standard 2.4",
    requirement: "Risk management and incident response procedures",
    psiImpl: "Immutable Incident & Service Delivery Ledger with Non-Repudiation",
    status: "BUILDING",
  },
];

const statusColors: Record<string, string> = {
  IMPLEMENTED: "text-green-400 border-green-500/30 bg-green-950/20",
  ACTIVE: "text-primary border-primary/30 bg-primary/5",
  BUILDING: "text-purple-light border-purple-mid/30 bg-purple-void/20",
  PLANNED: "text-grey-400 border-grey-700/30 bg-grey-900/20",
};

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
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
            className="text-center mb-16"
          >
            <span className="text-[10px] uppercase tracking-[0.6em] text-grey-300 block mb-4">
              PSI Protocol v1.0
            </span>
            <h1 className="text-4xl md:text-5xl font-semibold text-foreground tracking-wide mb-6">
              Proof of Sovereign Integrity
            </h1>
            <p className="text-grey-400 max-w-2xl mx-auto mb-8">
              Every regulatory requirement mapped to a cryptographic implementation.
              The PSI Protocol is not a product — it is a technical standard.
            </p>
            <div className="inline-flex items-center gap-3 px-5 py-2.5 rounded border border-border/20 bg-card/30 text-[10px] uppercase tracking-[0.3em] text-grey-500">
              <span>RFC 8785 Compliant</span>
              <span className="w-px h-3 bg-grey-700" />
              <span>Ed25519 Signed</span>
              <span className="w-px h-3 bg-grey-700" />
              <span>Bitcoin Anchored</span>
            </div>
          </motion.div>

          {/* Regulatory Mapping Table */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="mb-16"
          >
            <div className="rounded-lg border border-border/20 overflow-hidden">
              {/* Table Header */}
              <div className="hidden md:grid grid-cols-12 gap-4 px-6 py-4 bg-card/40 border-b border-border/20">
                <div className="col-span-2 text-[9px] uppercase tracking-[0.3em] text-grey-500 font-semibold">
                  Regulation
                </div>
                <div className="col-span-4 text-[9px] uppercase tracking-[0.3em] text-grey-500 font-semibold">
                  Requirement
                </div>
                <div className="col-span-4 text-[9px] uppercase tracking-[0.3em] text-grey-500 font-semibold">
                  PSI Implementation
                </div>
                <div className="col-span-2 text-[9px] uppercase tracking-[0.3em] text-grey-500 font-semibold text-right">
                  Status
                </div>
              </div>

              {/* Table Rows */}
              {regulatoryMap.map((row, i) => (
                <motion.div
                  key={row.law}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + i * 0.06, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                  className="grid grid-cols-1 md:grid-cols-12 gap-2 md:gap-4 px-6 py-5 border-b border-border/10 hover:bg-card/20 transition-colors duration-300"
                >
                  <div className="md:col-span-2">
                    <span className="text-sm font-semibold text-foreground tracking-wide">
                      {row.law}
                    </span>
                  </div>
                  <div className="md:col-span-4">
                    <p className="text-sm text-grey-400 leading-relaxed">{row.requirement}</p>
                  </div>
                  <div className="md:col-span-4">
                    <p className="text-sm text-grey-300 leading-relaxed font-medium">{row.psiImpl}</p>
                  </div>
                  <div className="md:col-span-2 flex md:justify-end items-start">
                    <span className={`text-[9px] uppercase tracking-[0.2em] px-2.5 py-1 rounded border ${statusColors[row.status]}`}>
                      {row.status}
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Engagement Protocol Steps */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="mb-16"
          >
            <h2 className="text-2xl font-semibold text-foreground tracking-wide mb-8 text-center">
              Engagement Protocol
            </h2>
            <div className="space-y-4">
              {[
                { step: "01", title: "Request", desc: "Submit decision context through the access gate." },
                { step: "02", title: "Assessment", desc: "Your request is evaluated for fit. Not all requests are accepted." },
                { step: "03", title: "Invoice", desc: "If accepted, an invoice is issued with scope and timeline." },
                { step: "04", title: "Delivery", desc: "Upon payment, work begins. Delivery is a Verdict Brief." },
                { step: "05", title: "Record", desc: "The engagement is logged immutably in the ATA Ledger." },
              ].map((item, i) => (
                <motion.div
                  key={item.step}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.6 + i * 0.08, duration: 0.6 }}
                  className="flex gap-6 p-5 rounded-lg border border-border/10 bg-card/20 hover:bg-card/30 transition-colors"
                >
                  <span className="text-2xl font-light text-primary/30">{item.step}</span>
                  <div>
                    <h3 className="text-base font-medium text-foreground mb-1">{item.title}</h3>
                    <p className="text-sm text-grey-400">{item.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8, duration: 0.8 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link
              to="/verify"
              className="inline-flex items-center gap-3 px-8 py-4 rounded-lg border border-primary/40 bg-primary/10 hover:bg-primary/20 text-primary text-sm uppercase tracking-[0.3em] transition-all duration-500"
            >
              Verify a Proof
              <ArrowRight className="w-4 h-4" />
            </Link>
            <a
              href="https://digital-gallows.apex-infrastructure.com"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 px-8 py-4 rounded-lg border border-border/30 hover:border-border/50 text-grey-400 hover:text-grey-200 text-sm uppercase tracking-[0.3em] transition-all duration-500"
            >
              Digital Gallows
              <ExternalLink className="w-4 h-4" />
            </a>
          </motion.div>
        </div>
      </main>

      <ApexFooter />
    </div>
  );
};

export default Protocol;

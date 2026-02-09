import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ApexButton } from "@/components/ui/apex-button";

/**
 * ATA Ledger Register Section
 * 
 * Displays the ledger as a registry / archive / authority memory.
 * Shows 3 sanitized demo entries marked as UNSEALED/DEMONSTRATION.
 */

interface LedgerEntry {
  id: string;
  timestamp: string;
  domain: string;
  verdictType: string;
  outcome: string;
  status: 'unsealed' | 'sealed';
  summary: string;
}

const DEMO_ENTRIES: LedgerEntry[] = [
  {
    id: "ATA-DEMO-001",
    timestamp: "2025-02-XX",
    domain: "NDIS Provider Compliance",
    verdictType: "Conditional Verdict",
    outcome: "HOLD",
    status: 'unsealed',
    summary: "Provider expansion into regional territory assessed against current regulatory state and enforcement patterns.",
  },
  {
    id: "ATA-DEMO-002",
    timestamp: "2025-02-XX",
    domain: "Energy Grid Connection",
    verdictType: "Conditional Verdict",
    outcome: "ADVANCE",
    status: 'unsealed',
    summary: "Large load connection queue position evaluated against grid constraint forecasts and REZ bottleneck signals.",
  },
  {
    id: "ATA-DEMO-003",
    timestamp: "2025-02-XX",
    domain: "Corporate Restructure",
    verdictType: "Conditional Verdict",
    outcome: "PARTNER-ONLY",
    status: 'unsealed',
    summary: "Institutional partnership risk matrix assessed against counterparty dependency signals.",
  },
];

const outcomeColors: Record<string, string> = {
  ADVANCE: "text-emerald-400 border-emerald-400/30",
  HOLD: "text-amber-400 border-amber-400/30",
  "PARTNER-ONLY": "text-purple-light border-purple-light/30",
  DROP: "text-crimson border-crimson/30",
};

export default function ATALedgerRegister() {
  return (
    <section className="relative py-28 md:py-36 border-b border-border/5">
      <div className="container mx-auto px-6 relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
          className="text-center mb-16"
        >
          <span className="text-[10px] uppercase tracking-[0.6em] text-grey-500 block mb-6">
            Authority Memory
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-light text-foreground tracking-wide mb-6">
            ATA <span className="text-gradient-gold font-normal">Ledger</span>
          </h2>
          
          {/* Ledger Pulse indicator */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3, duration: 1 }}
            className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full border border-grey-700/50 bg-grey-900/50"
          >
            <motion.span
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="w-2 h-2 rounded-full bg-primary"
            />
            <span className="text-xs uppercase tracking-[0.2em] text-grey-400">
              Ledger Pulse: <span className="text-grey-300">3 entries active</span>
            </span>
            <span className="text-[10px] uppercase tracking-[0.15em] text-amber-400/80 px-2 py-0.5 rounded bg-amber-400/10 border border-amber-400/20">
              UNSEALED / DEMONSTRATION
            </span>
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5, duration: 1 }}
            className="text-grey-500 text-sm mt-6 max-w-xl mx-auto"
          >
            Sealed, citeable entries appear only after payment and ATA-ID issuance.
          </motion.p>
        </motion.div>

        {/* Ledger Entries */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4, duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-4xl mx-auto"
        >
          {/* Registry header */}
          <div className="hidden md:grid grid-cols-12 gap-4 px-6 py-3 text-[10px] uppercase tracking-[0.2em] text-grey-600 border-b border-grey-800/50">
            <div className="col-span-2">Entry ID</div>
            <div className="col-span-3">Domain</div>
            <div className="col-span-4">Summary</div>
            <div className="col-span-2">Outcome</div>
            <div className="col-span-1 text-right">Status</div>
          </div>

          {/* Entries */}
          <div className="divide-y divide-grey-800/30">
            {DEMO_ENTRIES.map((entry, i) => (
              <motion.div
                key={entry.id}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.5 + i * 0.1, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                className="group py-6 px-6 hover:bg-grey-900/30 transition-colors duration-500 rounded-lg"
              >
                {/* Demo warning badge */}
                <div className="mb-4 md:hidden">
                  <span className="text-[9px] uppercase tracking-[0.2em] text-amber-400/70 px-2 py-1 rounded bg-amber-400/5 border border-amber-400/15">
                    SANITIZED DEMO — UNSEALED — NOT CITEABLE
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-start">
                  {/* Entry ID */}
                  <div className="md:col-span-2">
                    <span className="text-xs font-mono text-grey-400">{entry.id}</span>
                    <div className="text-[10px] text-grey-600 mt-1">{entry.timestamp}</div>
                  </div>

                  {/* Domain */}
                  <div className="md:col-span-3">
                    <span className="text-sm text-grey-300">{entry.domain}</span>
                    <div className="text-[10px] text-grey-600 mt-1">{entry.verdictType}</div>
                  </div>

                  {/* Summary */}
                  <div className="md:col-span-4">
                    <p className="text-sm text-grey-500 leading-relaxed">{entry.summary}</p>
                  </div>

                  {/* Outcome */}
                  <div className="md:col-span-2">
                    <span className={`inline-block px-3 py-1 rounded-md border text-xs font-medium ${outcomeColors[entry.outcome] || 'text-grey-400 border-grey-700'}`}>
                      {entry.outcome}
                    </span>
                  </div>

                  {/* Status */}
                  <div className="md:col-span-1 md:text-right">
                    <span className="text-[10px] uppercase tracking-[0.15em] text-amber-400/60">
                      {entry.status}
                    </span>
                    {/* Desktop demo badge */}
                    <div className="hidden md:block mt-2">
                      <span className="text-[8px] uppercase tracking-[0.1em] text-amber-400/50">
                        DEMO
                      </span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Registry notice */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.8, duration: 1 }}
          className="mt-12 text-center"
        >
          <p className="text-grey-600 text-xs tracking-wide mb-8">
            These entries are sanitized demonstrations only. They are not citeable and carry no authority.
          </p>
          <Link to="/request-verdict">
            <ApexButton variant="outline" size="sm">
              Request Conditional Verdict
            </ApexButton>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}

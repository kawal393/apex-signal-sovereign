import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ApexButton } from "@/components/ui/apex-button";

/**
 * ATA Ledger Register Section
 * 
 * Displays the ledger as a registry / archive / authority memory.
 * Shows demo entries with full 5-element verdict format marked as UNSEALED/DEMONSTRATION.
 */

interface LedgerEntry {
  id: string;
  timestamp: string;
  domain: string;
  verdictType: string;
  outcome: string;
  status: 'unsealed' | 'sealed';
  label: string;
  summary: string;
  tier: string;
  confidence: string;
  why: string[];
  nextCheapestTest: string;
  killRule: string;
}

const DEMO_ENTRIES: LedgerEntry[] = [
  {
    id: "ATA-DEMO-001",
    timestamp: "2025-02-XX",
    domain: "NDIS Provider Compliance",
    verdictType: "Conditional Verdict",
    outcome: "HOLD",
    status: 'unsealed',
    label: "DEMO (UNSEALED)",
    summary: "Provider expansion into regional territory assessed against current regulatory state and enforcement patterns.",
    tier: "Standard",
    confidence: "78%",
    why: [
      "Enforcement patterns show rising audit frequency in target region",
      "Provider registration backlog signals 4–6 month delays",
      "Pricing band compression limits margin on expansion",
    ],
    nextCheapestTest: "Submit Expression of Interest to test registration queue response time",
    killRule: "If audit frequency exceeds 2x national average in target region, abort expansion",
  },
  {
    id: "ATA-DEMO-002",
    timestamp: "2025-02-XX",
    domain: "Energy Grid Connection",
    verdictType: "Conditional Verdict",
    outcome: "ADVANCE",
    status: 'unsealed',
    label: "RETROACTIVE (Public-data)",
    summary: "Large load connection queue position evaluated against grid constraint forecasts and REZ bottleneck signals.",
    tier: "Complex",
    confidence: "85%",
    why: [
      "Connection queue position is inside 12-month approval window",
      "REZ bottleneck at target substation is easing per AEMO data",
      "Grid constraint forecast shows capacity uplift in Q3",
    ],
    nextCheapestTest: "File formal connection enquiry to confirm queue position and timeline",
    killRule: "If AEMO revises constraint forecast upward by >15%, pause and reassess",
  },
  {
    id: "ATA-DEMO-003",
    timestamp: "2025-02-XX",
    domain: "Corporate Restructure",
    verdictType: "Conditional Verdict",
    outcome: "PARTNER-ONLY",
    status: 'unsealed',
    label: "DEMO (UNSEALED)",
    summary: "Institutional partnership risk matrix assessed against counterparty dependency signals.",
    tier: "Partner",
    confidence: "62%",
    why: [
      "Counterparty dependency ratio exceeds safe threshold",
      "Director tenure signals instability in governance layer",
      "Public filing language shows hedging increase quarter-on-quarter",
    ],
    nextCheapestTest: "Request counterparty's latest audited financials and compare to public filings",
    killRule: "If counterparty loses key directorship or primary contract, exit immediately",
  },
  {
    id: "ATA-DEMO-004",
    timestamp: "2025-03-XX",
    domain: "Mining & Tenement Risk",
    verdictType: "Conditional Verdict",
    outcome: "HOLD",
    status: 'unsealed',
    label: "RETROACTIVE (Public-data)",
    summary: "Tenement renewal risk assessed against state regulatory posture and native title overlay mapping.",
    tier: "Standard",
    confidence: "71%",
    why: [
      "State regulator flagged tenement cluster for priority compliance review",
      "Native title determination pending over 40% of target area",
      "Commodity price cycle does not support capex at current forward curve",
    ],
    nextCheapestTest: "Lodge pre-emptive compliance audit with state regulator to test response posture",
    killRule: "If native title determination excludes target zone, abandon tenement strategy",
  },
  {
    id: "ATA-DEMO-005",
    timestamp: "2025-03-XX",
    domain: "Water Rights Allocation",
    verdictType: "Conditional Verdict",
    outcome: "ADVANCE",
    status: 'unsealed',
    label: "DEMO (UNSEALED)",
    summary: "Water entitlement trade assessed against allocation forecast, carryover rules, and basin plan triggers.",
    tier: "Complex",
    confidence: "80%",
    why: [
      "Allocation forecast exceeds 80% for target water year",
      "Carryover rules permit multi-year banking in target zone",
      "Basin plan trigger thresholds unlikely to activate under current inflow",
    ],
    nextCheapestTest: "Secure indicative quote from water broker to confirm market depth at target volume",
    killRule: "If allocation announcement drops below 60%, exit position immediately",
  },
  {
    id: "ATA-DEMO-006",
    timestamp: "2025-04-XX",
    domain: "Carbon & Safeguard Mechanism",
    verdictType: "Conditional Verdict",
    outcome: "DROP",
    status: 'unsealed',
    label: "RETROACTIVE (Public-data)",
    summary: "ACCU generation project viability assessed against safeguard mechanism baseline decline and method credibility.",
    tier: "Standard",
    confidence: "88%",
    why: [
      "Safeguard baseline decline rate exceeds project emission reduction capacity",
      "Method under review by Clean Energy Regulator with integrity concerns flagged",
      "ACCU spot price insufficient to cover project operating costs at current yield",
    ],
    nextCheapestTest: "No test warranted — fundamentals are structurally adverse",
    killRule: "Already triggered: method integrity review alone is sufficient to exit",
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
              Ledger Pulse: <span className="text-grey-300">{DEMO_ENTRIES.length} entries active</span>
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
            Public ledger entries include demo format + retroactive proof patterns using public sources.
            Sealed, citeable entries appear only after payment and ATA-ID issuance.
          </motion.p>
        </motion.div>

        {/* Ledger Entries — Full 5-element Verdict Cards */}
        <div className="max-w-4xl mx-auto space-y-6">
          {DEMO_ENTRIES.map((entry, i) => (
            <motion.div
              key={entry.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 + i * 0.1, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="glass-card p-6 md:p-8 border-grey-700/30 hover:border-grey-600/40 transition-all duration-300"
            >
              {/* Card header */}
              <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
                <div className="flex items-center gap-3">
                  <span className="text-xs font-mono text-grey-400">{entry.id}</span>
                  <span className="text-[9px] uppercase tracking-[0.2em] text-amber-400/70 px-2 py-0.5 rounded bg-amber-400/5 border border-amber-400/15">
                    {entry.label}
                  </span>
                </div>
                <span className={`inline-block px-3 py-1 rounded-md border text-xs font-medium ${outcomeColors[entry.outcome] || 'text-grey-400 border-grey-700'}`}>
                  {entry.outcome}
                </span>
              </div>

              <p className="text-sm text-grey-300 mb-5">{entry.domain} — {entry.summary}</p>

              {/* 5-element verdict format */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                {/* Tier */}
                <div className="space-y-1">
                  <span className="text-[9px] uppercase tracking-[0.2em] text-grey-600 block">Tier</span>
                  <p className="text-grey-300 font-medium">{entry.tier}</p>
                </div>
                {/* Confidence */}
                <div className="space-y-1">
                  <span className="text-[9px] uppercase tracking-[0.2em] text-grey-600 block">Confidence</span>
                  <p className="text-grey-300 font-medium">{entry.confidence}</p>
                </div>
              </div>

              {/* Why */}
              <div className="mt-4 space-y-1">
                <span className="text-[9px] uppercase tracking-[0.2em] text-grey-600 block mb-2">Why (max 3)</span>
                <ul className="space-y-1.5">
                  {entry.why.map((reason, j) => (
                    <li key={j} className="flex items-start gap-2 text-sm text-grey-400">
                      <span className="text-primary/60 mt-0.5 text-xs">◆</span>
                      {reason}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Next Cheapest Test */}
              <div className="mt-4 space-y-1">
                <span className="text-[9px] uppercase tracking-[0.2em] text-grey-600 block">Next Cheapest Test</span>
                <p className="text-sm text-grey-300">{entry.nextCheapestTest}</p>
              </div>

              {/* Kill Rule */}
              <div className="mt-4 space-y-1">
                <span className="text-[9px] uppercase tracking-[0.2em] text-crimson/70 block">Kill Rule</span>
                <p className="text-sm text-grey-300">{entry.killRule}</p>
              </div>
            </motion.div>
          ))}
        </div>

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
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/ledger">
              <ApexButton variant="outline" size="sm">
                Browse Ledger →
              </ApexButton>
            </Link>
            <Link to="/request-verdict">
              <ApexButton variant="ghost" size="sm" className="text-grey-400">
                Request Conditional Verdict
              </ApexButton>
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

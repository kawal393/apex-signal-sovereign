import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import ApexNav from "@/components/layout/ApexNav";
import ApexFooter from "@/components/layout/ApexFooter";
import MobileVoid from "@/components/effects/MobileVoid";
import { ApexButton } from "@/components/ui/apex-button";
import { useIsMobile } from "@/hooks/use-mobile";

interface VerdictElement {
  tier: string;
  confidence: string;
  why: string[];
  nextTest: string;
  killRule: string;
}

interface LedgerEntry {
  id: string;
  timestamp: string;
  domain: string;
  verdictType: string;
  outcome: string;
  status: 'unsealed' | 'sealed';
  summary: string;
  elements: VerdictElement;
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
    elements: {
      tier: "HOLD",
      confidence: "72%",
      why: [
        "Current enforcement signal density in target region is elevated",
        "Recent compliance audits in adjacent postcode clusters",
        "Regulatory position unclear on expansion timing",
      ],
      nextTest: "Wait for next quarterly enforcement data release (est. 6 weeks)",
      killRule: "If enforcement action announced in target region within 90 days, downgrade to DROP",
    },
  },
  {
    id: "ATA-DEMO-002",
    timestamp: "2025-02-XX",
    domain: "Energy Grid Connection",
    verdictType: "Conditional Verdict",
    outcome: "ADVANCE",
    status: 'unsealed',
    summary: "Large load connection queue position evaluated against grid constraint forecasts and REZ bottleneck signals.",
    elements: {
      tier: "ADVANCE",
      confidence: "84%",
      why: [
        "Queue position is favorable relative to current capacity timeline",
        "REZ bottleneck resolution announced for Q3",
        "Competitor load applications show lower priority scores",
      ],
      nextTest: "Confirm connection agreement terms within 30 days",
      killRule: "If capacity allocation delayed beyond Q4, reassess with fresh constraint data",
    },
  },
  {
    id: "ATA-DEMO-003",
    timestamp: "2025-02-XX",
    domain: "Corporate Restructure",
    verdictType: "Conditional Verdict",
    outcome: "PARTNER-ONLY",
    status: 'unsealed',
    summary: "Institutional partnership risk matrix assessed against counterparty dependency signals.",
    elements: {
      tier: "PARTNER-ONLY",
      confidence: "68%",
      why: [
        "Counterparty financial stability signals are mixed",
        "Dependency concentration creates asymmetric risk",
        "Exit pathways require advance structuring",
      ],
      nextTest: "Structure exit clause before formal commitment",
      killRule: "If counterparty discloses material liability exceeding 15% of deal value, DROP",
    },
  },
];

const outcomeColors: Record<string, string> = {
  ADVANCE: "text-emerald-400 border-emerald-400/30 bg-emerald-400/5",
  HOLD: "text-amber-400 border-amber-400/30 bg-amber-400/5",
  "PARTNER-ONLY": "text-purple-light border-purple-light/30 bg-purple-light/5",
  DROP: "text-crimson border-crimson/30 bg-crimson/5",
};

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
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
            className="text-center mb-16"
          >
            <span className="text-[10px] uppercase tracking-[0.6em] text-grey-500 block mb-4">
              Authority Memory
            </span>
            <h1 className="text-4xl md:text-5xl font-semibold text-foreground tracking-wide mb-6">
              ATA <span className="text-gradient-gold">Ledger</span>
            </h1>
            <p className="text-grey-400 max-w-lg mx-auto mb-6">
              The permanent record of decision authority. Immutable. Citeable. Sovereign.
            </p>

            {/* Top Banner */}
            <div className="glass-card p-4 max-w-xl mx-auto mb-8 border-primary/20 bg-primary/5 text-center">
              <p className="text-grey-300 text-sm font-medium">
                SEALED entries are citeable. UNSEALED/DEMO entries are format previews.
              </p>
            </div>

            <div className="flex items-center justify-center gap-4 mb-8">
              <Link to="/request-verdict">
                <ApexButton variant="primary" size="sm" className="gap-2">
                  Request a Sealed Verdict
                  <ArrowRight className="w-3.5 h-3.5" />
                </ApexButton>
              </Link>
            </div>

            {/* Ledger Pulse indicator */}
            <div className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full border border-grey-700/50 bg-grey-900/50">
              <motion.span
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="w-2 h-2 rounded-full bg-primary"
              />
              <span className="text-xs uppercase tracking-[0.2em] text-grey-400">
                Ledger Pulse: <span className="text-grey-300">3 entries active</span>
              </span>
              <span className="text-[10px] uppercase tracking-[0.15em] text-primary/80 px-2 py-0.5 rounded bg-primary/10 border border-primary/20">
                UNSEALED / DEMONSTRATION
              </span>
            </div>
          </motion.div>

          {/* Explanation */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="glass-card p-8 mb-12"
          >
            <h2 className="text-xs uppercase tracking-[0.4em] text-grey-400 mb-6">
              About the ATA Ledger
            </h2>
            <div className="space-y-4 text-grey-400 text-sm leading-relaxed">
              <p>
                The ATA Ledger maintains a permanent record of all Sealed Verdict Briefs issued by APEX Infrastructure.
              </p>
              <p>
                Each entry receives a unique ATA-ID upon sealing, creating an immutable reference point for 
                decision authority.
              </p>
              <p className="text-grey-500">
                Sealed verdicts are citeable in institutional documentation. Unsealed entries shown here 
                are demonstrations only and carry no authority.
              </p>
            </div>
          </motion.div>

          {/* Demo Entries */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="mb-12"
          >
            <h2 className="text-xs uppercase tracking-[0.4em] text-grey-500 mb-6">
              Demonstration Entries
            </h2>

            {/* Registry header */}
            <div className="hidden md:grid grid-cols-12 gap-4 px-6 py-3 text-[10px] uppercase tracking-[0.2em] text-grey-600 border-b border-grey-800/50">
              <div className="col-span-2">Entry ID</div>
              <div className="col-span-3">Domain</div>
              <div className="col-span-4">Summary</div>
              <div className="col-span-2">Outcome</div>
              <div className="col-span-1 text-right">Status</div>
            </div>

            {/* Entries with full 5-element structure */}
            <div className="space-y-6">
              {DEMO_ENTRIES.map((entry, i) => (
                <motion.div
                  key={entry.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 + i * 0.15, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                  className="glass-card p-6 border-grey-700/30"
                >
                  {/* Demo warning badge */}
                  <div className="mb-4 flex items-center justify-between">
                    <span className="text-[9px] uppercase tracking-[0.2em] text-muted-foreground px-2 py-1 rounded bg-muted border border-border">
                      SANITIZED DEMO — UNSEALED — NOT CITEABLE
                    </span>
                    <span className={`inline-block px-3 py-1 rounded-md border text-xs font-medium ${outcomeColors[entry.outcome] || 'text-muted-foreground border-border'}`}>
                      {entry.outcome}
                    </span>
                  </div>

                  {/* Header */}
                  <div className="grid md:grid-cols-3 gap-4 mb-6 pb-4 border-b border-border/30">
                    <div>
                      <span className="text-[9px] uppercase tracking-[0.2em] text-muted-foreground block mb-1">ATA ID</span>
                      <span className="text-sm font-mono text-foreground">{entry.id}</span>
                    </div>
                    <div>
                      <span className="text-[9px] uppercase tracking-[0.2em] text-muted-foreground block mb-1">Domain</span>
                      <span className="text-sm text-foreground">{entry.domain}</span>
                    </div>
                    <div>
                      <span className="text-[9px] uppercase tracking-[0.2em] text-muted-foreground block mb-1">Date</span>
                      <span className="text-sm text-muted-foreground">{entry.timestamp}</span>
                    </div>
                  </div>

                  {/* Summary */}
                  <p className="text-sm text-muted-foreground leading-relaxed mb-6">{entry.summary}</p>

                  {/* 5 Required Elements */}
                  <div className="grid md:grid-cols-2 gap-6">
                    {/* Left column */}
                    <div className="space-y-4">
                      {/* 1. Tier */}
                      <div>
                        <span className="text-[9px] uppercase tracking-[0.2em] text-muted-foreground block mb-1">1. Tier</span>
                        <span className={`inline-block px-3 py-1 rounded-md border text-sm font-medium ${outcomeColors[entry.elements.tier] || 'text-foreground border-border'}`}>
                          {entry.elements.tier}
                        </span>
                      </div>

                      {/* 2. Confidence */}
                      <div>
                        <span className="text-[9px] uppercase tracking-[0.2em] text-muted-foreground block mb-1">2. Confidence</span>
                        <span className="text-lg font-medium text-foreground">{entry.elements.confidence}</span>
                      </div>

                      {/* 3. Why (3 bullets) */}
                      <div>
                        <span className="text-[9px] uppercase tracking-[0.2em] text-muted-foreground block mb-2">3. Why</span>
                        <ul className="space-y-2">
                          {entry.elements.why.map((reason, ri) => (
                            <li key={ri} className="flex items-start gap-2 text-sm text-muted-foreground">
                              <span className="text-primary mt-1">•</span>
                              <span>{reason}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    {/* Right column */}
                    <div className="space-y-4">
                      {/* 4. Next Cheapest Test */}
                      <div>
                        <span className="text-[9px] uppercase tracking-[0.2em] text-muted-foreground block mb-1">4. Next Cheapest Test</span>
                        <p className="text-sm text-foreground leading-relaxed">{entry.elements.nextTest}</p>
                      </div>

                      {/* 5. Kill Rule */}
                      <div>
                        <span className="text-[9px] uppercase tracking-[0.2em] text-destructive/70 block mb-1">5. Kill Rule</span>
                        <p className="text-sm text-muted-foreground leading-relaxed">{entry.elements.killRule}</p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* How to Cite Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="glass-card p-6 mb-12"
          >
            <h2 className="text-xs uppercase tracking-[0.4em] text-muted-foreground mb-4">
              How to Cite
            </h2>
            <p className="text-sm text-muted-foreground leading-relaxed mb-4">
              Only <span className="text-foreground font-medium">SEALED</span> entries are citeable in institutional documentation.
            </p>
            <div className="bg-black/50 rounded-md p-4 border border-border/50">
              <code className="text-xs text-primary font-mono">
                APEX Verdict Brief, ATA-[ID], [Date], [Domain]
              </code>
            </div>
            <p className="text-xs text-muted-foreground mt-4">
              Unsealed demonstration entries carry no authority and must not be cited.
            </p>
          </motion.div>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.8 }}
            className="text-center"
          >
            <p className="text-grey-600 text-xs tracking-wide mb-8">
              Sealed, citeable entries appear only after payment and ATA-ID issuance.
            </p>
            <Link to="/request-verdict">
              <ApexButton variant="outline" size="lg">
                Request Conditional Verdict
              </ApexButton>
            </Link>
          </motion.div>
        </div>
      </main>

      <ApexFooter />
    </div>
  );
};

export default Ledger;

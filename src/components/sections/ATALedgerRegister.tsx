import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ApexButton } from "@/components/ui/apex-button";
import { useState, useEffect } from "react";

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
// Dynamic loading will occur in component mount

const outcomeColors: Record<string, string> = {
  ADVANCE: "text-emerald-400 border-emerald-400/30",
  HOLD: "text-amber-400 border-amber-400/30",
  "PARTNER-ONLY": "text-purple-light border-purple-light/30",
  DROP: "text-crimson border-crimson/30",
};

export default function ATALedgerRegister() {
  const [demoEntries, setDemoEntries] = useState<LedgerEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch('/data/ledger.json')
      .then(res => res.json())
      .then(data => {
        setDemoEntries(data);
        setIsLoading(false);
      })
      .catch(err => {
        console.error("Failed to load ledger data:", err);
        setIsLoading(false);
      });
  }, []);

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
              Ledger Pulse: <span className="text-grey-300">{isLoading ? '...' : demoEntries.length} entries active</span>
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
          {!isLoading && demoEntries.map((entry, i) => (
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

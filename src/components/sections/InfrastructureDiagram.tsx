import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { ApexButton } from "@/components/ui/apex-button";

const layers = [
  { label: "Portal", sublabel: "Entrance", description: "The sovereign interface. Where operators enter the system.", color: "border-primary/40 bg-primary/5" },
  { label: "Public Nodes", sublabel: "Proof", description: "Live intelligence across regulated sectors. Verifiable signal output.", color: "border-grey-500/30 bg-grey-800/20" },
  { label: "Verdict Briefs", sublabel: "Authority", description: "Structured judgment. Monetization layer. The decision itself.", color: "border-primary/30 bg-primary/5" },
  { label: "ATA Ledger", sublabel: "Memory", description: "Immutable record. Sealed entries are citeable institutional standards.", color: "border-grey-500/30 bg-grey-800/20" },
  { label: "Monitoring", sublabel: "Retainer", description: "Continuous signal observation. Ongoing advantage for partners.", color: "border-grey-600/20 bg-grey-900/10" },
  { label: "Partner Access", sublabel: "Sealed Layer", description: "Invitation-only. Sealed nodes, citeable verdicts, strategic positioning.", color: "border-grey-700/20 bg-grey-900/10" },
];

export default function InfrastructureDiagram() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: 0.2, duration: 1 }}
      className="mb-16"
    >
      <h2 className="text-xs uppercase tracking-[0.4em] text-grey-400 mb-8 text-center">
        System Architecture — Outcome View
      </h2>

      <div className="max-w-2xl mx-auto space-y-3">
        {layers.map((layer, i) => (
          <motion.div
            key={layer.label}
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 + i * 0.08, duration: 0.6 }}
            className={`glass-card p-5 flex items-center gap-5 border ${layer.color} transition-all duration-300 hover:-translate-y-0.5`}
          >
            <div className="w-10 text-center">
              <span className="text-lg font-light text-grey-600">{String(i + 1).padStart(2, '0')}</span>
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-1">
                <h3 className="text-sm font-medium text-foreground">{layer.label}</h3>
                <span className="text-[8px] uppercase tracking-[0.2em] text-grey-600 px-2 py-0.5 rounded bg-grey-900/50 border border-grey-800/30">
                  {layer.sublabel}
                </span>
              </div>
              <p className="text-grey-500 text-xs">{layer.description}</p>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="text-center mt-8">
        <Link to="/request-verdict">
          <ApexButton variant="outline" size="sm" className="gap-2">
            Request Verdict Brief
            <ArrowRight className="w-3.5 h-3.5" />
          </ApexButton>
        </Link>
      </div>
    </motion.div>
  );
}

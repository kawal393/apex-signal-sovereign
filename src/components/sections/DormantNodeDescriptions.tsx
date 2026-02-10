import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { CircleDot, ArrowRight } from "lucide-react";
import { ApexButton } from "@/components/ui/apex-button";

const dormantDescriptions = [
  {
    name: "Mining & Land Constraint Vault",
    description: "Land access approvals, mining constraint signals, and extraction bottlenecks. High-capital, irreversible decisions where timing determines whether a project proceeds or dies on the regulatory shelf.",
  },
  {
    name: "Water Rights & Allocation Intelligence",
    description: "Allocation and entitlement signals across drought cycles, market shifts, and regulatory rebalancing. Strategic positioning for operators whose water access defines their viability.",
  },
  {
    name: "Carbon & Safeguard Mechanism Watchtower",
    description: "Emissions compliance signals, safeguard mechanism thresholds, and carbon market pressure points. For operators exposed to regulatory tightening that moves faster than their planning cycles.",
  },
  {
    name: "Infrastructure & Transport Approvals Monitor",
    description: "Major project approval pipelines, regulatory gates, and corridor access signals. The difference between a project on schedule and one buried in institutional delay.",
  },
  {
    name: "Government Procurement Signal Board",
    description: "Tender intelligence, procurement patterns, and award signals across federal, state, and local government. For operators who need to see the shape of spending before it becomes public.",
  },
  {
    name: "Film & Media Greenlight Authority",
    description: "Funding approval signals, distribution gates, and production go/no-go intelligence. Where creative ambition meets institutional gatekeeping and capital allocation.",
  },
  {
    name: "Biotech & Advanced Therapeutics Signals",
    description: "Clinical trial progression, regulatory pathway signals, and approval intelligence. For operators whose next move depends on a decision that hasn't been made yet.",
  },
  {
    name: "Critical Minerals & Strategic Supply Chains",
    description: "Policy signals, approval bottlenecks, and demand choke points across strategic supply chains. Where geopolitics meets geology and the margin for error is measured in years.",
  },
];

export default function DormantNodeDescriptions() {
  return (
    <section className="mt-24 mb-16">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
        className="mb-10"
      >
        <div className="flex items-center gap-3 mb-4">
          <CircleDot className="w-4 h-4 text-grey-500" />
          <h2 className="text-xs uppercase tracking-[0.4em] text-grey-400 font-medium">
            Dormant Nodes — What They Will Become
          </h2>
        </div>
        <p className="text-grey-500 text-sm max-w-2xl leading-relaxed">
          Each dormant node represents infrastructure reserved for a domain where operators face
          irreversible decisions under regulatory, capital, or institutional pressure.
          Activation is queued. Early interest is recorded.
        </p>
      </motion.div>

      <div className="grid md:grid-cols-2 gap-5">
        {dormantDescriptions.map((node, i) => (
          <motion.div
            key={node.name}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.06, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="glass-card p-6 border-grey-800/30 hover:border-grey-700/50 transition-all duration-300"
          >
            <div className="flex items-center gap-2 mb-3">
              <span className="w-1.5 h-1.5 rounded-full bg-grey-700" />
              <span className="text-[9px] uppercase tracking-[0.2em] text-grey-600">Dormant · Pulse: Reserved</span>
            </div>
            <h3 className="text-sm font-medium text-grey-300 mb-2">{node.name}</h3>
            <p className="text-grey-500 text-sm leading-relaxed">{node.description}</p>
          </motion.div>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.4 }}
        className="text-center mt-8"
      >
        <Link to="/request-access">
          <ApexButton variant="ghost" size="sm" className="gap-2 text-grey-400">
            Join Unlock List
            <ArrowRight className="w-3.5 h-3.5" />
          </ApexButton>
        </Link>
      </motion.div>
    </section>
  );
}

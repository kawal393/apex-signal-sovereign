import { useParams, Link, Navigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ExternalLink, ArrowLeft, ArrowRight, Check } from "lucide-react";
import ApexNav from "@/components/layout/ApexNav";
import ApexFooter from "@/components/layout/ApexFooter";
import { ApexButton } from "@/components/ui/apex-button";
import MobileVoid from "@/components/effects/MobileVoid";
import { useIsMobile } from "@/hooks/use-mobile";
import { getNodeById } from "@/data/nodes";

/** Verdict CTA monetization block */
const VerdictCTABlock = ({ nodeId }: { nodeId: string }) => {
  const isNdis = nodeId === 'ndis-watchtower';
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className="glass-card p-8 border-primary/20 bg-gradient-to-br from-primary/5 to-transparent"
    >
      <h3 className="text-xl font-medium text-foreground mb-3">
        {isNdis ? "See your provider listed?" : "Seeing signals is not enough."}
      </h3>
      <ul className="space-y-2 mb-6 text-grey-400 text-sm">
        <li className="flex items-start gap-2"><span className="text-primary mt-0.5">•</span>Raw enforcement data is not a decision.</li>
        <li className="flex items-start gap-2"><span className="text-primary mt-0.5">•</span>A Verdict Brief tells you: Advance / Hold / Partner-Only / Drop.</li>
        <li className="flex items-start gap-2"><span className="text-primary mt-0.5">•</span>Includes: Confidence level, 3 structural reasons, next cheapest test, kill rule.</li>
      </ul>
      <p className="text-grey-300 text-sm font-medium mb-6">
        Standard Verdict Brief: from $249 | Delivered within 72 hours
      </p>
      <Link to={`/request-verdict`}>
        <ApexButton variant="primary" size="lg" className="gap-2">
          {isNdis ? "Request NDIS Verdict Brief" : "Request Verdict Brief"}
          <ArrowRight className="w-4 h-4" />
        </ApexButton>
      </Link>
      <p className="text-grey-600 text-xs mt-4">
        Apex Confidence Lock: refund only for structural incompleteness or delivery failure.
      </p>
    </motion.div>
  );
};

const NodeDetail = () => {
  const { nodeId } = useParams<{ nodeId: string }>();
  const isMobile = useIsMobile();
  const node = getNodeById(nodeId || '');

  if (!node) {
    return <Navigate to="/nodes" replace />;
  }

  const isLive = node.status === 'live';
  const isSealed = node.status === 'sealed';

  const getStatusLabel = () => {
    if (isLive) return { text: 'LIVE', class: 'status-active' };
    if (isSealed) return { text: 'SEALED', class: 'status-frozen' };
    return { text: 'DORMANT', class: 'text-[10px] uppercase tracking-[0.3em] text-grey-600 px-3 py-1 rounded-full border border-grey-800 bg-grey-900/50' };
  };

  const status = getStatusLabel();

  return (
    <div className="relative min-h-screen bg-black">
      {isMobile && <MobileVoid />}
      <div className="fixed inset-0 pointer-events-none z-[1]">
        <div className="absolute inset-0 bg-black/80" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,hsl(42_50%_20%/0.08)_0%,transparent_60%)]" />
      </div>

      <ApexNav />

      <main className="relative z-10 pt-32 pb-24 px-6">
        <div className="max-w-3xl mx-auto">
          {/* Back link */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
            <Link to="/nodes" className="inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.3em] text-grey-500 hover:text-grey-300 transition-colors mb-12">
              <ArrowLeft className="w-4 h-4" />
              All Nodes
            </Link>
          </motion.div>

          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
            className="mb-12"
          >
            <span className={status.class}>{status.text}</span>
            <h1 className="text-4xl md:text-5xl font-semibold text-foreground tracking-wide mt-6 mb-4">{node.name}</h1>
            {node.domain && <p className="text-[11px] uppercase tracking-[0.3em] text-grey-500 mb-6">{node.domain}</p>}
            <p className="text-xl text-grey-300 leading-relaxed">{node.purpose}</p>
          </motion.div>

          {isLive && node.whatYouGet && node.whoItsFor ? (
            <>
              {/* Top CTA module for NDIS */}
              {node.id === 'ndis-watchtower' && (
                <div className="mb-12">
                  <VerdictCTABlock nodeId={node.id} />
                </div>
              )}

              {/* Ghost Protocol annotation */}
              {node.id === 'ghost-protocol' && node.description && (
                <motion.section initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 0.8, ease: [0.16, 1, 0.3, 1] }} className="mb-12">
                  <div className="glass-card p-6 border-l-2 border-grey-600">
                    <p className="text-grey-300 text-base leading-relaxed">Ghost Protocol is an operating doctrine: disciplined observation, triage, and escalation.</p>
                    <p className="text-grey-500 text-sm mt-3">No execution. No representation. No impersonation. No deception.</p>
                  </div>
                </motion.section>
              )}

              {/* What You Get */}
              <motion.section initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3, duration: 0.8, ease: [0.16, 1, 0.3, 1] }} className="mb-12">
                <h2 className="text-xs uppercase tracking-[0.4em] text-primary mb-6">What You Get</h2>
                <div className="glass-card p-6">
                  <ul className="space-y-4">
                    {node.whatYouGet.map((item, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <Check className="w-4 h-4 text-primary mt-1 flex-shrink-0" />
                        <span className="text-grey-300">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.section>

              {/* Who It's For */}
              <motion.section initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4, duration: 0.8, ease: [0.16, 1, 0.3, 1] }} className="mb-12">
                <h2 className="text-xs uppercase tracking-[0.4em] text-grey-400 mb-6">Who It's For</h2>
                <div className="glass-card p-6">
                  <ul className="space-y-4">
                    {node.whoItsFor.map((item, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <span className="text-grey-500 mt-1">◆</span>
                        <span className="text-grey-400">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.section>

              {/* Bottom CTA module */}
              <div className="mb-12">
                <VerdictCTABlock nodeId={node.id} />
              </div>

              {/* CTA Buttons */}
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5, duration: 0.8, ease: [0.16, 1, 0.3, 1] }} className="flex flex-col sm:flex-row gap-4">
                <ApexButton variant="primary" size="lg" className="flex-1 gap-2" onClick={(e) => {
                  e.preventDefault();
                  const newWindow = window.open(node.externalUrl, '_blank', 'noopener,noreferrer');
                  if (!newWindow || newWindow.closed || typeof newWindow.closed === 'undefined') { window.location.href = node.externalUrl!; }
                }}>
                  OPEN LIVE TOOL
                  <ExternalLink className="w-4 h-4" />
                </ApexButton>
                <Link to="/request-verdict" className="flex-1">
                  <ApexButton variant="outline" size="lg" className="w-full">REQUEST VERDICT BRIEF</ApexButton>
                </Link>
              </motion.div>
            </>
          ) : isSealed ? (
            <>
              <motion.section initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3, duration: 0.8, ease: [0.16, 1, 0.3, 1] }} className="mb-16">
                <div className="glass-card p-8 border-grey-700/50">
                  <span className="text-[10px] uppercase tracking-[0.3em] text-grey-600 block mb-6">Sealed Node — Monitoring Active</span>
                  <p className="text-grey-400 leading-relaxed mb-8">{node.description || node.purpose}</p>
                  <p className="text-grey-500 text-sm">This node is currently sealed. Submit a request to express interest in access when capacity becomes available.</p>
                </div>
              </motion.section>
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}>
                <Link to="/request-access"><ApexButton variant="outline" size="lg" className="w-full max-w-md mx-auto block">REQUEST ACCESS</ApexButton></Link>
              </motion.div>
            </>
          ) : (
            <>
              <motion.section initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3, duration: 0.8, ease: [0.16, 1, 0.3, 1] }} className="mb-16">
                <div className="glass-card p-8 border-grey-800/30 opacity-70">
                  <span className="text-[10px] uppercase tracking-[0.3em] text-grey-700 block mb-6">Dormant Node — Infrastructure Reserved</span>
                  <p className="text-grey-500 leading-relaxed mb-8">{node.description || node.purpose}</p>
                  <div className="border-t border-grey-800/30 pt-6">
                    <p className="text-grey-600 text-sm mb-4">This infrastructure is intentionally reserved for future activation. Capacity has been allocated; conditions for deployment have not yet been met.</p>
                    <p className="text-grey-700 text-xs">Dormant nodes represent planned expansion into regulated, capital-intensive, or irreversible decision domains.</p>
                  </div>
                </div>
              </motion.section>
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}>
                <Link to="/request-access"><ApexButton variant="ghost" size="lg" className="w-full max-w-md mx-auto block text-grey-500">JOIN UNLOCK LIST</ApexButton></Link>
              </motion.div>
            </>
          )}
        </div>
      </main>

      <ApexFooter />
    </div>
  );
};

export default NodeDetail;

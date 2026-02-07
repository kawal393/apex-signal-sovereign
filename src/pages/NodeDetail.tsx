import { useParams, Link, Navigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ExternalLink, ArrowLeft, Check } from "lucide-react";
import ApexNav from "@/components/layout/ApexNav";
import ApexFooter from "@/components/layout/ApexFooter";
import { ApexButton } from "@/components/ui/apex-button";
import MobileVoid from "@/components/effects/MobileVoid";
import { useIsMobile } from "@/hooks/use-mobile";
import { getNodeById } from "@/data/nodes";

const NodeDetail = () => {
  const { nodeId } = useParams<{ nodeId: string }>();
  const isMobile = useIsMobile();
  const node = getNodeById(nodeId || '');

  if (!node) {
    return <Navigate to="/nodes" replace />;
  }

  const isLive = node.status === 'live';

  return (
    <div className="relative min-h-screen bg-black">
      {/* Background */}
      {isMobile && <MobileVoid />}
      <div className="fixed inset-0 pointer-events-none z-[1]">
        <div className="absolute inset-0 bg-black/80" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,hsl(42_50%_20%/0.08)_0%,transparent_60%)]" />
      </div>

      <ApexNav />

      <main className="relative z-10 pt-32 pb-24 px-6">
        <div className="max-w-3xl mx-auto">
          {/* Back link */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <Link
              to="/nodes"
              className="inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.3em] text-grey-500 hover:text-grey-300 transition-colors mb-12"
            >
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
            <span className={isLive ? "status-active" : "status-frozen"}>
              {isLive ? 'LIVE' : 'SEALED'}
            </span>
            <h1 className="text-4xl md:text-5xl font-semibold text-foreground tracking-wide mt-6 mb-6">
              {node.name}
            </h1>
            <p className="text-xl text-grey-300 leading-relaxed">
              {node.purpose}
            </p>
          </motion.div>

          {isLive && node.whatYouGet && node.whoItsFor ? (
            <>
              {/* What You Get */}
              <motion.section
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                className="mb-12"
              >
                <h2 className="text-xs uppercase tracking-[0.4em] text-primary mb-6">
                  What You Get
                </h2>
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
              <motion.section
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                className="mb-16"
              >
                <h2 className="text-xs uppercase tracking-[0.4em] text-grey-400 mb-6">
                  Who It's For
                </h2>
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

              {/* CTA Buttons */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                className="flex flex-col sm:flex-row gap-4"
              >
                <a
                  href={node.externalUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1"
                >
                  <ApexButton variant="primary" size="lg" className="w-full gap-2">
                    OPEN LIVE TOOL
                    <ExternalLink className="w-4 h-4" />
                  </ApexButton>
                </a>
                <Link to="/request-access" className="flex-1">
                  <ApexButton variant="outline" size="lg" className="w-full">
                    REQUEST VERDICT BRIEF
                  </ApexButton>
                </Link>
              </motion.div>
            </>
          ) : (
            <>
              {/* Sealed Node Content */}
              <motion.section
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                className="mb-16"
              >
                <div className="glass-card p-8 border-grey-700/50">
                  <p className="text-grey-400 leading-relaxed mb-8">
                    {node.description || node.purpose}
                  </p>
                  <p className="text-grey-500 text-sm">
                    This node is currently sealed. Submit a Verdict Brief request to express interest in access when capacity becomes available.
                  </p>
                </div>
              </motion.section>

              {/* CTA Button */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              >
                <Link to="/request-access">
                  <ApexButton variant="outline" size="lg" className="w-full max-w-md mx-auto block">
                    REQUEST VERDICT BRIEF
                  </ApexButton>
                </Link>
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

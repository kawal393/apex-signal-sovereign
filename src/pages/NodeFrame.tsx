import { useParams, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ExternalLink, ArrowLeft, AlertTriangle } from "lucide-react";
import ApexNav from "@/components/layout/ApexNav";
import { ApexButton } from "@/components/ui/apex-button";
import { getNodeById } from "@/data/nodes";

const NodeFrame = () => {
  const { id } = useParams<{ id: string }>();
  const node = getNodeById(id || '');
  const [frameFailed, setFrameFailed] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // GitHub Pages blocks framing via X-Frame-Options — detect timeout
    const timer = setTimeout(() => {
      setFrameFailed(true);
      setLoading(false);
    }, 5000);
    return () => clearTimeout(timer);
  }, []);

  if (!node || !node.externalUrl) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <p className="text-grey-400 mb-4">Node not found or has no external URL.</p>
          <Link to="/nodes"><ApexButton variant="outline">Return to Nodes</ApexButton></Link>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-black flex flex-col">
      <ApexNav />

      {/* Node bar */}
      <div className="fixed top-[72px] left-0 right-0 z-40 bg-black/95 backdrop-blur-xl border-b border-border/20 px-6 py-3">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link to="/nodes" className="text-grey-500 hover:text-grey-300 transition-colors">
              <ArrowLeft className="w-4 h-4" />
            </Link>
            <div>
              <span className="text-[9px] uppercase tracking-[0.2em] text-primary/60">External Node</span>
              <h2 className="text-sm font-medium text-foreground">{node.name}</h2>
            </div>
          </div>
          <a href={node.externalUrl} target="_blank" rel="noopener noreferrer">
            <ApexButton variant="outline" size="sm" className="gap-2 text-xs">
              Open in New Tab
              <ExternalLink className="w-3 h-3" />
            </ApexButton>
          </a>
        </div>
      </div>

      {/* Content area */}
      <div className="flex-1 pt-[120px]">
        {frameFailed ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="flex flex-col items-center justify-center min-h-[60vh] px-6 text-center"
          >
            <AlertTriangle className="w-8 h-8 text-primary/60 mb-6" />
            <h2 className="text-2xl font-medium text-foreground mb-3">External Node Cannot Be Framed</h2>
            <p className="text-grey-400 max-w-md mb-2">
              This node runs on an external domain that restricts embedded viewing for security.
            </p>
            <p className="text-grey-600 text-sm mb-8">
              Open it in a new tab to view the full interface. Your portal session remains active.
            </p>
            <div className="flex items-center gap-4">
              <a href={node.externalUrl} target="_blank" rel="noopener noreferrer">
                <ApexButton variant="primary" size="lg" className="gap-2">
                  Open {node.name}
                  <ExternalLink className="w-4 h-4" />
                </ApexButton>
              </a>
              <Link to="/nodes">
                <ApexButton variant="outline" size="lg" className="gap-2">
                  <ArrowLeft className="w-4 h-4" />
                  Back to Nodes
                </ApexButton>
              </Link>
            </div>
          </motion.div>
        ) : (
          <>
            {loading && (
              <div className="absolute inset-0 pt-[120px] flex items-center justify-center">
                <motion.div
                  animate={{ opacity: [0.3, 1, 0.3] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="text-grey-500 text-sm tracking-wide"
                >
                  Loading external node...
                </motion.div>
              </div>
            )}
            <iframe
              src={node.externalUrl}
              className="w-full h-[calc(100vh-120px)] border-0"
              title={node.name}
              onLoad={() => { setLoading(false); setFrameFailed(false); }}
              onError={() => setFrameFailed(true)}
            />
          </>
        )}
      </div>
    </div>
  );
};

export default NodeFrame;

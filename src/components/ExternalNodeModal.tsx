import { motion, AnimatePresence } from "framer-motion";
import { ExternalLink, X } from "lucide-react";
import { ApexButton } from "@/components/ui/apex-button";

interface ExternalNodeModalProps {
  isOpen: boolean;
  nodeName: string;
  url: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function ExternalNodeModal({ isOpen, nodeName, url, onConfirm, onCancel }: ExternalNodeModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-sm px-6"
          onClick={onCancel}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="glass-card p-8 max-w-md w-full text-center border-primary/20"
            onClick={(e) => e.stopPropagation()}
          >
            <motion.span
              className="text-primary text-2xl block mb-4"
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              ◆
            </motion.span>

            <h3 className="text-lg font-medium text-foreground mb-2">
              Crossing into External Node
            </h3>
            <p className="text-grey-400 text-base mb-1">{nodeName}</p>
            <p className="text-grey-600 text-base mb-6">
              Return to Portal anytime. Your session remains active.
            </p>

            <div className="flex items-center justify-center gap-3">
              <ApexButton variant="primary" size="sm" className="gap-2" onClick={onConfirm}>
                Open Node
                <ExternalLink className="w-3.5 h-3.5" />
              </ApexButton>
              <ApexButton variant="ghost" size="sm" onClick={onCancel}>
                Cancel
              </ApexButton>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

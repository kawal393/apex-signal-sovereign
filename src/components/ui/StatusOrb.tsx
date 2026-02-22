import { forwardRef, useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useApexSystem } from "@/contexts/ApexSystemContext";

// Tier configuration
const TIER_CONFIG = {
  observer: {
    label: 'Observer',
    color: 'hsl(0, 0%, 75%)', // Silver
    borderColor: 'border-silver-mid/30',
    bgColor: 'bg-silver-mid/5',
    textColor: 'text-silver-light',
    sigil: '◇',
  },
  acknowledged: {
    label: 'Acknowledged',
    color: 'hsl(42, 95%, 55%)', // Gold
    borderColor: 'border-primary/30',
    bgColor: 'bg-primary/5',
    textColor: 'text-primary',
    sigil: '◈',
  },
  considered: {
    label: 'Inner Circle',
    color: 'hsl(0, 72%, 50%)', // Crimson
    borderColor: 'border-crimson-bright/30',
    bgColor: 'bg-crimson-bright/5',
    textColor: 'text-crimson-bright',
    sigil: '◆',
  },
};

// Thresholds for progression
const THRESHOLDS = {
  ACKNOWLEDGED: { patience_score: 0.6, curiosity_score: 0.5, total_time_seconds: 180 },
  INNER_CIRCLE: { patience_score: 0.8, curiosity_score: 0.7, total_time_seconds: 600 },
};

interface StatusOrbProps {
  className?: string;
}

const StatusOrb = forwardRef<HTMLDivElement, StatusOrbProps>(
  ({ className = '' }, ref) => {
    const { 
      status, 
      patienceScore, 
      curiosityScore, 
      isInitialized,
    } = useApexSystem();
    
    const [isExpanded, setIsExpanded] = useState(false);
    const [showProgress, setShowProgress] = useState(false);

    // Get tier config
    const tier = TIER_CONFIG[status] || TIER_CONFIG.observer;

    // Calculate progress to next tier
    const progressData = useMemo(() => {
      if (status === 'considered') {
        return { progress: 100, nextTier: null, timeRemaining: null };
      }

      const target = status === 'observer' ? THRESHOLDS.ACKNOWLEDGED : THRESHOLDS.INNER_CIRCLE;
      
      // Calculate individual progress components
      const patienceProgress = Math.min(1, patienceScore / target.patience_score);
      const curiosityProgress = Math.min(1, curiosityScore / target.curiosity_score);
      
      // Weighted average
      const overall = (patienceProgress * 0.4 + curiosityProgress * 0.4 + 0.2) * 100;
      
      return {
        progress: Math.min(99, Math.round(overall)),
        nextTier: status === 'observer' ? 'Acknowledged' : 'Inner Circle',
        timeRemaining: null,
      };
    }, [status, patienceScore, curiosityScore]);

    // Show progress indicator after initial expansion
    useEffect(() => {
      if (isExpanded) {
        const timer = setTimeout(() => setShowProgress(true), 300);
        return () => clearTimeout(timer);
      } else {
        setShowProgress(false);
      }
    }, [isExpanded]);

    if (!isInitialized) return null;

    return (
      <motion.div
        ref={ref}
        className={`fixed bottom-8 left-8 z-40 ${className}`}
        initial={{ opacity: 0, scale: 0.8, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ delay: 2, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      >
        <motion.button
          onClick={() => setIsExpanded(!isExpanded)}
          className={`relative rounded-full transition-all duration-700 ${tier.borderColor} ${tier.bgColor} border backdrop-blur-xl`}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.98 }}
          animate={{
            width: isExpanded ? 200 : 56,
            height: isExpanded ? 'auto' : 56,
            borderRadius: isExpanded ? 12 : 28,
          }}
          style={{
            boxShadow: `0 0 40px ${tier.color.replace(')', ' / 0.15)')}`,
          }}
        >
          <AnimatePresence mode="wait">
            {!isExpanded ? (
              // Collapsed state - just the sigil
              <motion.div
                key="collapsed"
                className="w-14 h-14 flex items-center justify-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <motion.span
                  className={`text-2xl ${tier.textColor}`}
                  animate={{ 
                    scale: [1, 1.15, 1],
                    opacity: [0.6, 1, 0.6],
                  }}
                  transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                >
                  {tier.sigil}
                </motion.span>
              </motion.div>
            ) : (
              // Expanded state - full info
              <motion.div
                key="expanded"
                className="p-4 text-left"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ delay: 0.1 }}
              >
                {/* Tier label */}
                <div className="flex items-center gap-2 mb-3">
                  <span className={`text-lg ${tier.textColor}`}>{tier.sigil}</span>
                  <span className={`text-base uppercase tracking-[0.2em] ${tier.textColor} font-medium`}>
                    {tier.label}
                  </span>
                </div>

                {/* Patience bar */}
                <div className="mb-2">
                  <div className="flex justify-between text-[9px] mb-1">
                    <span className="text-grey-300 uppercase tracking-wider">Patience</span>
                    <span className="text-silver-light">{Math.round(patienceScore * 100)}%</span>
                  </div>
                  <div className="h-1 bg-grey-800 rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-gradient-to-r from-silver-dark to-silver-light rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: showProgress ? `${patienceScore * 100}%` : 0 }}
                      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                    />
                  </div>
                </div>

                {/* Curiosity bar */}
                <div className="mb-3">
                  <div className="flex justify-between text-[9px] mb-1">
                    <span className="text-grey-300 uppercase tracking-wider">Curiosity</span>
                    <span className="text-primary">{Math.round(curiosityScore * 100)}%</span>
                  </div>
                  <div className="h-1 bg-grey-800 rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-gradient-to-r from-gold-deep to-primary rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: showProgress ? `${curiosityScore * 100}%` : 0 }}
                      transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
                    />
                  </div>
                </div>

                {/* Progress to next tier */}
                {progressData.nextTier && (
                  <div className="pt-2 border-t border-grey-800/50">
                    <div className="text-[8px] uppercase tracking-[0.2em] text-grey-600 text-center mb-1">
                      Progress to {progressData.nextTier}
                    </div>
                    <div className="text-center">
                      <span className="text-lg font-light text-grey-300">{progressData.progress}%</span>
                    </div>
                  </div>
                )}

                {status === 'considered' && (
                  <div className="pt-2 border-t border-grey-800/50 text-center">
                    <span className="text-[9px] uppercase tracking-[0.2em] text-crimson-bright">
                      Maximum Access
                    </span>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.button>
      </motion.div>
    );
  }
);

StatusOrb.displayName = 'StatusOrb';

export default StatusOrb;

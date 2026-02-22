import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { ApexButton } from "@/components/ui/apex-button";
import { useApexSystem } from "@/contexts/ApexSystemContext";
import { supabase } from "@/integrations/supabase/client";
import { behaviorEngine } from "@/lib/behaviorEngine";

type AccessPhase = 'initial' | 'form' | 'submitting' | 'submitted' | 'restricted';

export default function AccessRequest() {
  const [phase, setPhase] = useState<AccessPhase>('initial');
  const [intent, setIntent] = useState('');
  const { 
    isDelayed, 
    delayRemaining, 
    warning, 
    isRestricted, 
    patienceScore,
    status 
  } = useApexSystem();

  // Check if restricted
  useEffect(() => {
    if (isRestricted && phase !== 'submitted') {
      setPhase('restricted');
    } else if (!isRestricted && phase === 'restricted') {
      setPhase('initial');
    }
  }, [isRestricted, phase]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (intent.trim().length < 30 || isDelayed) return;
    
    setPhase('submitting');
    
    try {
      const metrics = behaviorEngine.getMetrics();
      const visitorId = behaviorEngine.getVisitorId();
      
      await supabase.from('access_requests').insert({
        visitor_id: visitorId,
        intent: intent.trim(),
        behavioral_data: {
          scrollDepth: metrics.deepestScrollDepth,
          nodesExplored: metrics.nodesExplored,
          timeSpent: metrics.totalTimeSpent,
          avgClickInterval: metrics.avgClickInterval,
        },
        patience_score_at_request: metrics.patienceScore,
        time_spent_before_request: Math.floor(metrics.totalTimeSpent / 1000),
        scroll_depth_at_request: metrics.deepestScrollDepth,
      });
      
      setPhase('submitted');
    } catch (error) {
      console.error('Failed to submit access request', error);
      setPhase('form');
    }
  };

  const handleRequestClick = () => {
    if (isDelayed) return;
    setPhase('form');
  };

  return (
    <section className="px-6 py-32 md:py-40 relative overflow-hidden">
      {/* Background energy */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <motion.div 
          className="w-[600px] h-[600px] rounded-full"
          style={{
            background: 'radial-gradient(circle, hsl(42 90% 55% / 0.03) 0%, transparent 60%)',
          }}
          animate={{ 
            opacity: [0.3, 0.6, 0.3],
            scale: [0.95, 1.05, 0.95],
          }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      {/* Warning overlay */}
      <AnimatePresence>
        {warning && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 bg-black/90 border border-primary/30 px-8 py-6 rounded-md text-center"
          >
            <p className="text-[11px] tracking-[0.3em] uppercase text-primary/80">
              {warning}
            </p>
            {delayRemaining > 0 && (
              <p className="text-[9px] tracking-[0.2em] uppercase text-muted-foreground/50 mt-3">
                {Math.ceil(delayRemaining / 1000)}s
              </p>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="max-w-2xl mx-auto text-center relative z-10">
        <AnimatePresence mode="wait">
          {/* Restricted state */}
          {phase === 'restricted' && (
            <motion.div
              key="restricted"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="py-12"
            >
              <p className="text-[11px] tracking-[0.4em] uppercase text-muted-foreground/40 mb-4">
                Access Temporarily Restricted
              </p>
              <p className="text-[10px] text-muted-foreground/30 max-w-md mx-auto">
                The system has noted patterns inconsistent with considered entry.
                Demonstrate stillness to continue.
              </p>
            </motion.div>
          )}

          {/* Initial state */}
          {phase === 'initial' && (
            <motion.div
              key="initial"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.8 }}
            >
              <span className="text-[10px] uppercase tracking-[0.5em] text-muted-foreground/40 mb-8 block font-medium">
                Access Protocol
              </span>

              <h2 className="text-3xl md:text-4xl lg:text-5xl font-extralight text-foreground tracking-wide mb-6">
                Request <span className="text-gradient-gold font-medium">Access</span>
              </h2>

              <p className="text-base text-muted-foreground/50 mb-6 max-w-lg mx-auto font-light leading-relaxed">
                Entry is not purchased. It is requested. Your intent will be evaluated.
              </p>

              {/* Show patience score subtly */}
              {patienceScore > 0.6 && (
                <motion.p
                  className="text-[9px] tracking-[0.3em] uppercase text-primary/40 mb-8"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                >
                  Your patience has been noted
                </motion.p>
              )}

              <motion.div
                whileHover={!isDelayed ? { scale: 1.03, y: -4 } : {}}
                whileTap={!isDelayed ? { scale: 0.98 } : {}}
                style={{ opacity: isDelayed ? 0.5 : 1 }}
              >
                <ApexButton 
                  variant="primary" 
                  size="lg"
                  onClick={handleRequestClick}
                  disabled={isDelayed}
                  className="min-w-[200px] tracking-[0.25em]"
                  style={{
                    boxShadow: isDelayed ? 'none' : '0 0 50px hsl(42 90% 55% / 0.15)',
                  }}
                >
                  {isDelayed ? `Wait ${Math.ceil(delayRemaining / 1000)}s` : 'Request Access'}
                </ApexButton>
              </motion.div>
            </motion.div>
          )}

          {/* Form state */}
          {phase === 'form' && (
            <motion.div
              key="form"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.8 }}
            >
              <span className="text-[10px] uppercase tracking-[0.5em] text-primary/60 mb-8 block font-medium">
                State Your Intent
              </span>

              <form onSubmit={handleSubmit} className="space-y-8">
                <div className="text-left">
                  <label className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground/50 mb-3 block">
                    Why do you seek access to APEX?
                  </label>
                  <textarea
                    value={intent}
                    onChange={(e) => setIntent(e.target.value)}
                    placeholder="What signal do you seek? What would you do with verified intelligence? Be specific about your purpose."
                    className="w-full h-44 bg-[hsl(260,18%,3%)] border border-border/15 rounded-md p-4 text-foreground/80 text-base placeholder:text-muted-foreground/25 focus:border-primary/30 focus:outline-none focus:ring-1 focus:ring-primary/20 transition-all duration-500 resize-none"
                  />
                  <div className="flex justify-between mt-2">
                    <p className="text-[9px] text-muted-foreground/30 tracking-wide">
                      {intent.length < 30 
                        ? `Minimum 30 characters required (${30 - intent.length} more)` 
                        : "Clarity is valued"
                      }
                    </p>
                    <p className="text-[9px] text-muted-foreground/20">
                      {intent.length}/500
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-center gap-4">
                  <motion.button
                    type="button"
                    onClick={() => setPhase('initial')}
                    className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground/40 hover:text-muted-foreground/60 transition-colors px-6 py-3"
                    whileHover={{ x: -3 }}
                  >
                    ← Back
                  </motion.button>

                  <motion.div
                    whileHover={intent.length >= 30 ? { scale: 1.03, y: -3 } : {}}
                    whileTap={{ scale: 0.98 }}
                  >
                    <ApexButton 
                      type="submit"
                      variant="primary" 
                      size="default"
                      disabled={intent.trim().length < 30}
                      className="tracking-[0.2em]"
                      style={{
                        opacity: intent.length >= 30 ? 1 : 0.4,
                      }}
                    >
                      Submit Request
                    </ApexButton>
                  </motion.div>
                </div>
              </form>
            </motion.div>
          )}

          {/* Submitting state */}
          {phase === 'submitting' && (
            <motion.div
              key="submitting"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="py-16"
            >
              <motion.div
                className="w-8 h-8 border border-primary/30 border-t-primary rounded-full mx-auto"
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              />
              <p className="text-[10px] tracking-[0.3em] uppercase text-muted-foreground/40 mt-6">
                Transmitting...
              </p>
            </motion.div>
          )}

          {/* Submitted state */}
          {phase === 'submitted' && (
            <motion.div
              key="submitted"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
              className="py-12"
            >
              <motion.div
                animate={{
                  boxShadow: [
                    '0 0 30px hsl(42 90% 55% / 0.2)',
                    '0 0 60px hsl(42 90% 55% / 0.3)',
                    '0 0 30px hsl(42 90% 55% / 0.2)',
                  ],
                }}
                transition={{ duration: 3, repeat: Infinity }}
                className="w-16 h-16 mx-auto mb-8 flex items-center justify-center"
              >
                <span className="text-3xl text-primary">◆</span>
              </motion.div>

              <h3 className="text-2xl font-extralight text-foreground mb-4 tracking-wide">
                Request Received
              </h3>

              <p className="text-base text-muted-foreground/50 max-w-md mx-auto leading-relaxed mb-6">
                Your intent has been recorded. Evaluation is not instant.
                The system will determine access based on demonstrated purpose.
              </p>

              {status === 'considered' && (
                <motion.p
                  className="text-[10px] uppercase tracking-[0.3em] text-primary/50"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1 }}
                >
                  Status: Under active consideration
                </motion.p>
              )}

              <motion.p
                className="text-[9px] uppercase tracking-[0.2em] text-muted-foreground/30 mt-4"
                animate={{ opacity: [0.3, 0.6, 0.3] }}
                transition={{ duration: 4, repeat: Infinity }}
              >
                The system observes
              </motion.p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { ApexButton } from "@/components/ui/apex-button";

type AccessPhase = 'initial' | 'form' | 'submitted';

export default function AccessRequest() {
  const [phase, setPhase] = useState<AccessPhase>('initial');
  const [intent, setIntent] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (intent.trim().length > 20) {
      setPhase('submitted');
    }
  };

  return (
    <section className="px-6 py-32 md:py-40 relative overflow-hidden">
      {/* Background energy */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <motion.div 
          className="w-[600px] h-[600px] rounded-full"
          style={{
            background: 'radial-gradient(circle, hsl(42 90% 55% / 0.04) 0%, transparent 60%)',
          }}
          animate={{ 
            opacity: [0.3, 0.6, 0.3],
            scale: [0.95, 1.05, 0.95],
          }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      <div className="max-w-2xl mx-auto text-center relative z-10">
        <AnimatePresence mode="wait">
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

              <p className="text-base text-muted-foreground/50 mb-12 max-w-lg mx-auto font-light leading-relaxed">
                Entry is not purchased. It is requested. State your intent. 
                Your request will be evaluated.
              </p>

              <motion.div
                whileHover={{ scale: 1.03, y: -4 }}
                whileTap={{ scale: 0.98 }}
              >
                <ApexButton 
                  variant="primary" 
                  size="lg"
                  onClick={() => setPhase('form')}
                  className="min-w-[200px] tracking-[0.25em]"
                  style={{
                    boxShadow: '0 0 50px hsl(42 90% 55% / 0.15)',
                  }}
                >
                  Request Access
                </ApexButton>
              </motion.div>
            </motion.div>
          )}

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
                    placeholder="What would you do with verified signal? What do you seek?"
                    className="w-full h-40 bg-[hsl(260,18%,4%)] border border-border/20 rounded-md p-4 text-foreground/80 text-sm placeholder:text-muted-foreground/30 focus:border-primary/30 focus:outline-none focus:ring-1 focus:ring-primary/20 transition-all duration-500 resize-none"
                  />
                  <p className="text-[9px] text-muted-foreground/30 mt-2 tracking-wide">
                    Minimum 20 characters. Clarity is valued.
                  </p>
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
                    whileHover={{ scale: intent.length > 20 ? 1.03 : 1, y: intent.length > 20 ? -3 : 0 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <ApexButton 
                      type="submit"
                      variant="primary" 
                      size="default"
                      disabled={intent.trim().length < 20}
                      className="tracking-[0.2em]"
                      style={{
                        opacity: intent.length > 20 ? 1 : 0.5,
                      }}
                    >
                      Submit Request
                    </ApexButton>
                  </motion.div>
                </div>
              </form>
            </motion.div>
          )}

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

              <p className="text-sm text-muted-foreground/50 max-w-md mx-auto leading-relaxed">
                Your intent has been noted. You will be contacted if access is granted.
                The system observes. Decisions are not instant.
              </p>

              <motion.p
                className="text-[10px] uppercase tracking-[0.3em] text-primary/40 mt-8"
                animate={{ opacity: [0.3, 0.6, 0.3] }}
                transition={{ duration: 4, repeat: Infinity }}
              >
                Under consideration
              </motion.p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Bottom sigil */}
      <motion.div 
        className="absolute bottom-12 left-1/2 -translate-x-1/2"
        animate={{ opacity: [0.15, 0.3, 0.15] }}
        transition={{ duration: 8, repeat: Infinity }}
      >
        <div className="w-8 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
      </motion.div>
    </section>
  );
}

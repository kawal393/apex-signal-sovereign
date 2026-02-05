import { motion, AnimatePresence } from "framer-motion";
import { useStillness } from "@/hooks/useStillness";
import { usePresence } from "@/hooks/usePresence";
import { useState, useEffect } from "react";

interface EntryRitualProps {
  onComplete: () => void;
}

type RitualPhase = 'void' | 'stillness' | 'presence' | 'reveal';

export default function EntryRitual({ onComplete }: EntryRitualProps) {
  const [phase, setPhase] = useState<RitualPhase>('void');
  const { isStill, stillnessProgress } = useStillness({ requiredStillnessMs: 3500 });
  const presence = usePresence();

  // Phase progression
  useEffect(() => {
    if (phase === 'void') {
      // Brief moment in complete void
      const timer = setTimeout(() => setPhase('stillness'), 800);
      return () => clearTimeout(timer);
    }
  }, [phase]);

  useEffect(() => {
    if (phase === 'stillness' && isStill) {
      setPhase('presence');
    }
  }, [phase, isStill]);

  useEffect(() => {
    if (phase === 'presence') {
      // Show presence message, then reveal
      const timer = setTimeout(() => setPhase('reveal'), 2500);
      return () => clearTimeout(timer);
    }
  }, [phase]);

  useEffect(() => {
    if (phase === 'reveal') {
      const timer = setTimeout(onComplete, 1500);
      return () => clearTimeout(timer);
    }
  }, [phase, onComplete]);

  return (
    <motion.div 
      className="fixed inset-0 z-50 bg-black flex items-center justify-center"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
    >
      <AnimatePresence mode="wait">
        {/* Stillness Phase - waiting for stillness */}
        {phase === 'stillness' && (
          <motion.div
            key="stillness"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            {/* Stillness indicator - subtle golden point */}
            <motion.div
              className="w-2 h-2 rounded-full mx-auto mb-8"
              style={{
                background: `hsl(42 90% 55% / ${0.2 + stillnessProgress * 0.6})`,
                boxShadow: `0 0 ${20 + stillnessProgress * 40}px hsl(42 90% 55% / ${stillnessProgress * 0.4})`,
              }}
              animate={{
                scale: [1, 1.2, 1],
              }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            />
            
            <motion.p
              className="text-[11px] tracking-[0.4em] uppercase text-muted-foreground/40"
              initial={{ opacity: 0 }}
              animate={{ opacity: stillnessProgress < 0.3 ? 0.6 : 0.3 }}
              transition={{ duration: 1 }}
            >
              {stillnessProgress < 0.3 ? "Be still" : "..."}
            </motion.p>
          </motion.div>
        )}

        {/* Presence Phase - acknowledging arrival */}
        {phase === 'presence' && (
          <motion.div
            key="presence"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            className="text-center"
          >
            <motion.p
              className="text-[11px] tracking-[0.35em] uppercase text-muted-foreground/60 mb-3"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.8 }}
            >
              {presence.isReturning ? (
                <>You have returned</>
              ) : (
                <>Arriving from {presence.city}</>
              )}
            </motion.p>
            
            <motion.p
              className="text-[10px] tracking-[0.3em] uppercase text-muted-foreground/40"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8, duration: 0.8 }}
            >
              {presence.time} local time
            </motion.p>

            {presence.isReturning && presence.visitCount > 2 && (
              <motion.p
                className="text-[9px] tracking-[0.25em] uppercase text-primary/40 mt-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.3, duration: 0.8 }}
              >
                Visit {presence.visitCount}
              </motion.p>
            )}
          </motion.div>
        )}

        {/* Reveal Phase - golden emergence */}
        {phase === 'reveal' && (
          <motion.div
            key="reveal"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.1 }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
            className="relative"
          >
            {/* Golden sigil */}
            <motion.div
              className="w-16 h-16 flex items-center justify-center"
              animate={{
                boxShadow: [
                  '0 0 30px hsl(42 90% 55% / 0.2)',
                  '0 0 80px hsl(42 90% 55% / 0.4)',
                  '0 0 30px hsl(42 90% 55% / 0.2)',
                ],
              }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <span className="text-3xl text-primary">◆</span>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Subtle vignette */}
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_center,transparent_0%,black_100%)]" />
    </motion.div>
  );
}

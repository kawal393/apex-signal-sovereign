import { motion, AnimatePresence } from "framer-motion";
import { useStillness } from "@/hooks/useStillness";
import { usePresence } from "@/hooks/usePresence";
import { useApexSystem } from "@/contexts/ApexSystemContext";
import { useState, useEffect, useCallback, forwardRef } from "react";

interface EntryRitualProps {
  onComplete: () => void;
}

type RitualPhase = 'void' | 'stillness' | 'presence' | 'audio_offer' | 'reveal';

const EntryRitual = forwardRef<HTMLDivElement, EntryRitualProps>(function EntryRitual(
  { onComplete },
  ref
) {
  const [phase, setPhase] = useState<RitualPhase>('void');
  const { isStill, stillnessProgress } = useStillness({ requiredStillnessMs: 4000 });
  const presence = usePresence();
  const { enableAudio, isReturningVisitor, returnCount, status } = useApexSystem();
  const [audioAccepted, setAudioAccepted] = useState(false);
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const interval = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  // Phase progression
  useEffect(() => {
    if (phase === 'void') {
      const timer = setTimeout(() => setPhase('stillness'), 1000);
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
      const timer = setTimeout(() => setPhase('audio_offer'), 2800);
      return () => clearTimeout(timer);
    }
  }, [phase]);

  useEffect(() => {
    if (phase === 'reveal') {
      const timer = setTimeout(onComplete, 1800);
      return () => clearTimeout(timer);
    }
  }, [phase, onComplete]);

  const handleAudioChoice = useCallback(async (accept: boolean) => {
    if (accept) {
      await enableAudio();
      setAudioAccepted(true);
    }
    setPhase('reveal');
  }, [enableAudio]);

  // Skip directly to reveal for patient returning visitors
  useEffect(() => {
    if (isReturningVisitor && returnCount > 2 && phase === 'stillness' && stillnessProgress > 0.3) {
      setPhase('presence');
    }
  }, [isReturningVisitor, returnCount, phase, stillnessProgress]);

  return (
    <motion.div 
      ref={ref}
      className="fixed inset-0 z-50 bg-black flex items-center justify-center"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 2, ease: [0.16, 1, 0.3, 1] }}
    >
      <AnimatePresence mode="wait">
        {/* Stillness Phase */}
        {phase === 'stillness' && (
          <motion.div
            key="stillness"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1 }}
            className="text-center"
          >
            {/* Stillness progress indicator */}
            <motion.div
              className="relative w-20 h-20 mx-auto mb-10"
            >
              {/* Outer ring - progress */}
              <svg className="w-full h-full -rotate-90">
                <circle
                  cx="40"
                  cy="40"
                  r="36"
                  fill="none"
                  stroke="hsl(42 90% 55% / 0.1)"
                  strokeWidth="1"
                />
                <motion.circle
                  cx="40"
                  cy="40"
                  r="36"
                  fill="none"
                  stroke="hsl(42 90% 55% / 0.6)"
                  strokeWidth="1"
                  strokeDasharray={`${stillnessProgress * 226} 226`}
                  strokeLinecap="round"
                />
              </svg>
              
              {/* Inner glow point */}
              <motion.div
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-primary"
                style={{
                  boxShadow: `0 0 ${10 + stillnessProgress * 30}px hsl(42 90% 55% / ${0.3 + stillnessProgress * 0.4})`,
                }}
                animate={{
                  scale: [1, 1.2, 1],
                }}
                transition={{ duration: 2, repeat: Infinity }}
              />
            </motion.div>
            
            <motion.p
              className="text-[11px] tracking-[0.5em] uppercase text-muted-foreground/40"
              animate={{ opacity: [0.3, 0.6, 0.3] }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              {stillnessProgress < 0.5 ? "Be still" : "Almost there"}
            </motion.p>
          </motion.div>
        )}
          
        {/* Presence Phase */}
        {phase === 'presence' && (
          <motion.div
            key="presence"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -24 }}
            transition={{ duration: 2.2, ease: [0.16, 1, 0.3, 1] }}
            className="text-center px-6"
          >
            {/* Location + precise datetime */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4, duration: 2.4, ease: [0.16, 1, 0.3, 1] }}
              className="mb-10"
            >
              <div className="flex flex-wrap items-center justify-center gap-4 text-muted-foreground/45">
                <span className="text-[10px] md:text-[11px] uppercase tracking-[0.6em]">
                  {presence.city}
                </span>
                <span className="w-1 h-1 rounded-full bg-muted-foreground/30" />
                <span className="text-[10px] md:text-[11px] uppercase tracking-[0.6em] tabular-nums">
                  {now.toLocaleDateString(undefined, {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </span>
                <span className="w-1 h-1 rounded-full bg-muted-foreground/30" />
                <span className="text-[10px] md:text-[11px] uppercase tracking-[0.6em] tabular-nums">
                  {now.toLocaleTimeString(undefined, {
                    hour: '2-digit',
                    minute: '2-digit',
                    second: '2-digit',
                    hour12: false,
                  })}
                </span>
              </div>
            </motion.div>

            {isReturningVisitor ? (
              <>
                <motion.p
                  className="text-4xl md:text-6xl lg:text-7xl font-extralight tracking-[0.08em] text-primary/80 mb-6"
                  initial={{ opacity: 0, y: 18 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7, duration: 2.8, ease: [0.16, 1, 0.3, 1] }}
                >
                  You have returned
                </motion.p>

                <motion.p
                  className="text-sm md:text-base uppercase tracking-[0.8em] text-muted-foreground/55"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1.4, duration: 2.4, ease: [0.16, 1, 0.3, 1] }}
                >
                  Visit № {returnCount}
                </motion.p>

                {status === 'considered' && (
                  <motion.p
                    className="text-[10px] uppercase tracking-[0.6em] text-primary/50 mt-8"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 2.1, duration: 2, ease: [0.16, 1, 0.3, 1] }}
                  >
                    Status: Under consideration
                  </motion.p>
                )}
              </>
            ) : (
              <>
                <motion.p
                  className="text-3xl md:text-5xl lg:text-6xl font-extralight tracking-[0.08em] text-muted-foreground/70 mb-6"
                  initial={{ opacity: 0, y: 18 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7, duration: 2.8, ease: [0.16, 1, 0.3, 1] }}
                >
                  Arriving
                </motion.p>

                <motion.p
                  className="text-sm md:text-base uppercase tracking-[0.8em] text-muted-foreground/55"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1.4, duration: 2.4, ease: [0.16, 1, 0.3, 1] }}
                >
                  The system observes
                </motion.p>
              </>
            )}
          </motion.div>
        )}

        {/* Audio Offer Phase */}
        {phase === 'audio_offer' && (
          <motion.div
            key="audio"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1 }}
            className="text-center"
          >
            <motion.p
              className="text-[10px] tracking-[0.4em] uppercase text-muted-foreground/50 mb-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              Enable presence audio?
            </motion.p>
            
            <div className="flex items-center justify-center gap-6">
              <motion.button
                onClick={() => handleAudioChoice(true)}
                className="text-[10px] tracking-[0.3em] uppercase text-primary/70 hover:text-primary px-4 py-2 border border-primary/20 hover:border-primary/40 transition-all duration-500"
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
              >
                Yes
              </motion.button>
              
              <motion.button
                onClick={() => handleAudioChoice(false)}
                className="text-[10px] tracking-[0.3em] uppercase text-muted-foreground/40 hover:text-muted-foreground/60 px-4 py-2 transition-all duration-500"
                whileHover={{ y: -1 }}
              >
                No
              </motion.button>
            </div>
          </motion.div>
        )}

        {/* Reveal Phase */}
        {phase === 'reveal' && (
          <motion.div
            key="reveal"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.1 }}
            transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
          >
            <motion.div
              className="w-20 h-20 flex items-center justify-center"
              animate={{
                boxShadow: [
                  '0 0 40px hsl(42 90% 55% / 0.2)',
                  '0 0 80px hsl(42 90% 55% / 0.4)',
                  '0 0 40px hsl(42 90% 55% / 0.2)',
                ],
              }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <span className="text-4xl text-primary">◆</span>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Subtle vignette */}
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_center,transparent_0%,black_100%)]" />
    </motion.div>
  );
});

export default EntryRitual;

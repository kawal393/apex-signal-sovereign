import { motion, AnimatePresence } from "framer-motion";
import { useStillness } from "@/hooks/useStillness";
import { usePresence } from "@/hooks/usePresence";
import { useApexSystem } from "@/contexts/ApexSystemContext";
import { useState, useEffect, useCallback } from "react";

interface EntryRitualProps {
  onComplete: () => void;
}

type RitualPhase = 'void' | 'stillness' | 'presence' | 'audio_offer' | 'reveal';

export default function EntryRitual({ onComplete }: EntryRitualProps) {
  const [phase, setPhase] = useState<RitualPhase>('void');
  const { isStill, stillnessProgress } = useStillness({ requiredStillnessMs: 6500 });
  const presence = usePresence();
  const { enableAudio, isReturningVisitor, returnCount, status } = useApexSystem();
  const [audioAccepted, setAudioAccepted] = useState(false);
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const interval = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  // Phase progression - ULTRA SLOW
  useEffect(() => {
    if (phase === 'void') {
      const timer = setTimeout(() => setPhase('stillness'), 2500);
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
      const timer = setTimeout(() => setPhase('audio_offer'), 7500);
      return () => clearTimeout(timer);
    }
  }, [phase]);

  useEffect(() => {
    if (phase === 'reveal') {
      const timer = setTimeout(onComplete, 5000);
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
    if (isReturningVisitor && returnCount > 3 && phase === 'stillness' && stillnessProgress > 0.7) {
      setPhase('presence');
    }
  }, [isReturningVisitor, returnCount, phase, stillnessProgress]);

  return (
    <motion.div 
      className="fixed inset-0 z-50 bg-black flex items-center justify-center"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 4.5, ease: [0.16, 1, 0.3, 1] }}
    >
      <AnimatePresence mode="wait">
        {/* Stillness Phase */}
        {phase === 'stillness' && (
          <motion.div
            key="stillness"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 3, ease: [0.16, 1, 0.3, 1] }}
            className="text-center"
          >
            {/* Stillness progress indicator */}
            <motion.div
              className="relative w-32 h-32 mx-auto mb-16"
            >
              {/* Outer ring - progress */}
              <svg className="w-full h-full -rotate-90">
                <circle
                  cx="64"
                  cy="64"
                  r="58"
                  fill="none"
                  stroke="hsl(42 90% 55% / 0.06)"
                  strokeWidth="1"
                />
                <motion.circle
                  cx="64"
                  cy="64"
                  r="58"
                  fill="none"
                  stroke="hsl(42 90% 55% / 0.45)"
                  strokeWidth="1"
                  strokeDasharray={`${stillnessProgress * 364} 364`}
                  strokeLinecap="round"
                />
              </svg>
              
              {/* Inner glow point */}
              <motion.div
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-primary"
                style={{
                  boxShadow: `0 0 ${20 + stillnessProgress * 60}px hsl(42 90% 55% / ${0.15 + stillnessProgress * 0.5})`,
                }}
                animate={{
                  scale: [1, 1.4, 1],
                }}
                transition={{ duration: 5, repeat: Infinity, ease: [0.16, 1, 0.3, 1] }}
              />
            </motion.div>
            
            <motion.p
              className="text-sm tracking-[0.7em] uppercase text-muted-foreground/25"
              animate={{ opacity: [0.15, 0.4, 0.15] }}
              transition={{ duration: 6, repeat: Infinity, ease: [0.16, 1, 0.3, 1] }}
            >
              {stillnessProgress < 0.5 ? "Be still" : "Almost there"}
            </motion.p>
          </motion.div>
        )}
          
        {/* Presence Phase - MASSIVE TYPOGRAPHY */}
        {phase === 'presence' && (
          <motion.div
            key="presence"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            transition={{ duration: 5, ease: [0.16, 1, 0.3, 1] }}
            className="text-center px-6 max-w-7xl"
          >
            {/* Location + precise datetime - BIGGER */}
            <motion.div
              initial={{ opacity: 0, y: -40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1, duration: 5, ease: [0.16, 1, 0.3, 1] }}
              className="mb-20"
            >
              <div className="flex flex-wrap items-center justify-center gap-8 text-muted-foreground/35">
                <span className="text-base md:text-lg uppercase tracking-[0.7em] font-light">
                  {presence.city}
                </span>
                <span className="w-2 h-2 rounded-full bg-muted-foreground/20" />
                <span className="text-base md:text-lg uppercase tracking-[0.5em] tabular-nums font-light">
                  {now.toLocaleDateString(undefined, {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </span>
                <span className="w-2 h-2 rounded-full bg-muted-foreground/20" />
                <span className="text-base md:text-lg uppercase tracking-[0.5em] tabular-nums font-light">
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
                  className="text-6xl md:text-8xl lg:text-9xl xl:text-[10rem] font-extralight tracking-[0.04em] text-primary/80 mb-14 leading-[1.05]"
                  initial={{ opacity: 0, y: 40, filter: 'blur(25px)' }}
                  animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                  transition={{ delay: 1.5, duration: 5.5, ease: [0.16, 1, 0.3, 1] }}
                >
                  You have returned
                </motion.p>

                <motion.p
                  className="text-xl md:text-2xl lg:text-3xl uppercase tracking-[1.2em] text-muted-foreground/45"
                  initial={{ opacity: 0, y: 25 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 2.8, duration: 4.5, ease: [0.16, 1, 0.3, 1] }}
                >
                  Visit № {returnCount}
                </motion.p>

                {status === 'considered' && (
                  <motion.p
                    className="text-sm uppercase tracking-[0.8em] text-primary/40 mt-16"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 4, duration: 4, ease: [0.16, 1, 0.3, 1] }}
                  >
                    Status: Under consideration
                  </motion.p>
                )}
              </>
            ) : (
              <>
                <motion.p
                  className="text-5xl md:text-7xl lg:text-8xl xl:text-9xl font-extralight tracking-[0.04em] text-muted-foreground/60 mb-14 leading-[1.05]"
                  initial={{ opacity: 0, y: 40, filter: 'blur(25px)' }}
                  animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                  transition={{ delay: 1.5, duration: 5.5, ease: [0.16, 1, 0.3, 1] }}
                >
                  Arriving
                </motion.p>

                <motion.p
                  className="text-xl md:text-2xl lg:text-3xl uppercase tracking-[1.2em] text-muted-foreground/40"
                  initial={{ opacity: 0, y: 25 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 2.8, duration: 4.5, ease: [0.16, 1, 0.3, 1] }}
                >
                  The infrastructure observes
                </motion.p>
              </>
            )}
          </motion.div>
        )}

        {/* Audio Offer Phase - ULTRA SMOOTH */}
        {phase === 'audio_offer' && (
          <motion.div
            key="audio"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30 }}
            transition={{ duration: 4, ease: [0.16, 1, 0.3, 1] }}
            className="text-center"
          >
            <motion.p
              className="text-lg md:text-xl tracking-[0.6em] uppercase text-muted-foreground/40 mb-16"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 4, ease: [0.16, 1, 0.3, 1] }}
            >
              Enable presence audio?
            </motion.p>
            
            <div className="flex items-center justify-center gap-12">
              <motion.button
                onClick={() => handleAudioChoice(true)}
                className="text-base tracking-[0.5em] uppercase text-primary/70 hover:text-primary px-10 py-5 border border-primary/20 hover:border-primary/45 transition-all duration-[2000ms] ease-[cubic-bezier(0.16,1,0.3,1)] rounded-sm"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.4, duration: 3.5, ease: [0.16, 1, 0.3, 1] }}
                whileHover={{ scale: 1.04, y: -6 }}
                whileTap={{ scale: 0.96 }}
              >
                Yes
              </motion.button>
              
              <motion.button
                onClick={() => handleAudioChoice(false)}
                className="text-base tracking-[0.5em] uppercase text-muted-foreground/30 hover:text-muted-foreground/50 px-10 py-5 transition-all duration-[2000ms] ease-[cubic-bezier(0.16,1,0.3,1)]"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.6, duration: 3.5, ease: [0.16, 1, 0.3, 1] }}
                whileHover={{ y: -3 }}
              >
                No
              </motion.button>
            </div>
          </motion.div>
        )}

        {/* Reveal Phase - ULTRA SMOOTH */}
        {phase === 'reveal' && (
          <motion.div
            key="reveal"
            initial={{ opacity: 0, scale: 0.8, filter: 'blur(20px)' }}
            animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
            exit={{ opacity: 0, scale: 1.2, filter: 'blur(15px)' }}
            transition={{ duration: 4.5, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col items-center gap-10"
          >
            <motion.div
              className="w-36 h-36 flex items-center justify-center"
              animate={{
                boxShadow: [
                  '0 0 80px hsl(42 90% 55% / 0.1)',
                  '0 0 150px hsl(42 90% 55% / 0.3)',
                  '0 0 80px hsl(42 90% 55% / 0.1)',
                ],
              }}
              transition={{ duration: 5, repeat: Infinity, ease: [0.16, 1, 0.3, 1] }}
            >
              <motion.span 
                className="text-7xl text-primary"
                animate={{ rotateY: [0, 360] }}
                transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
              >
                ◆
              </motion.span>
            </motion.div>
            
            <motion.p
              className="text-sm uppercase tracking-[1em] text-muted-foreground/25"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.5, duration: 3.5, ease: [0.16, 1, 0.3, 1] }}
            >
              Entering
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Subtle vignette */}
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_center,transparent_0%,black_100%)]" />
    </motion.div>
  );
}

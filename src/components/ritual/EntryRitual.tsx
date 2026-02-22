import { motion, AnimatePresence } from "framer-motion";
import { useStillness } from "@/hooks/useStillness";
import { usePresence } from "@/hooks/usePresence";
import { useApexSystem } from "@/contexts/ApexSystemContext";
import { useState, useEffect, useCallback, useMemo } from "react";

interface EntryRitualProps {
  onComplete: () => void;
}

type RitualPhase = 'void' | 'stillness' | 'presence' | 'audio_offer' | 'blueprint' | 'reveal';

// Check for reduced motion preference
function usePrefersReducedMotion() {
  const [prefersReduced, setPrefersReduced] = useState(false);
  
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReduced(mq.matches);
    
    const handler = (e: MediaQueryListEvent) => setPrefersReduced(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);
  
  return prefersReduced;
}

// Site blueprint data
const BLUEPRINT_NODES = [
  { name: 'Portal', label: 'Entry', path: '/' },
  { name: 'How It Works', label: 'Doctrine', path: '/how-it-works' },
  { name: 'Nodes', label: 'Scope', path: '/nodes' },
  { name: 'Access Conditions', label: 'Terms', path: '/pricing' },
  { name: 'Infrastructure', label: 'Architecture', path: '/infrastructure' },
  { name: 'Ledger', label: 'Proof', path: '/ledger' },
  { name: 'Manifesto', label: 'Authority', path: '/manifesto' },
];

export default function EntryRitual({ onComplete }: EntryRitualProps) {
  const [phase, setPhase] = useState<RitualPhase>('void');
  const { isStill, stillnessProgress } = useStillness({ requiredStillnessMs: 6500 });
  const presence = usePresence();
  const { enableAudio, isReturningVisitor, returnCount, status } = useApexSystem();
  const [audioAccepted, setAudioAccepted] = useState(false);
  const [now, setNow] = useState(() => new Date());
  const prefersReducedMotion = usePrefersReducedMotion();

  // Animation config based on reduced motion preference
  const motionConfig = useMemo(() => ({
    duration: prefersReducedMotion ? 0.3 : 3,
    ease: prefersReducedMotion ? "easeOut" : [0.16, 1, 0.3, 1] as const,
    presenceDuration: prefersReducedMotion ? 3000 : 12000,
  }), [prefersReducedMotion]);

  useEffect(() => {
    const interval = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  // Phase progression - respects reduced motion
  useEffect(() => {
    if (phase === 'void') {
      const timer = setTimeout(() => setPhase('stillness'), prefersReducedMotion ? 500 : 2500);
      return () => clearTimeout(timer);
    }
  }, [phase, prefersReducedMotion]);

  useEffect(() => {
    if (phase === 'stillness' && (isStill || prefersReducedMotion)) {
      setPhase('presence');
    }
  }, [phase, isStill, prefersReducedMotion]);

  useEffect(() => {
    if (phase === 'presence') {
      const timer = setTimeout(() => setPhase('audio_offer'), motionConfig.presenceDuration);
      return () => clearTimeout(timer);
    }
  }, [phase, motionConfig.presenceDuration]);

  // Blueprint: NO auto-advance — user must click "Enter" to proceed

  useEffect(() => {
    if (phase === 'reveal') {
      const timer = setTimeout(onComplete, prefersReducedMotion ? 1000 : 5000);
      return () => clearTimeout(timer);
    }
  }, [phase, onComplete, prefersReducedMotion]);

  const handleAudioChoice = useCallback(async (accept: boolean) => {
    if (accept) {
      await enableAudio();
      setAudioAccepted(true);
    }
    setPhase('blueprint');
  }, [enableAudio]);

  // Skip ritual entirely
  const handleSkipRitual = useCallback(() => {
    onComplete();
  }, [onComplete]);

  // Skip directly to reveal for patient returning visitors
  useEffect(() => {
    if (isReturningVisitor && returnCount > 3 && phase === 'stillness' && stillnessProgress > 0.7) {
      setPhase('presence');
    }
  }, [isReturningVisitor, returnCount, phase, stillnessProgress]);

  return (
    <motion.div 
      className="fixed inset-0 z-50 bg-black flex items-center justify-center overflow-hidden"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: motionConfig.duration, ease: motionConfig.ease }}
      style={{ willChange: 'opacity' }}
    >
      {/* Skip ritual link - subtle, bottom right */}
      {(isReturningVisitor || prefersReducedMotion) && phase !== 'reveal' && (
        <motion.button
          onClick={handleSkipRitual}
          className="absolute bottom-8 right-8 text-[10px] uppercase tracking-[0.4em] text-muted-foreground/20 hover:text-muted-foreground/50 transition-colors duration-700 z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: prefersReducedMotion ? 0.3 : 2, duration: 1 }}
        >
          Skip →
        </motion.button>
      )}
      <AnimatePresence mode="wait">
        {/* Stillness Phase */}
        {phase === 'stillness' && !prefersReducedMotion && (
          <motion.div
            key="stillness"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: motionConfig.duration, ease: motionConfig.ease }}
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
                transition={{ duration: 5, repeat: Infinity, ease: motionConfig.ease }}
              />
            </motion.div>
            
            <motion.p
              className="text-base tracking-[0.7em] uppercase text-muted-foreground/25"
              animate={{ opacity: [0.15, 0.4, 0.15] }}
              transition={{ duration: 6, repeat: Infinity, ease: motionConfig.ease }}
            >
              {stillnessProgress < 0.5 ? "Be still" : "Almost there"}
            </motion.p>
          </motion.div>
        )}
          
        {/* Presence Phase - MASSIVE TYPOGRAPHY - GPU OPTIMIZED */}
        {phase === 'presence' && (
          <motion.div
            key="presence"
            initial={{ opacity: 0, y: 60 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -40 }}
            transition={{ duration: 3, ease: [0.16, 1, 0.3, 1] }}
            className="text-center px-6 max-w-7xl"
            style={{ willChange: 'transform, opacity' }}
          >
            {/* Location + precise datetime */}
            <motion.div
              initial={{ opacity: 0, y: -30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 2.5, ease: [0.16, 1, 0.3, 1] }}
              className="mb-16"
              style={{ willChange: 'transform, opacity' }}
            >
              <div className="flex flex-wrap items-center justify-center gap-4 md:gap-6 text-muted-foreground/50">
                <span className="text-base md:text-base uppercase tracking-[0.6em] font-light">
                  {presence.city}
                </span>
                <span className="w-2 h-2 rounded-full bg-muted-foreground/30 hidden md:block" />
                <span className="text-base md:text-base uppercase tracking-[0.4em] tabular-nums font-light">
                  {now.toLocaleDateString(undefined, {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </span>
                <span className="w-2 h-2 rounded-full bg-muted-foreground/30 hidden md:block" />
                <span className="text-base md:text-base uppercase tracking-[0.4em] tabular-nums font-light">
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
                  className="text-5xl md:text-7xl lg:text-[8rem] font-medium tracking-[0.02em] text-foreground mb-12 leading-[1]"
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8, duration: 2.5, ease: [0.16, 1, 0.3, 1] }}
                  style={{ 
                    willChange: 'transform, opacity',
                    textShadow: '0 0 150px hsl(42 90% 55% / 0.5), 0 0 80px hsl(42 90% 55% / 0.3)'
                  }}
                >
                  You have returned
                </motion.p>

                <motion.p
                  className="text-2xl md:text-3xl lg:text-4xl uppercase tracking-[0.8em] text-foreground/80 font-normal"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.5, duration: 2, ease: [0.16, 1, 0.3, 1] }}
                  style={{ willChange: 'transform, opacity' }}
                >
                  Visit № {returnCount}
                </motion.p>

                {status === 'considered' && (
                  <motion.p
                    className="text-lg uppercase tracking-[0.5em] text-primary font-medium mt-12"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 2.2, duration: 2, ease: [0.16, 1, 0.3, 1] }}
                    style={{ willChange: 'transform, opacity' }}
                  >
                    Status: Under consideration
                  </motion.p>
                )}
              </>
            ) : (
              <>
                <motion.p
                  className="text-5xl md:text-7xl lg:text-[8rem] font-medium tracking-[0.02em] text-foreground mb-12 leading-[1]"
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8, duration: 2.5, ease: [0.16, 1, 0.3, 1] }}
                  style={{ willChange: 'transform, opacity' }}
                >
                  Arriving
                </motion.p>

                <motion.p
                  className="text-2xl md:text-3xl lg:text-4xl uppercase tracking-[0.8em] text-foreground/80 font-normal"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.5, duration: 2, ease: [0.16, 1, 0.3, 1] }}
                  style={{ willChange: 'transform, opacity' }}
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
                className="text-base tracking-[0.5em] uppercase text-primary/70 hover:text-primary px-10 py-5 border border-primary/20 hover:border-primary/45 transition-all duration-2000 ease-out rounded-sm"
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
                className="text-base tracking-[0.5em] uppercase text-muted-foreground/30 hover:text-muted-foreground/50 px-10 py-5 transition-all duration-2000 ease-out"
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

        {/* Blueprint Phase - SITE MAP */}
        {phase === 'blueprint' && (
          <motion.div
            key="blueprint"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 2, ease: [0.16, 1, 0.3, 1] }}
            className="text-center px-6 max-w-4xl w-full"
          >
            <motion.p
              className="text-base md:text-base tracking-[0.8em] uppercase text-muted-foreground/40 mb-10"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3, duration: 1.5 }}
            >
              System Blueprint
            </motion.p>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mb-10">
              {BLUEPRINT_NODES.map((node, i) => (
                <motion.div
                  key={node.name}
                  initial={{ opacity: 0, y: 20, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{
                    delay: 0.5 + i * 0.12,
                    duration: 1.2,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                  className="relative rounded-md px-4 py-5 md:py-6 border border-border/40 bg-card/60 backdrop-blur-sm hover:border-primary/30 transition-all duration-700 group"
                >
                  <p className="text-[10px] md:text-base tracking-[0.5em] uppercase text-primary/60 mb-2 font-medium">
                    {node.label}
                  </p>
                  <p className="text-base md:text-base font-medium text-foreground/80 group-hover:text-foreground transition-colors duration-500">
                    {node.name}
                  </p>
                </motion.div>
              ))}
            </div>

            <motion.button
              onClick={() => setPhase('reveal')}
              className="text-base tracking-[0.5em] uppercase text-primary/70 hover:text-primary px-8 py-4 border border-primary/25 hover:border-primary/50 rounded-sm transition-all duration-700"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.8, duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
              whileHover={{ scale: 1.04, y: -3 }}
              whileTap={{ scale: 0.96 }}
            >
              Enter the System →
            </motion.button>
          </motion.div>
        )}

        {/* Reveal Phase - ACKNOWLEDGMENT MOMENT */}
        {phase === 'reveal' && (
          <motion.div
            key="reveal"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 1.1 }}
            transition={{ duration: prefersReducedMotion ? 0.5 : 2, ease: [0.16, 1, 0.3, 1] }}
            className="text-center px-6"
          >
            {/* Micro-reward acknowledgment */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 2, ease: [0.16, 1, 0.3, 1] }}
              className="mb-12"
            >
              {isReturningVisitor ? (
                <>
                  <p className="text-4xl md:text-5xl lg:text-6xl font-light text-foreground mb-4 tracking-wide">
                    You returned.
                  </p>
                  <p className="text-lg md:text-xl text-foreground/50 tracking-[0.3em] uppercase">
                    {returnCount} times now.
                  </p>
                </>
              ) : (
                <>
                  <p className="text-4xl md:text-5xl lg:text-6xl font-light text-foreground mb-4 tracking-wide">
                    You waited.
                  </p>
                  <p className="text-lg md:text-xl text-foreground/50 tracking-[0.3em] uppercase">
                    Few do.
                  </p>
                </>
              )}
            </motion.div>

            {/* System notices sigil */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1.2, duration: 2, ease: [0.16, 1, 0.3, 1] }}
              className="flex flex-col items-center gap-6"
            >
              <motion.div
                className="flex items-center gap-4"
                animate={{ opacity: [0.4, 0.8, 0.4] }}
                transition={{ duration: 3, repeat: Infinity }}
              >
                <span className="text-2xl text-primary">◆</span>
                <span className="text-base uppercase tracking-[0.4em] text-muted-foreground/40">
                  The system notices
                </span>
                <span className="text-2xl text-primary">◆</span>
              </motion.div>
              
              <motion.p
                className="text-[10px] uppercase tracking-[0.6em] text-muted-foreground/20"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 2.5, duration: 1.5 }}
              >
                Entering
              </motion.p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Subtle vignette */}
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_center,transparent_0%,black_100%)]" />
    </motion.div>
  );
}

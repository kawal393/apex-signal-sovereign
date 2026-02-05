import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useCallback, useEffect } from "react";
import { ApexButton } from "@/components/ui/apex-button";
import EntryRitual from "@/components/ritual/EntryRitual";
import SovereignVoid from "@/components/3d/SovereignVoid";
import { useRotatingStatement } from "@/hooks/useRotatingStatement";
import { usePresence } from "@/hooks/usePresence";
import { useApexSystem } from "@/contexts/ApexSystemContext";
import apexLogo from "@/assets/apex-logo.png";

const Index = () => {
  const [ritualComplete, setRitualComplete] = useState(false);
  const [contentVisible, setContentVisible] = useState(false);
  const [scrollDepth, setScrollDepth] = useState(0);
  const statement = useRotatingStatement();
  const presence = usePresence();
  const { isAudioEnabled, status, playThresholdTone } = useApexSystem();

  const handleRitualComplete = useCallback(() => {
    setRitualComplete(true);
    setTimeout(() => setContentVisible(true), 300);
  }, []);

  const handleProceed = useCallback(() => {
    playThresholdTone();
  }, [playThresholdTone]);

  // Track scroll for 3D camera
  useEffect(() => {
    const handleScroll = () => {
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      const depth = maxScroll > 0 ? window.scrollY / maxScroll : 0;
      setScrollDepth(depth);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="relative min-h-screen overflow-hidden bg-black">
      {/* Entry Ritual */}
      <AnimatePresence>
        {!ritualComplete && (
          <EntryRitual onComplete={handleRitualComplete} />
        )}
      </AnimatePresence>

      {/* TRUE WEBGL 3D VOID */}
      {contentVisible && (
        <SovereignVoid scrollDepth={scrollDepth} className="z-0" />
      )}

      {/* Content */}
      <AnimatePresence>
        {contentVisible && (
          <>
            {/* Atmospheric vignette */}
            <div className="absolute inset-0 pointer-events-none z-10">
              <div className="absolute top-0 left-0 right-0 h-96 bg-gradient-to-b from-black via-black/80 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 h-[600px] bg-gradient-to-t from-black via-black/95 to-transparent" />
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_10%,black/70_55%,black_100%)]" />
            </div>

            {/* MASSIVE SOVEREIGN LOGO - CENTER */}
            {/* IMPORTANT: keep centering transforms OUTSIDE framer-motion to avoid transform override */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 pointer-events-none relative">
              <motion.div
                className="relative"
                initial={{ opacity: 0, scale: 1.15, filter: 'blur(40px)' }}
                animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
                transition={{ duration: 3.2, ease: [0.16, 1, 0.3, 1] }}
              >
                {/* Massive glow layers */}
                <motion.div
                  className="absolute inset-0 blur-3xl"
                  animate={{
                    opacity: [0.25, 0.4, 0.25],
                    scale: [1, 1.12, 1],
                  }}
                  transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
                >
                  <img
                    src={apexLogo}
                    alt=""
                    className="w-[500px] md:w-[700px] lg:w-[900px] h-auto"
                    style={{ filter: 'brightness(1.25)' }}
                  />
                </motion.div>

                {/* Purple accent layer */}
                <motion.div
                  className="absolute inset-0 blur-[100px]"
                  animate={{ opacity: [0.08, 0.18, 0.08] }}
                  transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 2 }}
                >
                  <img
                    src={apexLogo}
                    alt=""
                    className="w-[500px] md:w-[700px] lg:w-[900px] h-auto"
                    style={{ filter: 'hue-rotate(240deg) brightness(0.75)' }}
                  />
                </motion.div>

                {/* MAIN LOGO - avoid animating CSS filter (expensive); animate opacity/scale instead */}
                <motion.img
                  src={apexLogo}
                  alt="APEX"
                  className="w-[500px] md:w-[700px] lg:w-[900px] h-auto object-contain relative z-10"
                  style={{
                    filter:
                      'drop-shadow(0 0 70px hsl(42 95% 55% / 0.35)) drop-shadow(0 0 140px hsl(42 95% 55% / 0.18))',
                  }}
                  animate={{ scale: [1, 1.01, 1], opacity: [0.92, 1, 0.92] }}
                  transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
                />

                {/* Crimson accent ring */}
                <motion.div
                  className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] md:w-[800px] lg:w-[1000px] h-[600px] md:h-[800px] lg:h-[1000px] rounded-full border border-crimson/10"
                  animate={{
                    scale: [1, 1.04, 1],
                    opacity: [0.08, 0.16, 0.08],
                  }}
                  transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
                />
              </motion.div>
            </div>

            {/* Status indicator */}
            {status !== 'observer' && (
              <motion.div
                className="absolute top-6 right-6 z-30"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 2 }}
              >
                <span className="text-[8px] uppercase tracking-[0.3em] text-gold/40">
                  {status === 'acknowledged' ? 'Acknowledged' : 'Considered'}
                </span>
              </motion.div>
            )}

            {/* Audio indicator */}
            {isAudioEnabled && (
              <motion.div
                className="absolute top-6 left-6 z-30 flex items-center gap-2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 2 }}
              >
                <motion.div
                  className="w-1.5 h-1.5 rounded-full bg-gold/60"
                  animate={{ scale: [1, 1.5, 1], opacity: [0.4, 0.8, 0.4] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
                <span className="text-[8px] uppercase tracking-[0.2em] text-grey-500">
                  Presence active
                </span>
              </motion.div>
            )}

            {/* Main Content - Bottom */}
            <main className="relative z-20 flex min-h-screen flex-col items-center justify-end px-6 pb-24 md:pb-32">
              <div className="max-w-4xl mx-auto text-center">
                {/* Rotating Statement */}
                <motion.div
                  initial={{ opacity: 0, y: 60 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 2.5, delay: 0.8, ease: [0.16, 1, 0.3, 1] }}
                >
                  <h1 className="text-2xl md:text-4xl lg:text-5xl xl:text-6xl font-extralight text-grey-100 leading-[1.6] tracking-[0.02em] mb-16">
                    {statement.primary}
                    {statement.secondary && (
                      <>
                        <br />
                        <motion.span
                          initial={{ opacity: 0, filter: 'blur(20px)' }}
                          animate={{ opacity: 1, filter: 'blur(0px)' }}
                          transition={{ duration: 2, delay: 2 }}
                          className="font-medium text-gradient-gold"
                        >
                          {statement.secondary}
                        </motion.span>
                      </>
                    )}
                  </h1>
                </motion.div>
                
                {/* Gate Entry */}
                <motion.div
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 1.8, delay: 1.8, ease: [0.16, 1, 0.3, 1] }}
                  className="flex flex-col items-center gap-14"
                >
                  <Link to="/commons" onClick={handleProceed}>
                    <motion.div
                      whileHover={{ scale: 1.05, y: -6 }}
                      whileTap={{ scale: 0.98 }}
                      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                    >
                      <ApexButton 
                        variant="primary" 
                        size="lg" 
                        className="min-w-[220px] text-sm tracking-[0.5em] px-16 py-7"
                        style={{
                          boxShadow: '0 0 80px hsl(42 95% 55% / 0.25), 0 0 160px hsl(42 95% 55% / 0.1)',
                        }}
                      >
                        PROCEED
                      </ApexButton>
                    </motion.div>
                  </Link>
                </motion.div>
              </div>
            </main>

            {/* Bottom sigil */}
            <motion.div 
              className="absolute bottom-0 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4 pb-8 z-20"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 3, duration: 2 }}
            >
              <div 
                className="w-24 h-px"
                style={{
                  background: 'linear-gradient(90deg, transparent, hsl(42 95% 55% / 0.3), transparent)',
                }}
              />
              <motion.span 
                className="text-gold/30 text-sm"
                animate={{ opacity: [0.2, 0.5, 0.2] }}
                transition={{ duration: 6, repeat: Infinity }}
              >
                ◆
              </motion.span>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Index;
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useCallback, useEffect } from "react";
import { ExternalLink, ArrowRight } from "lucide-react";
import { ApexButton } from "@/components/ui/apex-button";
import EntryRitual from "@/components/ritual/EntryRitual";
import SovereignVoid from "@/components/3d/SovereignVoid";
import MobileVoid from "@/components/effects/MobileVoid";
import { useRotatingStatement } from "@/hooks/useRotatingStatement";
import { usePresence } from "@/hooks/usePresence";
import { useApexSystem } from "@/contexts/ApexSystemContext";
import { useIsMobile } from "@/hooks/use-mobile";


const Index = () => {
  const [ritualComplete, setRitualComplete] = useState(false);
  const [contentVisible, setContentVisible] = useState(false);
  const [scrollDepth, setScrollDepth] = useState(0);
  const statement = useRotatingStatement();
  const presence = usePresence();
  const { isAudioEnabled, status, playThresholdTone } = useApexSystem();
  const isMobile = useIsMobile();
  const navigate = useNavigate();

  const handleRitualComplete = useCallback(() => {
    setRitualComplete(true);
    setTimeout(() => setContentVisible(true), 300);
  }, []);

  const handleProceed = useCallback(() => {
    playThresholdTone();
  }, [playThresholdTone]);

  const handleOpenWatchtower = useCallback(() => {
    navigate("/request-access");
  }, [navigate]);

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

      {/* 3D/2D VOID - Progressive degradation for mobile */}
      {contentVisible && (
        isMobile ? (
          <MobileVoid />
        ) : (
          <SovereignVoid scrollDepth={scrollDepth} className="z-0" />
        )
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
                <span className="text-[8px] uppercase tracking-[0.2em] text-grey-300">
                  Presence active
                </span>
              </motion.div>
            )}

            {/* Main Content - Bottom */}
            <main className="relative z-20 flex min-h-screen flex-col items-center justify-end px-6 pb-28 md:pb-36">
              <div className="max-w-4xl mx-auto text-center">

                {/* 1. EXISTENCE — Rotating Statement (first thing seen) */}
                <motion.div
                  initial={{ opacity: 0, y: 60 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 2.5, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
                >
                  <h1 className="text-2xl md:text-4xl lg:text-5xl xl:text-6xl font-extralight text-grey-100 leading-[1.6] tracking-[0.02em] mb-8">
                    {statement.primary}
                    {statement.secondary && (
                      <>
                        <br />
                        <motion.span
                          initial={{ opacity: 0, filter: 'blur(20px)' }}
                          animate={{ opacity: 1, filter: 'blur(0px)' }}
                          transition={{ duration: 2, delay: 1.8 }}
                          className="font-medium text-gradient-gold"
                        >
                          {statement.secondary}
                        </motion.span>
                      </>
                    )}
                  </h1>
                </motion.div>

                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 2, delay: 1.2, ease: [0.16, 1, 0.3, 1] }}
                  className="text-base md:text-base text-grey-200 leading-relaxed mb-16 md:mb-20 max-w-xl mx-auto tracking-wide"
                >
                  APEX has monitored AAT enforcement trends and corporate structural decay since 2022. Due to the critical mass of systemic failures observed recently, we are now unsealing selective nodes to the public.
                </motion.p>

                {/* 3. ACCESS — The single gravitational center */}
                <motion.div
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 1.8, delay: 1.6, ease: [0.16, 1, 0.3, 1] }}
                  className="flex flex-col items-center gap-16 mb-14"
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
                        className="min-w-[240px] text-base tracking-[0.5em] px-16 py-7"
                        style={{
                          boxShadow: '0 0 80px hsl(42 95% 55% / 0.25), 0 0 160px hsl(42 95% 55% / 0.1)',
                        }}
                      >
                        PROCEED
                      </ApexButton>
                    </motion.div>
                  </Link>
                </motion.div>

                {/* 4. ACTION — Secondary paths, deliberately subdued */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 1.5, delay: 2.4, ease: [0.16, 1, 0.3, 1] }}
                  className="flex flex-col items-center gap-5"
                >
                  <div className="flex items-center gap-6 text-grey-400">
                    <button
                      onClick={handleOpenWatchtower}
                      className="text-[10px] md:text-base uppercase tracking-[0.25em] hover:text-grey-400 transition-colors duration-500 flex items-center gap-2"
                    >
                      Live Signal
                      <ExternalLink className="w-3 h-3" />
                    </button>
                    <span className="w-px h-3 bg-grey-700" />
                    <Link
                      to="/request-verdict"
                      className="text-[10px] md:text-base uppercase tracking-[0.25em] hover:text-grey-400 transition-colors duration-500 flex items-center gap-2"
                    >
                      Request Verdict
                      <ArrowRight className="w-3 h-3" />
                    </Link>
                  </div>

                  <Link
                    to="/request-access"
                    className="text-grey-400 hover:text-grey-300 text-[10px] tracking-[0.2em] transition-colors duration-500"
                  >
                    apex@apex-infrastructure.com
                  </Link>
                </motion.div>

                {/* Member Access Gate */}
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 1.5, delay: 3, ease: [0.16, 1, 0.3, 1] }}
                  className="mt-20 pt-16 border-t border-grey-800/30"
                >
                  <h3 className="text-[10px] uppercase tracking-[0.6em] text-grey-400 mb-4">
                    Member Access Only
                  </h3>
                  <p className="text-base text-grey-500 mb-8 max-w-sm mx-auto">
                    You need to be a registered member to access the APEX Sovereign Grid
                  </p>
                  <div className="flex items-center justify-center gap-4 mb-8">
                    <Link
                      to="/auth"
                      className="px-8 py-3 bg-primary/10 border border-primary/40 rounded-md text-primary text-[10px] uppercase tracking-[0.3em] hover:bg-primary/20 hover:border-primary/60 transition-all duration-500"
                    >
                      Login
                    </Link>
                    <Link
                      to="/auth"
                      className="px-8 py-3 bg-primary/20 border border-primary/50 rounded-md text-primary text-[10px] uppercase tracking-[0.3em] hover:bg-primary/30 transition-all duration-500 font-medium"
                      style={{ boxShadow: '0 0 30px hsl(42 95% 55% / 0.1)' }}
                    >
                      Sign Up
                    </Link>
                  </div>
                  <div className="flex flex-col items-center gap-3">
                    <span className="text-[9px] uppercase tracking-[0.3em] text-grey-600">
                      Trusted by 200+ Organizations worldwide
                    </span>
                    <div className="flex items-center gap-2">
                      <motion.span
                        className="w-1.5 h-1.5 rounded-full bg-green-400/60"
                        animate={{ scale: [1, 1.3, 1], opacity: [0.4, 0.8, 0.4] }}
                        transition={{ duration: 2, repeat: Infinity }}
                      />
                      <span className="text-[9px] text-grey-600">
                        {Math.floor(Math.random() * 8) + 12} companies joined this week
                      </span>
                    </div>
                  </div>
                  <p className="text-[8px] text-grey-700 mt-8 tracking-[0.15em]">
                    © 2026 APEX INTELLIGENCE EMPIRE
                  </p>
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
                className="text-gold/30 text-base"
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

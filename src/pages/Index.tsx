import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useCallback } from "react";
import { ApexButton } from "@/components/ui/apex-button";
import EntryRitual from "@/components/ritual/EntryRitual";
import WatchingVoid from "@/components/effects/WatchingVoid";
import { useRotatingStatement } from "@/hooks/useRotatingStatement";
import { usePresence } from "@/hooks/usePresence";
import apexHeroBg from "@/assets/apex-hero-bg.png";

const Index = () => {
  const [ritualComplete, setRitualComplete] = useState(false);
  const [contentVisible, setContentVisible] = useState(false);
  const statement = useRotatingStatement();
  const presence = usePresence();

  const handleRitualComplete = useCallback(() => {
    setRitualComplete(true);
    // Stagger content appearance
    setTimeout(() => setContentVisible(true), 300);
  }, []);

  // Time-based atmosphere adjustment
  const atmosphereIntensity = presence.timeOfDay === 'night' ? 'strong' : 
                               presence.timeOfDay === 'dusk' ? 'medium' : 'subtle';

  return (
    <div className="relative min-h-screen overflow-hidden bg-black">
      {/* Entry Ritual - must be completed first */}
      <AnimatePresence>
        {!ritualComplete && (
          <EntryRitual onComplete={handleRitualComplete} />
        )}
      </AnimatePresence>

      {/* The Watching Void - cursor-aware, living */}
      <WatchingVoid intensity={atmosphereIntensity} particleCount={70} />

      {/* Content - only visible after ritual */}
      <AnimatePresence>
        {contentVisible && (
          <>
            {/* APEX Sacred Image - dimensional anchor */}
            <motion.div 
              className="absolute inset-0 flex items-center justify-center pointer-events-none"
              initial={{ opacity: 0, scale: 1.2, filter: 'blur(40px)' }}
              animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
              transition={{ duration: 3, ease: [0.16, 1, 0.3, 1] }}
            >
              <motion.img 
                src={apexHeroBg} 
                alt=""
                className="w-auto h-[75vh] md:h-[85vh] object-contain"
                style={{
                  filter: `drop-shadow(0 0 100px hsl(42 100% 55% / ${presence.timeOfDay === 'night' ? 0.3 : 0.4})) drop-shadow(0 0 200px hsl(35 90% 50% / 0.15))`,
                }}
                animate={{
                  filter: [
                    `drop-shadow(0 0 100px hsl(42 100% 55% / 0.3)) drop-shadow(0 0 200px hsl(35 90% 50% / 0.15))`,
                    `drop-shadow(0 0 120px hsl(42 100% 55% / 0.4)) drop-shadow(0 0 220px hsl(35 90% 50% / 0.2))`,
                    `drop-shadow(0 0 100px hsl(42 100% 55% / 0.3)) drop-shadow(0 0 200px hsl(35 90% 50% / 0.15))`,
                  ],
                }}
                transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
              />
              
              {/* Central energy halo */}
              <motion.div
                className="absolute inset-0"
                animate={{ opacity: [0.4, 0.7, 0.4] }}
                transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
              >
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_45%,hsl(42,100%,60%,0.1),transparent_40%)]" />
              </motion.div>
            </motion.div>

            {/* Atmospheric vignette */}
            <div className="absolute inset-0 pointer-events-none">
              <div className="absolute top-0 left-0 right-0 h-80 bg-gradient-to-b from-black via-black/60 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 h-[500px] bg-gradient-to-t from-black via-black/90 to-transparent" />
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_15%,black/70_65%,black_100%)]" />
            </div>

            {/* Main Content - bottom-anchored */}
            <main className="relative z-10 flex min-h-screen flex-col items-center justify-end px-6 pb-20 md:pb-28">
              <div className="max-w-4xl mx-auto text-center">
                {/* Rotating Statement */}
                <motion.div
                  initial={{ opacity: 0, y: 60 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 1.8, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
                >
                  <h1 className="text-2xl md:text-4xl lg:text-5xl xl:text-6xl font-extralight text-foreground leading-[1.5] tracking-[0.02em] mb-12">
                    {statement.primary}
                    {statement.secondary && (
                      <>
                        <br />
                        <motion.span
                          initial={{ opacity: 0, filter: 'blur(15px)' }}
                          animate={{ opacity: 1, filter: 'blur(0px)' }}
                          transition={{ duration: 1.5, delay: 1.5 }}
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
                  transition={{ duration: 1.2, delay: 1.2, ease: [0.16, 1, 0.3, 1] }}
                  className="flex flex-col items-center gap-10"
                >
                  <Link to="/commons">
                    <motion.div
                      whileHover={{ scale: 1.03, y: -4 }}
                      whileTap={{ scale: 0.98 }}
                      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                    >
                      <ApexButton 
                        variant="primary" 
                        size="lg" 
                        className="min-w-[200px] text-sm tracking-[0.35em] px-12 py-5"
                        style={{
                          boxShadow: '0 0 60px hsl(42 90% 55% / 0.2), 0 0 120px hsl(42 90% 55% / 0.08)',
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
              className="absolute bottom-0 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 pb-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 2, duration: 1 }}
            >
              <div 
                className="w-24 h-px"
                style={{
                  background: 'linear-gradient(90deg, transparent, hsl(42 90% 55% / 0.3), transparent)',
                }}
              />
              <motion.span 
                className="text-primary/30 text-xs"
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

import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import ApexNav from "@/components/layout/ApexNav";
import ApexFooter from "@/components/layout/ApexFooter";
import SystemMap from "@/components/sections/SystemMap";
import FeaturedNodes from "@/components/sections/FeaturedNodes";
import AccessRequest from "@/components/sections/AccessRequest";
import AccessTiers from "@/components/sections/AccessTiers";
import ActivityFeed from "@/components/sections/ActivityFeed";
import SovereignVoid from "@/components/3d/SovereignVoid";
import MobileVoid from "@/components/effects/MobileVoid";
import { ApexButton } from "@/components/ui/apex-button";
import { usePresence } from "@/hooks/usePresence";
import { useApexSystem } from "@/contexts/ApexSystemContext";
import { useIsMobile } from "@/hooks/use-mobile";
import apexLogo from "@/assets/apex-logo.png";
import { advancedAudioPresence } from "@/lib/audioPresenceAdvanced";

const Commons = () => {
  const presence = usePresence();
  const { isAudioEnabled, status, playThresholdTone } = useApexSystem();
  const isMobile = useIsMobile();
  const [scrollDepth, setScrollDepth] = useState(0);
  const [currentTime, setCurrentTime] = useState(new Date());
  const heroActive = scrollDepth < 0.18;

  // Live clock update
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Track scroll depth for 3D camera and audio
  useEffect(() => {
    let lastSection = 0;
    
    const handleScroll = () => {
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      const depth = maxScroll > 0 ? window.scrollY / maxScroll : 0;
      setScrollDepth(depth);
      
      if (isAudioEnabled) {
        advancedAudioPresence.updateScrollDepth(depth);
        
        // Play threshold tone when crossing section boundaries
        const currentSection = Math.floor(depth * 4);
        if (currentSection !== lastSection && currentSection > 0) {
          playThresholdTone();
          lastSection = currentSection;
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isAudioEnabled, playThresholdTone]);

  return (
    <div className="relative min-h-screen bg-black">
      {/* Progressive degradation: 2D void for mobile, WebGL for desktop */}
      {isMobile ? (
        <MobileVoid />
      ) : (
        <SovereignVoid active={heroActive} scrollDepth={scrollDepth} className="fixed inset-0 z-0" />
      )}
      
      {/* Atmospheric overlays - DARKER */}
      <div className="fixed inset-0 pointer-events-none z-[1]">
        <div className="absolute inset-0 bg-black/50" />
        <div className="absolute top-0 left-0 right-0 h-64 bg-gradient-to-b from-black to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 h-64 bg-gradient-to-t from-black to-transparent" />
      </div>
      
      {/* Navigation - Now using ApexNav component */}
      <ApexNav />
      
      {/* Main Content */}
      <main className="relative z-10">
        {/* Hero Header with MASSIVE LOGO - BIGGER FONTS */}
        <section className="relative min-h-screen flex items-center justify-center overflow-hidden border-b border-border/5">
          {/* Mystical Portal Rings - PURE CSS for zero JS overhead */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="absolute w-[450px] h-[450px] rounded-full border border-silver-light/8 animate-spin-slow" />
            <div className="absolute w-[600px] h-[600px] rounded-full border border-silver-mid/5 animate-spin-slower" />
            <div className="absolute w-[800px] h-[800px] rounded-full border border-grey-600/3 animate-spin-slowest" />
          </div>
          
          {/* LOGO INTEGRATED INTO THE VOID - more subtle, blends with 3D */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            {/* Subtle ambient presence */}
            <motion.div
              className="absolute blur-[180px] mix-blend-screen"
              animate={{ opacity: [0.06, 0.12, 0.06], scale: [0.95, 1.05, 0.95] }}
              transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
            >
              <img 
                src={apexLogo} 
                alt="" 
                className="w-[700px] md:w-[850px] lg:w-[1000px] h-auto"
                style={{ filter: 'grayscale(100%) brightness(0.7)' }}
              />
            </motion.div>
            
            {/* Main logo - reduced opacity, blends into void */}
            <motion.img
              src={apexLogo}
              alt=""
              initial={{ opacity: 0, scale: 1.1, filter: 'blur(30px) brightness(0.4)' }}
              animate={{ opacity: 0.35, scale: 1, filter: 'blur(0px) brightness(0.85)' }}
              transition={{ duration: 3.5, ease: [0.16, 1, 0.3, 1] }}
              className="w-[500px] md:w-[600px] lg:w-[700px] h-auto object-contain relative mix-blend-screen"
              style={{
                filter: 'grayscale(60%) contrast(0.85)',
                opacity: 0.4,
              }}
            />
          </div>
          
          {/* Content overlay - MASSIVE FONTS with READABLE COLORS */}
          <div className="relative z-20 text-center px-6 py-24 mt-24">
            {/* Presence Header - Location & Time */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 3, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="mb-16"
            >
              <motion.div 
                className="flex items-center justify-center gap-6 text-grey-500"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 4, delay: 0.8, ease: [0.16, 1, 0.3, 1] }}
              >
                <span className="text-[10px] md:text-[11px] uppercase tracking-[0.5em] font-light">
                  {presence.city.replace(/_/g, ' ')}
                </span>
                <span className="w-1 h-1 rounded-full bg-grey-600" />
                <span className="text-[10px] md:text-[11px] uppercase tracking-[0.5em] font-light">
                  {new Date().toLocaleDateString('en-US', { 
                    weekday: 'long',
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </span>
                <span className="w-1 h-1 rounded-full bg-grey-600" />
                <motion.span 
                  className="text-[10px] md:text-[11px] uppercase tracking-[0.5em] font-light tabular-nums"
                  key={currentTime.getSeconds()}
                  initial={{ opacity: 0.5 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  {currentTime.toLocaleTimeString('en-US', { 
                    hour: '2-digit', 
                    minute: '2-digit',
                    second: '2-digit',
                    hour12: false 
                  })}
                </motion.span>
              </motion.div>
              
              {/* Time of day indicator */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 2.5, delay: 1.2, ease: [0.16, 1, 0.3, 1] }}
                className="mt-4"
              >
                <span className={`text-[9px] uppercase tracking-[0.6em] px-4 py-1.5 rounded-full border ${
                  presence.timeOfDay === 'night' ? 'text-purple-light/70 border-purple-mid/20 bg-purple-mid/5' :
                  presence.timeOfDay === 'dawn' ? 'text-primary/70 border-primary/20 bg-primary/5' :
                  presence.timeOfDay === 'dusk' ? 'text-primary/60 border-primary/15 bg-primary/5' :
                  'text-silver-light/70 border-silver-mid/20 bg-silver-mid/5'
                }`}>
                  {presence.timeOfDay === 'night' ? '◆ Night Watch' :
                   presence.timeOfDay === 'dawn' ? '◇ Dawn Rising' :
                   presence.timeOfDay === 'dusk' ? '◈ Dusk Approaching' :
                   '◇ Day Cycle'}
                </span>
              </motion.div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 60 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 3, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
              style={{ willChange: 'transform, opacity' }}
            >
              <motion.span 
                className="text-sm md:text-base uppercase tracking-[0.8em] text-grey-200 block mb-10 font-normal"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.2, duration: 2.5, ease: [0.16, 1, 0.3, 1] }}
              >
                The Inevitable Infrastructure
              </motion.span>
              <h1 className="text-7xl md:text-9xl lg:text-[14rem] font-semibold text-foreground tracking-[0.03em] mb-10 leading-[0.85]">
                APEX
              </h1>
              <h2 className="text-4xl md:text-6xl lg:text-7xl font-medium text-foreground/90 tracking-[0.2em] mb-10">
                INFRASTRUCTURE
              </h2>
              <p className="text-xl md:text-2xl lg:text-3xl text-foreground/80 font-normal max-w-3xl mx-auto tracking-wide leading-relaxed">
                What must happen, will happen.
              </p>
              <p className="text-lg md:text-xl text-foreground/60 font-normal mt-4 tracking-widest">
                You are already inside.
              </p>
            </motion.div>
            
            {/* Category sigils - GPU OPTIMIZED */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 2.5, delay: 1.8, ease: [0.16, 1, 0.3, 1] }}
              className="flex flex-wrap items-center justify-center gap-8 md:gap-12 mt-20"
              style={{ willChange: 'transform, opacity' }}
            >
              {[
                { label: "INTELLIGENCE", sigil: "◆", color: "silver" },
                { label: "ACCESS", sigil: "◈", color: "grey" },
                { label: "INEVITABILITY", sigil: "◇", color: "purple" },
              ].map((item, i) => (
                <motion.div
                  key={item.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 2.2 + i * 0.3, duration: 2, ease: [0.16, 1, 0.3, 1] }}
                  whileHover={{ y: -6, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } }}
                  className={`group px-8 py-5 text-xs md:text-sm uppercase tracking-[0.5em] font-medium flex items-center gap-5 
                    ${item.color === 'silver' ? 'text-foreground border-silver-mid/40' : 
                      item.color === 'grey' ? 'text-foreground/90 border-grey-500/40' : 
                      'text-foreground/90 border-purple-mid/40'} 
                    border rounded-lg bg-black/95 backdrop-blur-xl cursor-default transition-all duration-700`}
                  style={{ willChange: 'transform' }}
                >
                  <span className={`${item.color === 'silver' ? 'text-primary' : 
                    item.color === 'grey' ? 'text-foreground/70' : 
                    'text-purple-light'} text-lg`}
                  >
                    {item.sigil}
                  </span>
                  {item.label}
                </motion.div>
              ))}
            </motion.div>

            {/* Scroll indicator */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 3.5, duration: 1 }}
              className="mt-24"
            >
              <motion.div
                animate={{ y: [0, 10, 0] }}
                transition={{ duration: 2.5, repeat: Infinity }}
                className="flex flex-col items-center gap-3"
              >
                <span className="text-[10px] uppercase tracking-[0.4em] text-grey-600">Descend</span>
                <div className="w-px h-12 bg-gradient-to-b from-grey-600 to-transparent" />
              </motion.div>
            </motion.div>
          </div>
        </section>
        
        {/* System Map */}
        <SystemMap />
        
        {/* Featured Nodes - Interactive */}
        <FeaturedNodes />
        
        {/* Access Tiers - NEW */}
        <AccessTiers />
        
        {/* Live Activity Feed - NEW */}
        <ActivityFeed />
        
        {/* Access Request */}
        <AccessRequest />
      </main>
      
      {/* Footer */}
      <ApexFooter />
    </div>
  );
};

export default Commons;

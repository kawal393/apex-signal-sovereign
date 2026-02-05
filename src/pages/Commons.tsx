import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import ApexFooter from "@/components/layout/ApexFooter";
import SystemMap from "@/components/sections/SystemMap";
import FeaturedNodes from "@/components/sections/FeaturedNodes";
import AccessRequest from "@/components/sections/AccessRequest";
import AccessTiers from "@/components/sections/AccessTiers";
import ActivityFeed from "@/components/sections/ActivityFeed";
import SovereignVoid from "@/components/3d/SovereignVoid";
import { usePresence } from "@/hooks/usePresence";
import { useApexSystem } from "@/contexts/ApexSystemContext";
import apexLogo from "@/assets/apex-logo.png";
import { advancedAudioPresence } from "@/lib/audioPresenceAdvanced";
import { Link } from "react-router-dom";

const Commons = () => {
  const presence = usePresence();
  const { isAudioEnabled, status, playThresholdTone } = useApexSystem();
  const [scrollDepth, setScrollDepth] = useState(0);
  const heroActive = scrollDepth < 0.18;

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
      {/* TRUE WEBGL 3D VOID */}
      <SovereignVoid active={heroActive} scrollDepth={scrollDepth} className="fixed inset-0 z-0" />
      
      {/* Atmospheric overlays - DARKER */}
      <div className="fixed inset-0 pointer-events-none z-[1]">
        <div className="absolute inset-0 bg-black/50" />
        <div className="absolute top-0 left-0 right-0 h-64 bg-gradient-to-b from-black to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 h-64 bg-gradient-to-t from-black to-transparent" />
      </div>
      
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3 group">
            <img src={apexLogo} alt="APEX" className="w-10 h-10 opacity-60 group-hover:opacity-100 transition-opacity" />
            <span className="text-sm font-medium text-grey-400 group-hover:text-grey-200 transition-colors tracking-widest">
              APEX SYSTEM
            </span>
          </Link>
          
          <div className="flex items-center gap-6">
            <Link 
              to="/manifesto" 
              className="text-[11px] uppercase tracking-[0.2em] text-grey-500 hover:text-grey-300 transition-colors"
            >
              Manifesto
            </Link>
            <Link 
              to="/dashboard" 
              className="text-[11px] uppercase tracking-[0.2em] text-grey-500 hover:text-grey-300 transition-colors"
            >
              Dashboard
            </Link>
            {status !== 'observer' && (
              <span className="text-[9px] uppercase tracking-[0.3em] text-primary/60 bg-primary/10 px-3 py-1.5 rounded-full border border-primary/20">
                {status === 'acknowledged' ? 'Acknowledged' : 'Under Consideration'}
              </span>
            )}
          </div>
        </div>
      </nav>
      
      {/* Main Content */}
      <main className="relative z-10">
        {/* Hero Header with MASSIVE LOGO - BIGGER FONTS */}
        <section className="relative min-h-screen flex items-center justify-center overflow-hidden border-b border-border/5">
          {/* Mystical Portal Rings - ULTRA SMOOTH */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <motion.div 
              className="absolute w-[450px] h-[450px] rounded-full border border-silver-light/15"
              animate={{ scale: [1, 1.04, 1], opacity: [0.15, 0.32, 0.15], rotateZ: [0, 180, 360] }}
              transition={{ duration: 40, repeat: Infinity, ease: [0.45, 0, 0.55, 1] }}
            />
            <motion.div 
              className="absolute w-[600px] h-[600px] rounded-full border border-silver-mid/10"
              animate={{ scale: [1, 1.03, 1], opacity: [0.1, 0.22, 0.1], rotateZ: [360, 180, 0] }}
              transition={{ duration: 50, repeat: Infinity, ease: [0.45, 0, 0.55, 1], delay: 0.5 }}
            />
            <motion.div 
              className="absolute w-[800px] h-[800px] rounded-full border border-grey-600/8"
              animate={{ scale: [1, 1.02, 1], opacity: [0.08, 0.18, 0.08], rotateZ: [0, -90, 0] }}
              transition={{ duration: 60, repeat: Infinity, ease: [0.45, 0, 0.55, 1], delay: 1 }}
            />
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
            <motion.div
              initial={{ opacity: 0, y: 60 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 4.5, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
            >
              <motion.span 
                className="text-[11px] md:text-[13px] uppercase tracking-[1em] text-grey-300 block mb-12"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.5, duration: 3.5, ease: [0.16, 1, 0.3, 1] }}
              >
                The Inevitable Infrastructure
              </motion.span>
              <h1 className="text-6xl md:text-8xl lg:text-[12rem] font-extralight text-grey-100 tracking-[0.04em] mb-12 leading-[0.85]">
                <span className="text-grey-100 font-normal">APEX</span>
              </h1>
              <h2 className="text-3xl md:text-5xl lg:text-6xl font-extralight text-grey-300 tracking-[0.2em] mb-12">
                SYSTEM
              </h2>
              <p className="text-xl md:text-2xl lg:text-3xl text-grey-200 font-extralight max-w-3xl mx-auto tracking-wider leading-relaxed">
                What must happen, will happen.
              </p>
              <p className="text-lg md:text-xl text-grey-400 font-extralight mt-4 tracking-widest">
                You are already inside.
              </p>
            </motion.div>
            
            {/* Category sigils - LARGER with READABLE COLORS */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 3.5, delay: 2.2, ease: [0.16, 1, 0.3, 1] }}
              className="flex flex-wrap items-center justify-center gap-8 md:gap-12 mt-24"
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
                  transition={{ delay: 2.8 + i * 0.4, duration: 2.5, ease: [0.16, 1, 0.3, 1] }}
                  whileHover={{ y: -8, scale: 1.05, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } }}
                  className={`group px-10 py-6 text-[11px] md:text-[13px] uppercase tracking-[0.6em] font-normal flex items-center gap-6 
                    ${item.color === 'silver' ? 'text-silver-light border-silver-mid/30' : 
                      item.color === 'grey' ? 'text-grey-200 border-grey-500/30' : 
                      'text-purple-light border-purple-mid/30'} 
                    border rounded-lg bg-black/90 backdrop-blur-2xl cursor-default transition-all duration-[1500ms] ease-[cubic-bezier(0.16,1,0.3,1)]`}
                >
                  <motion.span 
                    className={`${item.color === 'silver' ? 'text-silver-mid group-hover:text-silver-light' : 
                      item.color === 'grey' ? 'text-grey-400 group-hover:text-grey-200' : 
                      'text-purple-mid group-hover:text-purple-light'} transition-colors duration-[1500ms] text-xl`}
                    animate={{ rotateY: [0, 360] }}
                    transition={{ duration: 50 + i * 10, repeat: Infinity, ease: "linear" }}
                  >
                    {item.sigil}
                  </motion.span>
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

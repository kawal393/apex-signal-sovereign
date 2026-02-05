import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import ApexFooter from "@/components/layout/ApexFooter";
import SystemMap from "@/components/sections/SystemMap";
import FeaturedNodes from "@/components/sections/FeaturedNodes";
import AccessRequest from "@/components/sections/AccessRequest";
import SovereignVoid from "@/components/3d/SovereignVoid";
import { usePresence } from "@/hooks/usePresence";
import { useApexSystem } from "@/contexts/ApexSystemContext";
import apexLogo from "@/assets/apex-logo.png";
import { advancedAudioPresence } from "@/lib/audioPresenceAdvanced";

const Commons = () => {
  const presence = usePresence();
  const { isAudioEnabled, status, playThresholdTone } = useApexSystem();
  const [scrollDepth, setScrollDepth] = useState(0);

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
      <SovereignVoid scrollDepth={scrollDepth} className="fixed inset-0 z-0" />
      
      {/* Atmospheric overlays */}
      <div className="fixed inset-0 pointer-events-none z-[1]">
        <div className="absolute inset-0 bg-black/40" />
        <div className="absolute top-0 left-0 right-0 h-48 bg-gradient-to-b from-black to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-t from-black to-transparent" />
      </div>
      
      {/* Status indicator */}
      {status !== 'observer' && (
        <motion.div
          className="fixed top-6 right-6 z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
        >
          <span className="text-[8px] uppercase tracking-[0.3em] text-gold/50 bg-black/70 px-4 py-2 rounded-sm border border-gold/15">
            {status === 'acknowledged' ? 'Acknowledged' : 'Under Consideration'}
          </span>
        </motion.div>
      )}
      
      {/* Main Content */}
      <main className="relative z-10">
        {/* Hero Header with MASSIVE LOGO */}
        <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden border-b border-border/5">
          {/* Mystical Portal Rings - Silver/Grey dominant */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <motion.div 
              className="absolute w-[400px] h-[400px] rounded-full border border-silver-light/20"
              animate={{ scale: [1, 1.05, 1], opacity: [0.2, 0.4, 0.2], rotateZ: [0, 180, 360] }}
              transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
            />
            <motion.div 
              className="absolute w-[550px] h-[550px] rounded-full border border-silver-mid/15"
              animate={{ scale: [1, 1.03, 1], opacity: [0.15, 0.3, 0.15], rotateZ: [360, 180, 0] }}
              transition={{ duration: 25, repeat: Infinity, ease: "easeInOut", delay: 1 }}
            />
            <motion.div 
              className="absolute w-[700px] h-[700px] rounded-full border border-grey-500/10"
              animate={{ scale: [1, 1.02, 1], opacity: [0.1, 0.25, 0.1], rotateZ: [0, -90, 0] }}
              transition={{ duration: 30, repeat: Infinity, ease: "easeInOut", delay: 2 }}
            />
            <motion.div 
              className="absolute w-[900px] h-[900px] rounded-full border border-purple-void/8"
              animate={{ scale: [1, 1.015, 1], opacity: [0.05, 0.15, 0.05] }}
              transition={{ duration: 35, repeat: Infinity, ease: "easeInOut", delay: 3 }}
            />
          </div>
          
          {/* LOGO INTEGRATED INTO THE VOID - no harsh glows, blends with 3D */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            {/* Subtle ambient presence - very soft, part of the fog */}
            <motion.div
              className="absolute blur-[150px] mix-blend-screen"
              animate={{ opacity: [0.08, 0.15, 0.08], scale: [0.95, 1.05, 0.95] }}
              transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
            >
              <img 
                src={apexLogo} 
                alt="" 
                className="w-[600px] md:w-[750px] lg:w-[900px] h-auto"
                style={{ filter: 'grayscale(100%) brightness(0.8)' }}
              />
            </motion.div>
            
            {/* Main logo - reduced opacity, no harsh shadows, blends into void */}
            <motion.img
              src={apexLogo}
              alt=""
              initial={{ opacity: 0, scale: 1.1, filter: 'blur(20px) brightness(0.5)' }}
              animate={{ opacity: 0.45, scale: 1, filter: 'blur(0px) brightness(0.9)' }}
              transition={{ duration: 3, ease: [0.16, 1, 0.3, 1] }}
              className="w-[450px] md:w-[550px] lg:w-[650px] h-auto object-contain relative mix-blend-screen"
              style={{
                filter: 'grayscale(50%) contrast(0.9)',
                opacity: 0.5,
              }}
            />
            
            {/* Subtle inner glow that matches the 3D orb */}
            <motion.div
              className="absolute w-32 h-32 rounded-full mix-blend-screen"
              animate={{ opacity: [0.1, 0.25, 0.1], scale: [1, 1.2, 1] }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
              style={{
                background: 'radial-gradient(circle, hsl(0 0% 60% / 0.3) 0%, transparent 70%)',
              }}
            />
          </div>
          
          {/* Content overlay */}
          <div className="relative z-20 text-center px-6 py-20 mt-20">
            <motion.div
              initial={{ opacity: 0, y: 60 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 2, delay: 1, ease: [0.16, 1, 0.3, 1] }}
            >
              <motion.span 
                className="text-[9px] uppercase tracking-[0.7em] text-grey-500 block mb-8"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.5, duration: 1.5 }}
              >
                The Inevitable Infrastructure
              </motion.span>
              <h1 className="text-4xl md:text-6xl lg:text-8xl font-extralight text-grey-100 tracking-[0.02em] mb-8">
                <span className="text-gradient-silver font-medium">APEX SYSTEM</span>
              </h1>
              <p className="text-lg md:text-xl text-grey-500 font-light max-w-xl mx-auto tracking-wide">
                What must happen, will happen. You are already inside.
              </p>
            </motion.div>
            
            {/* Category sigils */}
            <motion.div
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.5, delay: 2 }}
              className="flex flex-wrap items-center justify-center gap-8 mt-16"
            >
              {[
                { label: "INTELLIGENCE", sigil: "◆", color: "silver" },
                { label: "ACCESS", sigil: "◈", color: "grey" },
                { label: "INEVITABILITY", sigil: "◇", color: "purple" },
              ].map((item, i) => (
                <motion.div
                  key={item.label}
                  initial={{ opacity: 0, y: 20, rotateX: 45 }}
                  animate={{ opacity: 1, y: 0, rotateX: 0 }}
                  transition={{ delay: 2.2 + i * 0.2, duration: 1, ease: [0.16, 1, 0.3, 1] }}
                  whileHover={{ y: -6, scale: 1.03, rotateX: -5 }}
                  className={`group px-8 py-4 text-[9px] uppercase tracking-[0.5em] font-medium flex items-center gap-4 
                    ${item.color === 'silver' ? 'text-silver-light/80 border-silver-mid/20' : 
                      item.color === 'grey' ? 'text-grey-300/70 border-grey-500/20' : 
                      'text-purple-light/60 border-purple-mid/20'} 
                    border rounded-sm bg-black/70 backdrop-blur-xl cursor-default transition-all duration-700`}
                  style={{ perspective: '1000px', transformStyle: 'preserve-3d' }}
                >
                  <motion.span 
                    className={`${item.color === 'silver' ? 'text-silver-mid/60 group-hover:text-silver-light' : 
                      item.color === 'grey' ? 'text-grey-400/50 group-hover:text-grey-200' : 
                      'text-purple-mid/50 group-hover:text-purple-light'} transition-colors duration-500`}
                    animate={{ rotateY: [0, 360] }}
                    transition={{ duration: 20 + i * 5, repeat: Infinity, ease: "linear" }}
                  >
                    {item.sigil}
                  </motion.span>
                  {item.label}
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>
        
        {/* System Map */}
        <SystemMap />
        
        {/* Featured Nodes */}
        <FeaturedNodes />
        
        {/* Access Request */}
        <AccessRequest />
      </main>
      
      {/* Footer */}
      <ApexFooter />
    </div>
  );
};

export default Commons;
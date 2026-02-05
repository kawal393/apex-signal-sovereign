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
          {/* Portal rings */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <motion.div 
              className="absolute w-[500px] h-[500px] rounded-full border border-gold/10"
              animate={{ scale: [1, 1.03, 1], opacity: [0.15, 0.3, 0.15] }}
              transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
            />
            <motion.div 
              className="absolute w-[700px] h-[700px] rounded-full border border-silver-dark/8"
              animate={{ scale: [1, 1.02, 1], opacity: [0.08, 0.18, 0.08] }}
              transition={{ duration: 16, repeat: Infinity, ease: "easeInOut", delay: 2 }}
            />
            <motion.div 
              className="absolute w-[900px] h-[900px] rounded-full border border-purple-mid/5"
              animate={{ scale: [1, 1.015, 1], opacity: [0.05, 0.12, 0.05] }}
              transition={{ duration: 20, repeat: Infinity, ease: "easeInOut", delay: 4 }}
            />
          </div>
          
          {/* MASSIVE SOVEREIGN LOGO */}
          <div className="absolute inset-0 flex items-center justify-center">
            {/* Glow layers */}
            <motion.div
              className="absolute blur-3xl"
              animate={{ opacity: [0.25, 0.45, 0.25], scale: [1, 1.08, 1] }}
              transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
            >
              <img 
                src={apexLogo} 
                alt="" 
                className="w-[400px] md:w-[550px] lg:w-[700px] h-auto"
                style={{ filter: 'brightness(1.5)' }}
              />
            </motion.div>
            
            {/* Purple accent */}
            <motion.div
              className="absolute blur-[80px]"
              animate={{ opacity: [0.08, 0.2, 0.08] }}
              transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 3 }}
            >
              <img 
                src={apexLogo} 
                alt="" 
                className="w-[400px] md:w-[550px] lg:w-[700px] h-auto"
                style={{ filter: 'hue-rotate(240deg) brightness(0.7)' }}
              />
            </motion.div>
            
            {/* Main logo */}
            <motion.img
              src={apexLogo}
              alt=""
              initial={{ opacity: 0, scale: 1.2, filter: 'blur(30px)' }}
              animate={{ opacity: 0.75, scale: 1, filter: 'blur(0px)' }}
              transition={{ duration: 3, ease: [0.16, 1, 0.3, 1] }}
              className="w-[400px] md:w-[550px] lg:w-[700px] h-auto object-contain relative z-10"
              style={{
                filter: 'drop-shadow(0 0 80px hsl(42 100% 55% / 0.35)) drop-shadow(0 0 160px hsl(35 90% 50% / 0.2))',
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
                Infrastructure of Truth
              </motion.span>
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-extralight text-grey-100 tracking-[0.02em] mb-8">
                <span className="text-gradient-gold font-medium">APEX Commons</span>
              </h1>
              <p className="text-lg md:text-xl text-grey-400 font-light max-w-xl mx-auto tracking-wide">
                The network observes. Verified signal awaits.
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
                { label: "INTELLIGENCE", sigil: "◆", color: "gold" },
                { label: "ACCESS", sigil: "◈", color: "silver" },
                { label: "EQUITY", sigil: "◇", color: "crimson" },
              ].map((item, i) => (
                <motion.div
                  key={item.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 2.2 + i * 0.15, duration: 0.8 }}
                  whileHover={{ y: -4, scale: 1.02 }}
                  className={`group px-6 py-3 text-[9px] uppercase tracking-[0.5em] font-medium flex items-center gap-4 
                    ${item.color === 'gold' ? 'text-gold/70 border-gold/15' : 
                      item.color === 'silver' ? 'text-silver-mid/70 border-silver-dark/15' : 
                      'text-crimson/60 border-crimson/15'} 
                    border rounded-sm bg-black/50 backdrop-blur-md cursor-default transition-all duration-500`}
                >
                  <span className={`${item.color === 'gold' ? 'text-gold/50 group-hover:text-gold' : 
                    item.color === 'silver' ? 'text-silver-mid/40 group-hover:text-silver-light' : 
                    'text-crimson/40 group-hover:text-crimson'} transition-colors duration-500`}>
                    {item.sigil}
                  </span>
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
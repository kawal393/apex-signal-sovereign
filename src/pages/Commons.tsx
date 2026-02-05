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
          {/* Mystical Portal Rings - Silver/Grey dominant */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <motion.div 
              className="absolute w-[450px] h-[450px] rounded-full border border-silver-light/15"
              animate={{ scale: [1, 1.05, 1], opacity: [0.15, 0.35, 0.15], rotateZ: [0, 180, 360] }}
              transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
            />
            <motion.div 
              className="absolute w-[600px] h-[600px] rounded-full border border-silver-mid/10"
              animate={{ scale: [1, 1.03, 1], opacity: [0.1, 0.25, 0.1], rotateZ: [360, 180, 0] }}
              transition={{ duration: 30, repeat: Infinity, ease: "easeInOut", delay: 1 }}
            />
            <motion.div 
              className="absolute w-[800px] h-[800px] rounded-full border border-grey-600/8"
              animate={{ scale: [1, 1.02, 1], opacity: [0.08, 0.2, 0.08], rotateZ: [0, -90, 0] }}
              transition={{ duration: 35, repeat: Infinity, ease: "easeInOut", delay: 2 }}
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
          
          {/* Content overlay - BIGGER FONTS */}
          <div className="relative z-20 text-center px-6 py-20 mt-20">
            <motion.div
              initial={{ opacity: 0, y: 70 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 2.5, delay: 1, ease: [0.16, 1, 0.3, 1] }}
            >
              <motion.span 
                className="text-[10px] md:text-[11px] uppercase tracking-[0.8em] text-grey-500 block mb-10"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.5, duration: 1.5 }}
              >
                The Inevitable Infrastructure
              </motion.span>
              <h1 className="text-5xl md:text-7xl lg:text-9xl font-extralight text-grey-400 tracking-[0.02em] mb-10">
                <span className="text-grey-300 font-medium">APEX</span> <span className="text-grey-500">SYSTEM</span>
              </h1>
              <p className="text-xl md:text-2xl text-grey-500 font-light max-w-2xl mx-auto tracking-wide leading-relaxed">
                What must happen, will happen. You are already inside.
              </p>
            </motion.div>
            
            {/* Category sigils - BIGGER */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.5, delay: 2.2 }}
              className="flex flex-wrap items-center justify-center gap-6 md:gap-10 mt-20"
            >
              {[
                { label: "INTELLIGENCE", sigil: "◆", color: "silver" },
                { label: "ACCESS", sigil: "◈", color: "grey" },
                { label: "INEVITABILITY", sigil: "◇", color: "purple" },
              ].map((item, i) => (
                <motion.div
                  key={item.label}
                  initial={{ opacity: 0, y: 25, rotateX: 45 }}
                  animate={{ opacity: 1, y: 0, rotateX: 0 }}
                  transition={{ delay: 2.4 + i * 0.2, duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
                  whileHover={{ y: -8, scale: 1.05 }}
                  className={`group px-8 py-5 text-[10px] md:text-[11px] uppercase tracking-[0.5em] font-medium flex items-center gap-5 
                    ${item.color === 'silver' ? 'text-silver-light/70 border-silver-dark/20' : 
                      item.color === 'grey' ? 'text-grey-400/60 border-grey-600/20' : 
                      'text-purple-light/50 border-purple-mid/15'} 
                    border rounded-md bg-black/80 backdrop-blur-xl cursor-default transition-all duration-700`}
                >
                  <motion.span 
                    className={`${item.color === 'silver' ? 'text-silver-mid/50 group-hover:text-silver-light' : 
                      item.color === 'grey' ? 'text-grey-500/40 group-hover:text-grey-300' : 
                      'text-purple-mid/40 group-hover:text-purple-light'} transition-colors duration-500 text-lg`}
                    animate={{ rotateY: [0, 360] }}
                    transition={{ duration: 25 + i * 5, repeat: Infinity, ease: "linear" }}
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

import { motion } from "framer-motion";
import ApexFooter from "@/components/layout/ApexFooter";
import SystemMap from "@/components/sections/SystemMap";
import FeaturedNodes from "@/components/sections/FeaturedNodes";
import AccessRequest from "@/components/sections/AccessRequest";
import WatchingVoid from "@/components/effects/WatchingVoid";
import { usePresence } from "@/hooks/usePresence";
import apexHeroBg from "@/assets/apex-hero-bg.png";

const Commons = () => {
  const presence = usePresence();
  const atmosphereIntensity = presence.timeOfDay === 'night' ? 'medium' : 'subtle';

  return (
    <div className="relative min-h-screen bg-black">
      {/* The Watching Void */}
      <WatchingVoid intensity={atmosphereIntensity} particleCount={50} />
      
      {/* Main Content */}
      <main className="relative z-10">
        {/* Hero Header - Portal Entry */}
        <section className="relative min-h-[85vh] flex items-center justify-center overflow-hidden border-b border-border/5">
          {/* Portal rings */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <motion.div 
              className="absolute w-[400px] h-[400px] rounded-full"
              style={{
                border: '1px solid hsl(42 50% 50% / 0.08)',
                boxShadow: '0 0 60px hsl(42 90% 55% / 0.03)',
              }}
              animate={{ scale: [1, 1.02, 1], opacity: [0.15, 0.3, 0.15] }}
              transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
            />
            <motion.div 
              className="absolute w-[650px] h-[650px] rounded-full"
              style={{ border: '1px solid hsl(42 40% 45% / 0.04)' }}
              animate={{ scale: [1, 1.015, 1], opacity: [0.08, 0.18, 0.08] }}
              transition={{ duration: 16, repeat: Infinity, ease: "easeInOut", delay: 3 }}
            />
          </div>
          
          {/* APEX Image */}
          <div className="absolute inset-0 flex items-center justify-center">
            <motion.img
              src={apexHeroBg}
              alt=""
              initial={{ opacity: 0, scale: 1.1, filter: 'blur(20px)' }}
              animate={{ opacity: 0.65, scale: 1, filter: 'blur(0px)' }}
              transition={{ duration: 2.5, ease: [0.16, 1, 0.3, 1] }}
              className="w-auto h-[65vh] object-contain"
              style={{
                filter: 'drop-shadow(0 0 100px hsl(42 100% 55% / 0.3)) drop-shadow(0 0 200px hsl(35 90% 50% / 0.12))',
              }}
            />
          </div>
          
          {/* Atmospheric overlays */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-0 left-0 right-0 h-40 bg-gradient-to-b from-black to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 h-80 bg-gradient-to-t from-black via-black/90 to-transparent" />
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_15%,black/60_60%)]" />
          </div>
          
          {/* Content overlay */}
          <div className="relative z-10 text-center px-6 py-20 mt-20">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.2, delay: 0.8, ease: [0.16, 1, 0.3, 1] }}
            >
              <motion.span 
                className="text-[10px] uppercase tracking-[0.5em] text-muted-foreground/40 block mb-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.2, duration: 1 }}
              >
                Infrastructure of Truth
              </motion.span>
              <h1 className="text-3xl md:text-5xl lg:text-6xl font-extralight text-foreground tracking-[0.02em] mb-6">
                <span className="text-gradient-gold font-medium">APEX Commons</span>
              </h1>
              <p className="text-base md:text-lg text-muted-foreground/50 font-light max-w-xl mx-auto tracking-wide">
                The network observes. Verified signal awaits.
              </p>
            </motion.div>
            
            {/* Category sigils */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 1.5 }}
              className="flex flex-wrap items-center justify-center gap-6 mt-12"
            >
              {[
                { label: "INTELLIGENCE", sigil: "◆" },
                { label: "ACCESS", sigil: "◈" },
                { label: "EQUITY", sigil: "◇" },
              ].map((item, i) => (
                <motion.div
                  key={item.label}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.7 + i * 0.15, duration: 0.8 }}
                  className="group px-5 py-2.5 text-[9px] uppercase tracking-[0.35em] font-medium flex items-center gap-3 text-primary/60 border border-primary/10 rounded-sm bg-black/30 backdrop-blur-sm cursor-default"
                >
                  <span className="text-primary/40 group-hover:text-primary/60 transition-colors duration-700">
                    {item.sigil}
                  </span>
                  {item.label}
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>
        
        {/* System Map - living constellation */}
        <SystemMap />
        
        {/* Featured Nodes */}
        <FeaturedNodes />
        
        {/* Access Request - evaluation, not purchase */}
        <AccessRequest />
      </main>
      
      {/* Footer */}
      <ApexFooter />
    </div>
  );
};

export default Commons;

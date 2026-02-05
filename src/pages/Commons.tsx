import { motion } from "framer-motion";
import ApexNav from "@/components/layout/ApexNav";
import ApexFooter from "@/components/layout/ApexFooter";
import SystemMap from "@/components/sections/SystemMap";
import FeaturedNodes from "@/components/sections/FeaturedNodes";
import AccessTiers from "@/components/sections/AccessTiers";
import CommonsCTA from "@/components/sections/CommonsCTA";
import CosmicVoid from "@/components/effects/CosmicVoid";
import SacredGeometry from "@/components/effects/SacredGeometry";
import apexHeroBg from "@/assets/apex-hero-bg.png";

const Commons = () => {
  return (
    <div className="relative min-h-screen">
      {/* The Void - cosmic background */}
      <CosmicVoid intensity="medium" showPortals={false} showParticles />
      
      {/* Navigation */}
      <ApexNav />
      
      {/* Main Content */}
      <main className="relative z-10 pt-24">
        {/* Hero Header - Portal Entry */}
        <section className="relative min-h-[85vh] flex items-center justify-center overflow-hidden border-b border-border/20">
          {/* Sacred geometry background */}
          <SacredGeometry variant="all" />
          
          {/* Portal rings */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <motion.div 
              className="absolute w-[450px] h-[450px] rounded-full"
              style={{
                border: '1px solid hsl(42 50% 50% / 0.1)',
                boxShadow: '0 0 60px hsl(42 90% 55% / 0.05)',
              }}
              animate={{ scale: [1, 1.02, 1], opacity: [0.2, 0.4, 0.2] }}
              transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
            />
            <motion.div 
              className="absolute w-[700px] h-[700px] rounded-full"
              style={{ border: '1px solid hsl(42 40% 45% / 0.06)' }}
              animate={{ scale: [1, 1.015, 1], opacity: [0.1, 0.25, 0.1] }}
              transition={{ duration: 14, repeat: Infinity, ease: "easeInOut", delay: 2 }}
            />
          </div>
          
          {/* APEX Image - dimensional anchor */}
          <div className="absolute inset-0 flex items-center justify-center">
            <motion.img
              src={apexHeroBg}
              alt=""
              initial={{ opacity: 0, scale: 1.15, filter: 'blur(20px)' }}
              animate={{ opacity: 0.7, scale: 1, filter: 'blur(0px)' }}
              transition={{ duration: 2.5, ease: [0.16, 1, 0.3, 1] }}
              className="w-auto h-[70vh] object-contain"
              style={{
                filter: 'drop-shadow(0 0 120px hsl(42 100% 55% / 0.35)) drop-shadow(0 0 250px hsl(35 90% 50% / 0.15))',
              }}
            />
            
            {/* Layered energy glow */}
            <motion.div
              className="absolute inset-0"
              animate={{ opacity: [0.5, 0.8, 0.5] }}
              transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
            >
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_45%,hsl(42,100%,60%,0.12),transparent_40%)]" />
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,hsl(35,95%,50%,0.08),transparent_30%)]" />
            </motion.div>
          </div>
          
          {/* Atmospheric overlays */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-0 left-0 right-0 h-48 bg-gradient-to-b from-[hsl(260,18%,2%)] to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 h-96 bg-gradient-to-t from-[hsl(260,18%,2%)] via-[hsl(260,18%,2%,0.85)] to-transparent" />
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_20%,hsl(260,18%,2%,0.6)_65%)]" />
          </div>
          
          {/* Content overlay */}
          <div className="relative z-10 text-center px-6 py-20 mt-20">
            {/* Title - ritualistic */}
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.2, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
            >
              <motion.span 
                className="text-[10px] uppercase tracking-[0.5em] text-muted-foreground/60 block mb-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1, duration: 1 }}
              >
                Infrastructure of Truth
              </motion.span>
              <h1 className="text-3xl md:text-5xl lg:text-6xl font-extralight text-foreground tracking-[0.02em] mb-6">
                <span className="text-gradient-gold font-medium">APEX Commons</span>
              </h1>
              <p className="text-base md:text-lg text-muted-foreground/70 font-light max-w-2xl mx-auto tracking-wide">
                Enter the network. Access sovereign intelligence.
              </p>
            </motion.div>
            
            {/* Category sigils */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 1 }}
              className="flex flex-wrap items-center justify-center gap-6 mt-14"
            >
              {[
                { label: "INTELLIGENCE", sigil: "◆" },
                { label: "ACCESS", sigil: "◈" },
                { label: "EQUITY", sigil: "◇" },
              ].map((item, i) => (
                <motion.div
                  key={item.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.2 + i * 0.15, duration: 0.8 }}
                  whileHover={{ y: -4, scale: 1.02 }}
                  className="group px-6 py-3 glass-card text-[10px] uppercase tracking-[0.4em] font-medium flex items-center gap-4 cursor-default text-primary/80 border-primary/20 hover:border-primary/40 transition-all duration-700"
                >
                  <span className="text-primary/60 group-hover:text-primary transition-colors duration-700">
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
        
        {/* Access Tiers */}
        <AccessTiers />
        
        {/* CTA Section */}
        <CommonsCTA />
      </main>
      
      {/* Footer */}
      <ApexFooter />
    </div>
  );
};

export default Commons;

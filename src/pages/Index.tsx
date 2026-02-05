import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ApexButton } from "@/components/ui/apex-button";
import ApexNav from "@/components/layout/ApexNav";
import CosmicVoid from "@/components/effects/CosmicVoid";
import SacredGeometry from "@/components/effects/SacredGeometry";
import apexHeroBg from "@/assets/apex-hero-bg.png";

const Index = () => {
  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* The Void - cosmic background */}
      <CosmicVoid intensity="deep" showPortals showParticles />
      
      {/* Sacred geometry overlays */}
      <SacredGeometry variant="all" />
      
      {/* APEX Sacred Image - dimensional anchor */}
      <div className="absolute inset-0 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 1.2, filter: 'blur(30px)' }}
          animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
          transition={{ duration: 3, ease: [0.16, 1, 0.3, 1] }}
          className="relative"
        >
          <img 
            src={apexHeroBg} 
            alt="APEX"
            className="w-auto h-[80vh] md:h-[90vh] object-contain"
            style={{
              filter: 'drop-shadow(0 0 100px hsl(42 100% 55% / 0.4)) drop-shadow(0 0 200px hsl(35 90% 50% / 0.2))',
            }}
          />
          
          {/* Golden energy halo */}
          <motion.div
            className="absolute inset-0 pointer-events-none"
            animate={{ opacity: [0.4, 0.7, 0.4] }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          >
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_45%,hsl(42,100%,60%,0.15),transparent_45%)]" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,hsl(35,95%,50%,0.1),transparent_35%)]" />
          </motion.div>
        </motion.div>
      </div>
      
      {/* Atmospheric vignette */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 right-0 h-80 bg-gradient-to-b from-[hsl(260,20%,1%)] via-[hsl(260,20%,1%,0.6)] to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 h-[500px] bg-gradient-to-t from-[hsl(260,20%,1%)] via-[hsl(260,20%,1%,0.9)] to-transparent" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_20%,hsl(260,20%,1%,0.7)_70%,hsl(260,20%,1%,0.95)_100%)]" />
      </div>
      
      {/* Navigation */}
      <ApexNav />
      
      {/* Main Content - bottom-anchored */}
      <main className="relative z-10 flex min-h-screen flex-col items-center justify-end px-6 pb-20 md:pb-28">
        <div className="max-w-4xl mx-auto text-center">
          {/* Hero Statement - ritualistic typography */}
          <motion.div
            initial={{ opacity: 0, y: 60 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.8, delay: 1.5, ease: [0.16, 1, 0.3, 1] }}
          >
            <h1 className="text-2xl md:text-4xl lg:text-5xl xl:text-6xl font-extralight text-foreground leading-[1.5] tracking-[0.02em] mb-12">
              Truth does not need to be sold.
              <br />
              <motion.span
                initial={{ opacity: 0, filter: 'blur(15px)' }}
                animate={{ opacity: 1, filter: 'blur(0px)' }}
                transition={{ duration: 1.5, delay: 2.5 }}
                className="font-medium text-gradient-gold"
              >
                It just sells.
              </motion.span>
            </h1>
          </motion.div>
          
          {/* Gate Entry - consequential, not casual */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, delay: 2.2, ease: [0.16, 1, 0.3, 1] }}
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
                  className="min-w-[220px] text-sm tracking-[0.35em] px-12 py-5"
                  style={{
                    boxShadow: '0 0 60px hsl(42 90% 55% / 0.25), 0 0 120px hsl(42 90% 55% / 0.1)',
                  }}
                >
                  ENTER APEX
                </ApexButton>
              </motion.div>
            </Link>
            
            <Link to="/commons#system-map">
              <motion.span 
                className="text-xs text-muted-foreground/70 hover:text-primary/80 transition-all duration-700 tracking-[0.3em] uppercase"
                whileHover={{ 
                  y: -3, 
                  textShadow: '0 0 30px hsl(42 90% 55% / 0.4)' 
                }}
                transition={{ duration: 0.6 }}
              >
                View System Map
              </motion.span>
            </Link>
          </motion.div>
        </div>
      </main>
      
      {/* Bottom sigil line */}
      <motion.div 
        className="absolute bottom-0 left-1/2 -translate-x-1/2 w-32 h-px"
        style={{
          background: 'linear-gradient(90deg, transparent, hsl(42 90% 55% / 0.4), transparent)',
        }}
        animate={{ opacity: [0.3, 0.6, 0.3] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div 
        className="absolute bottom-8 left-1/2 -translate-x-1/2 w-16 h-px"
        style={{
          background: 'linear-gradient(90deg, transparent, hsl(42 90% 55% / 0.2), transparent)',
        }}
        animate={{ opacity: [0.2, 0.4, 0.2] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 1 }}
      />
    </div>
  );
};

export default Index;

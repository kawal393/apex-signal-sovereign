import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ApexButton } from "@/components/ui/apex-button";
import ApexNav from "@/components/layout/ApexNav";
import apexHeroBg from "@/assets/apex-hero-bg.png";

const Index = () => {
  return (
    <div className="relative min-h-screen bg-[#050508] overflow-hidden">
      {/* Noise overlay */}
      <div className="noise-overlay" />
      
      {/* Hero Background Image */}
      <div className="absolute inset-0 flex items-center justify-center">
        {/* The majestic APEX image */}
        <motion.div
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 2, ease: [0.16, 1, 0.3, 1] }}
          className="relative w-full h-full flex items-center justify-center"
        >
          <img 
            src={apexHeroBg} 
            alt="APEX Sacred Geometry"
            className="w-auto h-[90vh] md:h-[95vh] object-contain drop-shadow-[0_0_100px_rgba(212,160,32,0.4)]"
          />
        </motion.div>
        
        {/* Radial glow enhancement */}
        <div className="absolute inset-0 bg-gradient-radial from-[#d4a020]/10 via-transparent to-transparent pointer-events-none" />
      </div>
      
      {/* Atmospheric overlays */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Top fade */}
        <div className="absolute top-0 left-0 right-0 h-48 bg-gradient-to-b from-[#050508] via-[#050508]/50 to-transparent" />
        
        {/* Bottom fade for text readability */}
        <div className="absolute bottom-0 left-0 right-0 h-96 bg-gradient-to-t from-[#050508] via-[#050508]/80 to-transparent" />
        
        {/* Side vignettes */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_40%,rgba(5,5,8,0.7)_100%)]" />
      </div>
      
      {/* Navigation */}
      <ApexNav />
      
      {/* Main Content - Bottom positioned */}
      <main className="relative z-10 flex min-h-screen flex-col items-center justify-end px-6 pb-12 md:pb-20">
        <div className="max-w-4xl mx-auto text-center">
          {/* Hero Statement */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, delay: 1, ease: [0.16, 1, 0.3, 1] }}
          >
            <h1 className="text-xl md:text-3xl lg:text-4xl xl:text-5xl font-extralight text-foreground leading-[1.5] tracking-wide mb-8">
              Truth does not need to be sold.
              <br />
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1, delay: 1.8 }}
                className="font-medium text-gradient-gold"
              >
                It just sells.
              </motion.span>
            </h1>
          </motion.div>
          
          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 1.4, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col items-center gap-6"
          >
            <Link to="/commons">
              <ApexButton variant="primary" size="lg" className="min-w-[220px] text-base tracking-[0.3em] px-12 py-5">
                ENTER
              </ApexButton>
            </Link>
            
            <Link to="/commons#system-map">
              <motion.span 
                className="text-sm text-muted-foreground hover:text-primary transition-all duration-500 tracking-[0.25em] uppercase"
                whileHover={{ y: -2 }}
              >
                View the System Map
              </motion.span>
            </Link>
          </motion.div>
        </div>
      </main>
      
      {/* Animated particles effect using CSS */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {Array.from({ length: 20 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-primary/60 rounded-full"
            initial={{ 
              x: Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1000),
              y: Math.random() * (typeof window !== 'undefined' ? window.innerHeight : 800),
              opacity: 0 
            }}
            animate={{ 
              y: [null, Math.random() * -200 - 100],
              opacity: [0, 0.8, 0],
            }}
            transition={{
              duration: 4 + Math.random() * 4,
              repeat: Infinity,
              delay: Math.random() * 4,
              ease: "easeOut"
            }}
            style={{
              left: `${Math.random() * 100}%`,
              top: `${50 + Math.random() * 50}%`,
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default Index;

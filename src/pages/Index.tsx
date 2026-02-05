import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ApexButton } from "@/components/ui/apex-button";
import CosmicBackground from "@/components/3d/CosmicBackground";
import ApexNav from "@/components/layout/ApexNav";
import apexLogo from "@/assets/apex-logo.png";

const Index = () => {
  return (
    <div className="relative min-h-screen bg-background overflow-hidden">
      {/* Noise overlay */}
      <div className="noise-overlay" />
      
      {/* Enhanced 3D Cosmic Background */}
      <CosmicBackground />
      
      {/* Navigation */}
      <ApexNav />
      
      {/* Main Content */}
      <main className="relative z-10 flex min-h-screen flex-col items-center justify-center px-6">
        <div className="max-w-4xl mx-auto text-center">
          {/* Ethereal Logo with enhanced glow */}
          <motion.div
            initial={{ opacity: 0, scale: 0.6, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 1.5, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="mb-10 relative"
          >
            {/* Logo glow layers */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-64 h-64 md:w-80 md:h-80 bg-gradient-radial from-primary/40 via-primary/10 to-transparent blur-[60px] animate-pulse-subtle" />
            </div>
            <img 
              src={apexLogo} 
              alt="APEX" 
              className="h-40 md:h-56 lg:h-64 w-auto mx-auto object-contain relative z-10 drop-shadow-[0_0_80px_rgba(212,160,32,0.6)] animate-sacred-pulse"
            />
          </motion.div>

          {/* Hero Statement */}
          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="text-3xl md:text-5xl lg:text-6xl font-bold text-foreground leading-[1.15] tracking-tight mb-6"
          >
            Truth does not need
            <br />
            to be sold.
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 1.6 }}
              className="text-gradient-gold"
            >
              {" "}It just sells.
            </motion.span>
          </motion.h1>
          
          {/* Subtext */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.2, ease: [0.16, 1, 0.3, 1] }}
            className="text-base md:text-lg text-muted-foreground max-w-xl mx-auto mb-10 tracking-wide"
          >
            A private system for verified signals, monitoring, and leveraged partnerships.
          </motion.p>
          
          {/* CTA Buttons with enhanced styling */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.4, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col sm:flex-row items-center justify-center gap-5"
          >
            <Link to="/commons">
              <ApexButton variant="primary" size="lg" className="min-w-[160px]">
                Enter
              </ApexButton>
            </Link>
            
            <Link to="/commons#system-map">
              <ApexButton variant="ghost" size="default">
                View the System Map
              </ApexButton>
            </Link>
          </motion.div>
        </div>
        
        {/* Animated scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 2 }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2"
        >
          <div className="w-px h-14 bg-gradient-to-b from-transparent via-primary/50 to-transparent animate-pulse-subtle" />
        </motion.div>
      </main>
    </div>
  );
};

export default Index;

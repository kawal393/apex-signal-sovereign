import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ApexButton } from "@/components/ui/apex-button";
import ApexBackground from "@/components/ApexBackground";
import ApexNav from "@/components/layout/ApexNav";
import apexLogo from "@/assets/apex-logo.png";

const Index = () => {
  return (
    <div className="relative min-h-screen bg-background overflow-hidden">
      {/* Noise overlay */}
      <div className="noise-overlay" />
      
      {/* 3D Background */}
      <ApexBackground />
      
      {/* Navigation */}
      <ApexNav />
      
      {/* Main Content */}
      <main className="relative z-10 flex min-h-screen flex-col items-center justify-center px-6">
        <div className="max-w-4xl mx-auto text-center">
          {/* Ethereal Logo */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.2, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="mb-12"
          >
            <img 
              src={apexLogo} 
              alt="APEX" 
              className="h-48 md:h-64 lg:h-72 w-auto mx-auto object-contain drop-shadow-[0_0_60px_rgba(212,160,32,0.5)] animate-sacred-pulse"
            />
          </motion.div>

          {/* Hero Statement */}
          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="text-4xl md:text-6xl lg:text-7xl font-bold text-foreground leading-[1.1] tracking-tight mb-8"
          >
            Truth does not need
            <br />
            to be sold.
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 1.4 }}
              className="text-gradient-gold"
            >
              {" "}It just sells.
            </motion.span>
          </motion.h1>
          
          {/* Subtext */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1, ease: [0.16, 1, 0.3, 1] }}
            className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-12 tracking-wide"
          >
            A private system for verified signals, monitoring, and leveraged partnerships.
          </motion.p>
          
          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.2, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col sm:flex-row items-center justify-center gap-6"
          >
            <Link to="/commons">
              <ApexButton variant="primary" size="lg">
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
        
        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 1.8 }}
          className="absolute bottom-12 left-1/2 -translate-x-1/2"
        >
          <div className="w-px h-16 bg-gradient-to-b from-transparent via-primary/40 to-transparent" />
        </motion.div>
      </main>
    </div>
  );
};

export default Index;

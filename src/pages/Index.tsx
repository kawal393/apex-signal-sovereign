import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Suspense, lazy } from "react";
import { ApexButton } from "@/components/ui/apex-button";
import ApexNav from "@/components/layout/ApexNav";
import apexLogo from "@/assets/apex-logo.png";

const UltimateGateBackground = lazy(() => import("@/components/3d/UltimateGateBackground"));

const Index = () => {
  return (
    <div className="relative min-h-screen bg-[#050508] overflow-hidden">
      {/* Noise overlay */}
      <div className="noise-overlay" />
      
      {/* 3D Gate Background - Sacred Pyramid with Portal Frame & Logo */}
      <Suspense fallback={null}>
        <UltimateGateBackground />
      </Suspense>
      
      {/* Navigation */}
      <ApexNav />
      
      {/* Main Content */}
      <main className="relative z-10 flex min-h-screen flex-col items-center justify-end px-6 pb-16 md:pb-24">
        <div className="max-w-4xl mx-auto text-center">
          {/* Small logo accent */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.2, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="mb-6"
          >
            <img 
              src={apexLogo} 
              alt="APEX" 
              className="h-14 md:h-20 w-auto mx-auto opacity-80 drop-shadow-[0_0_40px_rgba(212,160,32,0.5)]" 
            />
          </motion.div>

          {/* Hero Statement */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
          >
            <h1 className="text-2xl md:text-4xl lg:text-5xl xl:text-6xl font-extralight text-foreground leading-[1.4] tracking-wide mb-10">
              Truth does not need to be sold.
              <br />
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1, delay: 1.4 }}
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
            transition={{ duration: 1, delay: 1, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col items-center gap-8"
          >
            <Link to="/commons">
              <ApexButton variant="primary" size="lg" className="min-w-[200px] text-base tracking-[0.25em] px-10 py-4">
                ENTER
              </ApexButton>
            </Link>
            
            <Link to="/commons#system-map">
              <motion.span 
                className="text-sm text-muted-foreground hover:text-primary transition-all duration-500 tracking-[0.2em] uppercase"
                whileHover={{ y: -2 }}
              >
                View the System Map
              </motion.span>
            </Link>
          </motion.div>
        </div>
      </main>
      
      {/* Bottom decorative line */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-32 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
    </div>
  );
};

export default Index;

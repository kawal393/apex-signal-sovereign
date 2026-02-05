import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Suspense, lazy } from "react";
import { ApexButton } from "@/components/ui/apex-button";
import ApexNav from "@/components/layout/ApexNav";
import apexLogo from "@/assets/apex-logo.png";

const GateBackground = lazy(() => import("@/components/3d/GateBackground"));

const Index = () => {
  return (
    <div className="relative min-h-screen bg-[#050508] overflow-hidden">
      {/* Noise overlay */}
      <div className="noise-overlay" />
      
      {/* 3D Gate Background - Sacred Pyramid with Portal Frame */}
      <Suspense fallback={null}>
        <GateBackground />
      </Suspense>
      
      {/* Navigation */}
      <ApexNav />
      
      {/* Main Content */}
      <main className="relative z-10 flex min-h-screen flex-col items-center justify-center px-6">
        <div className="max-w-3xl mx-auto text-center">
          {/* Logo - hidden since pyramid is the hero */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0 }}
            className="hidden"
          >
            <img src={apexLogo} alt="APEX" className="h-32 w-auto mx-auto" />
          </motion.div>

          {/* Hero Statement - positioned below the 3D pyramid */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="mt-[45vh]"
          >
            <h1 className="text-2xl md:text-4xl lg:text-5xl font-light text-foreground leading-[1.3] tracking-wide mb-8">
              Truth does not need to be sold.
              <br />
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8, delay: 1.4 }}
                className="font-medium text-gradient-gold"
              >
                It just sells.
              </motion.span>
            </h1>
          </motion.div>
          
          {/* CTA Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.2, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col items-center gap-6"
          >
            <Link to="/commons">
              <ApexButton variant="primary" size="lg" className="min-w-[180px] text-base tracking-[0.2em]">
                ENTER
              </ApexButton>
            </Link>
            
            <Link to="/commons#system-map">
              <span className="text-sm text-muted-foreground hover:text-primary transition-colors tracking-wider">
                View the System Map
              </span>
            </Link>
          </motion.div>
        </div>
      </main>
    </div>
  );
};

export default Index;

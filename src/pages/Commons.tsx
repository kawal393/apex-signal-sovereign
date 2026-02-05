import { motion } from "framer-motion";
import { Suspense, lazy } from "react";
import ApexNav from "@/components/layout/ApexNav";
import ApexFooter from "@/components/layout/ApexFooter";
import SystemMap from "@/components/sections/SystemMap";
import FeaturedNodes from "@/components/sections/FeaturedNodes";
import AccessTiers from "@/components/sections/AccessTiers";
import CommonsCTA from "@/components/sections/CommonsCTA";
import apexLogo from "@/assets/apex-logo.png";

const TempleBackground = lazy(() => import("@/components/3d/TempleBackground"));

const Commons = () => {
  return (
    <div className="relative min-h-screen bg-background">
      {/* Noise overlay */}
      <div className="noise-overlay" />
      
      {/* 3D Temple Background for header */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <Suspense fallback={null}>
          <TempleBackground />
        </Suspense>
      </div>
      
      {/* Navigation */}
      <ApexNav />
      
      {/* Main Content */}
      <main className="relative z-10 pt-32">
        {/* Page Header with enhanced effects */}
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="px-6 pb-24 border-b border-border relative"
        >
          {/* Header glow */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-gradient-radial from-primary/15 to-transparent blur-[80px]" />
          </div>
          
          <div className="max-w-7xl mx-auto relative z-10">
            <div className="flex items-start gap-8 flex-col md:flex-row md:items-center">
              {/* Mini logo with glow */}
              <motion.div 
                className="relative"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <div className="absolute inset-0 bg-gradient-radial from-primary/30 to-transparent blur-[30px]" />
                <img 
                  src={apexLogo} 
                  alt="APEX" 
                  className="h-20 w-auto object-contain relative z-10 drop-shadow-[0_0_40px_rgba(212,160,32,0.5)]"
                />
              </motion.div>
              
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-2 h-2 rounded-full bg-status-active animate-pulse shadow-[0_0_15px_rgba(212,160,32,0.8)]" />
                  <span className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
                    Public Portal
                  </span>
                </div>
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground tracking-tight">
                  The Commons
                </h1>
                <p className="mt-4 text-lg text-muted-foreground max-w-xl">
                  Operational intelligence infrastructure. Real-time signal monitoring.
                </p>
              </div>
            </div>
          </div>
        </motion.section>
        
        {/* System Map with 3D Network */}
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

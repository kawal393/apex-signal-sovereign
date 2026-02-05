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
    <div className="relative min-h-screen bg-[#050508]">
      {/* Noise overlay */}
      <div className="noise-overlay" />
      
      {/* Navigation */}
      <ApexNav />
      
      {/* Main Content */}
      <main className="relative z-10 pt-24">
        {/* Hero Header with Temple Background */}
        <section className="relative min-h-[70vh] flex items-center justify-center overflow-hidden border-b border-border">
          {/* 3D Temple Background */}
          <div className="absolute inset-0">
            <Suspense fallback={null}>
              <TempleBackground />
            </Suspense>
          </div>
          
          {/* Content overlay */}
          <div className="relative z-10 text-center px-6 py-20">
            {/* Logo with glow */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="mb-8 relative"
            >
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-48 h-48 bg-gradient-radial from-primary/40 to-transparent blur-[50px]" />
              </div>
              <img 
                src={apexLogo} 
                alt="APEX" 
                className="h-28 md:h-36 w-auto mx-auto relative z-10 drop-shadow-[0_0_50px_rgba(212,160,32,0.6)]"
              />
            </motion.div>
            
            {/* Title */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <h1 className="text-3xl md:text-5xl font-light text-foreground tracking-wide mb-4">
                APEX <span className="text-muted-foreground">—</span>{" "}
                <span className="text-gradient-gold font-medium">Infrastructure of Truth.</span>
              </h1>
            </motion.div>
            
            {/* Category chips - like reference */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="flex flex-wrap items-center justify-center gap-3 mt-8"
            >
              {[
                { label: "INTELLIGENCE", color: "primary" },
                { label: "ACCESS", color: "destructive" },
                { label: "EQUITY", color: "destructive" },
              ].map((chip, i) => (
                <div
                  key={chip.label}
                  className={`px-5 py-2 glass-card text-xs uppercase tracking-[0.2em] font-medium flex items-center gap-2
                    ${chip.color === "primary" ? "text-primary border-primary/30" : "text-[#e07040] border-[#e07040]/30"}
                  `}
                >
                  {chip.color === "destructive" && (
                    <span className="text-[#e07040]">♥</span>
                  )}
                  {chip.label}
                  {chip.color === "primary" && (
                    <span className="text-primary">▸</span>
                  )}
                </div>
              ))}
            </motion.div>
          </div>
          
          {/* Bottom gradient fade */}
          <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#050508] to-transparent" />
        </section>
        
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

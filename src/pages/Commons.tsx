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
        {/* Hero Header with Temple Background & Ethereal Logo */}
        <section className="relative min-h-[80vh] flex items-center justify-center overflow-hidden border-b border-border/30">
          {/* 3D Temple Background */}
          <div className="absolute inset-0">
            <Suspense fallback={null}>
              <TempleBackground />
            </Suspense>
          </div>
          
          {/* Ethereal logo in background */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <motion.img
              src={apexLogo}
              alt=""
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 0.06, scale: 1 }}
              transition={{ duration: 2 }}
              className="w-[600px] md:w-[900px] h-auto blur-sm"
            />
          </div>
          
          {/* Radial glow behind content */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-radial from-[#d4a020]/15 via-[#d4a020]/5 to-transparent blur-[60px] pointer-events-none" />
          
          {/* Content overlay */}
          <div className="relative z-10 text-center px-6 py-24">
            {/* Main Logo with intense glow */}
            <motion.div
              initial={{ opacity: 0, scale: 0.85, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
              className="mb-10 relative"
            >
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-64 h-64 bg-gradient-radial from-primary/50 to-transparent blur-[80px] animate-pulse-subtle" />
              </div>
              <img 
                src={apexLogo} 
                alt="APEX" 
                className="h-32 md:h-44 w-auto mx-auto relative z-10 drop-shadow-[0_0_80px_rgba(212,160,32,0.7)]"
              />
            </motion.div>
            
            {/* Title */}
            <motion.div
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              <h1 className="text-3xl md:text-5xl lg:text-6xl font-extralight text-foreground tracking-wide mb-5">
                APEX <span className="text-muted-foreground/50">—</span>{" "}
                <span className="text-gradient-gold font-medium">Infrastructure of Truth.</span>
              </h1>
            </motion.div>
            
            {/* Category chips */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.6 }}
              className="flex flex-wrap items-center justify-center gap-4 mt-10"
            >
              {[
                { label: "INTELLIGENCE", color: "primary", icon: "▸" },
                { label: "ACCESS", color: "accent", icon: "♦" },
                { label: "EQUITY", color: "accent", icon: "♥" },
              ].map((chip) => (
                <motion.div
                  key={chip.label}
                  whileHover={{ scale: 1.05, y: -2 }}
                  transition={{ type: "spring", stiffness: 400 }}
                  className={`px-6 py-3 glass-card text-xs uppercase tracking-[0.25em] font-medium flex items-center gap-3 cursor-default
                    ${chip.color === "primary" 
                      ? "text-primary border-primary/40 shadow-[0_0_25px_rgba(212,160,32,0.2)]" 
                      : "text-[#e07040] border-[#e07040]/30 shadow-[0_0_20px_rgba(224,112,64,0.15)]"}
                  `}
                >
                  <span className={chip.color === "primary" ? "text-primary" : "text-[#e07040]"}>
                    {chip.icon}
                  </span>
                  {chip.label}
                </motion.div>
              ))}
            </motion.div>
          </div>
          
          {/* Bottom gradient fade */}
          <div className="absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-t from-[#050508] via-[#050508]/60 to-transparent" />
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

import { motion } from "framer-motion";
import { Suspense, lazy } from "react";
import ApexNav from "@/components/layout/ApexNav";
import ApexFooter from "@/components/layout/ApexFooter";
import SystemMap from "@/components/sections/SystemMap";
import FeaturedNodes from "@/components/sections/FeaturedNodes";
import AccessTiers from "@/components/sections/AccessTiers";
import CommonsCTA from "@/components/sections/CommonsCTA";
import apexHeroBg from "@/assets/apex-hero-bg.png";

const Commons = () => {
  return (
    <div className="relative min-h-screen bg-[#050508]">
      {/* Noise overlay */}
      <div className="noise-overlay" />
      
      {/* Navigation */}
      <ApexNav />
      
      {/* Main Content */}
      <main className="relative z-10 pt-24">
        {/* Hero Header with APEX Background */}
        <section className="relative min-h-[85vh] flex items-center justify-center overflow-hidden border-b border-border/20">
          {/* Hero Background Image */}
          <div className="absolute inset-0 flex items-center justify-center">
            <motion.img
              src={apexHeroBg}
              alt=""
              initial={{ opacity: 0, scale: 1.05 }}
              animate={{ opacity: 0.7, scale: 1 }}
              transition={{ duration: 1.5 }}
              className="w-auto h-[80vh] object-contain"
            />
            
            {/* Glow enhancement */}
            <div className="absolute inset-0 bg-gradient-radial from-[#d4a020]/15 via-transparent to-transparent" />
          </div>
          
          {/* Atmospheric overlays */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-[#050508] to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 h-64 bg-gradient-to-t from-[#050508] via-[#050508]/70 to-transparent" />
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_30%,rgba(5,5,8,0.6)_100%)]" />
          </div>
          
          {/* Content overlay */}
          <div className="relative z-10 text-center px-6 py-24 mt-32">
            {/* Title */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
            >
              <h1 className="text-3xl md:text-5xl lg:text-6xl font-extralight text-foreground tracking-wide mb-6">
                <span className="text-gradient-gold font-medium">Infrastructure of Truth.</span>
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground font-light max-w-2xl mx-auto">
                Enter the commons. Access sovereign intelligence.
              </p>
            </motion.div>
            
            {/* Category chips */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.8 }}
              className="flex flex-wrap items-center justify-center gap-4 mt-12"
            >
              {[
                { label: "INTELLIGENCE", color: "primary", icon: "◆" },
                { label: "ACCESS", color: "accent", icon: "◈" },
                { label: "EQUITY", color: "accent", icon: "◇" },
              ].map((chip) => (
                <motion.div
                  key={chip.label}
                  whileHover={{ scale: 1.05, y: -2 }}
                  transition={{ type: "spring", stiffness: 400 }}
                  className={`px-6 py-3 glass-card text-xs uppercase tracking-[0.3em] font-semibold flex items-center gap-3 cursor-default
                    ${chip.color === "primary" 
                      ? "text-primary border-primary/50 shadow-[0_0_30px_rgba(212,160,32,0.25)]" 
                      : "text-[#e07040] border-[#e07040]/40 shadow-[0_0_25px_rgba(224,112,64,0.2)]"}
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

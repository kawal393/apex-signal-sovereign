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
    <div className="relative min-h-screen bg-[hsl(260,20%,2%)]">
      {/* Dimensional base */}
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_100%_100%_at_50%_0%,hsl(260,25%,6%),transparent)]" />
      
      {/* Noise overlay */}
      <div className="noise-overlay" />
      
      {/* Navigation */}
      <ApexNav />
      
      {/* Main Content */}
      <main className="relative z-10 pt-24">
        {/* Hero Header */}
        <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden border-b border-border/30">
          {/* Multi-layer background */}
          <div className="absolute inset-0">
            {/* Portal rings */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] portal-ring opacity-15" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[750px] h-[750px] portal-ring opacity-8" style={{ animationDelay: '1.5s' }} />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[1000px] portal-ring opacity-5" style={{ animationDelay: '3s' }} />
          </div>
          
          {/* Hero Background Image */}
          <div className="absolute inset-0 flex items-center justify-center">
            <motion.img
              src={apexHeroBg}
              alt=""
              initial={{ opacity: 0, scale: 1.1, filter: 'blur(15px)' }}
              animate={{ opacity: 0.8, scale: 1, filter: 'blur(0px)' }}
              transition={{ duration: 2 }}
              className="w-auto h-[75vh] object-contain animate-pulse-subtle"
              style={{
                filter: 'drop-shadow(0 0 100px hsl(42 100% 55% / 0.4)) drop-shadow(0 0 200px hsl(35 90% 50% / 0.2))',
              }}
            />
            
            {/* Layered glows */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_45%,hsl(42,100%,60%,0.2),transparent_45%)]" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,hsl(35,95%,50%,0.12),transparent_35%)]" />
          </div>
          
          {/* Atmospheric overlays */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-0 left-0 right-0 h-40 bg-gradient-to-b from-[hsl(260,20%,2%)] to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 h-80 bg-gradient-to-t from-[hsl(260,20%,2%)] via-[hsl(260,20%,2%,0.8)] to-transparent" />
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_25%,hsl(260,20%,2%,0.6)_70%)]" />
          </div>
          
          {/* Floating particles */}
          <div className="particles-container">
            {Array.from({ length: 20 }).map((_, i) => (
              <motion.div
                key={i}
                className="particle"
                initial={{ 
                  x: Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1000),
                  y: typeof window !== 'undefined' ? window.innerHeight : 900,
                  opacity: 0 
                }}
                animate={{ 
                  y: -100,
                  opacity: [0, 0.8, 0.8, 0],
                }}
                transition={{
                  duration: 7 + Math.random() * 5,
                  repeat: Infinity,
                  delay: Math.random() * 6,
                  ease: "linear"
                }}
                style={{
                  left: `${Math.random() * 100}%`,
                }}
              />
            ))}
          </div>
          
          {/* Content overlay */}
          <div className="relative z-10 text-center px-6 py-24 mt-16">
            {/* Title */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.5 }}
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
                  whileHover={{ scale: 1.05, y: -3 }}
                  transition={{ type: "spring", stiffness: 400 }}
                  className={`px-6 py-3 glass-card text-xs uppercase tracking-[0.3em] font-semibold flex items-center gap-3 cursor-default
                    ${chip.color === "primary" 
                      ? "text-primary border-primary/40" 
                      : "text-[hsl(28,90%,60%)] border-[hsl(28,90%,60%,0.3)]"}
                  `}
                  style={{
                    boxShadow: chip.color === "primary" 
                      ? '0 0 30px hsl(42 90% 55% / 0.2), inset 0 1px 0 hsl(42 90% 55% / 0.1)'
                      : '0 0 25px hsl(28 90% 55% / 0.15), inset 0 1px 0 hsl(28 90% 55% / 0.08)'
                  }}
                >
                  <span className={chip.color === "primary" ? "text-primary" : "text-[hsl(28,90%,60%)]"}>
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

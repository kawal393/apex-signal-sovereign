import { motion } from "framer-motion";
import ApexNav from "@/components/layout/ApexNav";
import ApexFooter from "@/components/layout/ApexFooter";
import SystemMap from "@/components/sections/SystemMap";
import FeaturedNodes from "@/components/sections/FeaturedNodes";
import AccessTiers from "@/components/sections/AccessTiers";
import CommonsCTA from "@/components/sections/CommonsCTA";
import apexLogo from "@/assets/apex-logo.png";

const Commons = () => {
  return (
    <div className="relative min-h-screen bg-background">
      {/* Noise overlay */}
      <div className="noise-overlay" />
      
      {/* Ambient background glow */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-gradient-to-b from-primary/8 to-transparent blur-[100px]" />
        <div className="absolute bottom-0 left-1/4 w-[600px] h-[400px] bg-gradient-to-t from-primary/5 to-transparent blur-[80px]" />
      </div>
      
      {/* Navigation */}
      <ApexNav />
      
      {/* Main Content */}
      <main className="relative z-10 pt-32">
        {/* Page Header */}
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="px-6 pb-24 border-b border-border"
        >
          <div className="max-w-7xl mx-auto">
            <div className="flex items-start gap-8 flex-col md:flex-row md:items-center">
              {/* Mini logo */}
              <motion.img 
                src={apexLogo} 
                alt="APEX" 
                className="h-24 w-auto object-contain drop-shadow-[0_0_30px_rgba(212,160,32,0.4)]"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              />
              
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-2 h-2 rounded-full bg-primary animate-pulse shadow-[0_0_10px_rgba(212,160,32,0.6)]" />
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
        
        {/* System Map */}
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

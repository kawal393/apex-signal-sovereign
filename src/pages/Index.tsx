import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ApexButton } from "@/components/ui/apex-button";
import ApexNav from "@/components/layout/ApexNav";
import apexHeroBg from "@/assets/apex-hero-bg.png";

const Index = () => {
  return (
    <div className="relative min-h-screen bg-[hsl(260,20%,2%)] overflow-hidden">
      {/* Dimensional base layers */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_120%_80%_at_50%_-20%,hsl(260,25%,8%),transparent)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_120%_at_50%_120%,hsl(260,20%,6%),transparent)]" />
      
      {/* Noise overlay */}
      <div className="noise-overlay" />
      
      {/* Portal rings - ethereal depth */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] portal-ring opacity-20" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[900px] portal-ring opacity-10" style={{ animationDelay: '2s' }} />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1200px] h-[1200px] portal-ring opacity-5" style={{ animationDelay: '4s' }} />
      
      {/* Hero Background Image - Sacred Geometry */}
      <div className="absolute inset-0 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 1.15, filter: 'blur(20px)' }}
          animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
          transition={{ duration: 2.5, ease: [0.16, 1, 0.3, 1] }}
          className="relative w-full h-full flex items-center justify-center"
        >
          <img 
            src={apexHeroBg} 
            alt="APEX Sacred Geometry"
            className="w-auto h-[85vh] md:h-[95vh] object-contain animate-pulse-subtle"
            style={{
              filter: 'drop-shadow(0 0 80px hsl(42 100% 55% / 0.5)) drop-shadow(0 0 150px hsl(35 90% 50% / 0.3))',
            }}
          />
        </motion.div>
        
        {/* Multi-layer radial glow */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,hsl(42,100%,60%,0.2),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_45%,hsl(35,95%,50%,0.15),transparent_40%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_35%,hsl(45,100%,70%,0.1),transparent_30%)]" />
      </div>
      
      {/* Atmospheric depth layers */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Top dimensional fade */}
        <div className="absolute top-0 left-0 right-0 h-64 bg-gradient-to-b from-[hsl(260,20%,2%)] via-[hsl(260,20%,2%,0.5)] to-transparent" />
        
        {/* Bottom ethereal fade */}
        <div className="absolute bottom-0 left-0 right-0 h-[500px] bg-gradient-to-t from-[hsl(260,20%,2%)] via-[hsl(260,20%,2%,0.85)] to-transparent" />
        
        {/* Side dimensional vignettes */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_30%,hsl(260,20%,2%,0.7)_70%,hsl(260,20%,2%,0.95)_100%)]" />
        
        {/* Golden light rays from center */}
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[2px] h-[40vh] bg-gradient-to-b from-[hsl(42,100%,60%,0.3)] to-transparent opacity-60" />
      </div>
      
      {/* Floating particles */}
      <div className="particles-container">
        {Array.from({ length: 30 }).map((_, i) => (
          <motion.div
            key={i}
            className="particle"
            initial={{ 
              x: Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1000),
              y: typeof window !== 'undefined' ? window.innerHeight + 50 : 900,
              opacity: 0 
            }}
            animate={{ 
              y: -100,
              opacity: [0, 1, 1, 0],
            }}
            transition={{
              duration: 6 + Math.random() * 6,
              repeat: Infinity,
              delay: Math.random() * 8,
              ease: "linear"
            }}
            style={{
              left: `${Math.random() * 100}%`,
              width: `${1 + Math.random() * 2}px`,
              height: `${1 + Math.random() * 2}px`,
            }}
          />
        ))}
      </div>
      
      {/* Navigation */}
      <ApexNav />
      
      {/* Main Content */}
      <main className="relative z-10 flex min-h-screen flex-col items-center justify-end px-6 pb-16 md:pb-24">
        <div className="max-w-4xl mx-auto text-center">
          {/* Hero Statement */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.5, delay: 1.2, ease: [0.16, 1, 0.3, 1] }}
          >
            <h1 className="text-2xl md:text-4xl lg:text-5xl xl:text-6xl font-extralight text-foreground leading-[1.4] tracking-wide mb-10">
              Truth does not need to be sold.
              <br />
              <motion.span
                initial={{ opacity: 0, filter: 'blur(10px)' }}
                animate={{ opacity: 1, filter: 'blur(0px)' }}
                transition={{ duration: 1.2, delay: 2 }}
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
            transition={{ duration: 1, delay: 1.8, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col items-center gap-8"
          >
            <Link to="/commons">
              <ApexButton variant="primary" size="lg" className="min-w-[200px] text-base tracking-[0.25em] px-10 py-4 border-glow">
                ENTER
              </ApexButton>
            </Link>
            
            <Link to="/commons#system-map">
              <motion.span 
                className="text-sm text-muted-foreground hover:text-primary transition-all duration-700 tracking-[0.2em] uppercase"
                whileHover={{ y: -3, textShadow: '0 0 20px hsl(42 90% 55% / 0.5)' }}
              >
                View the System Map
              </motion.span>
            </Link>
          </motion.div>
        </div>
      </main>
      
      {/* Bottom ethereal accent */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-48 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent" />
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 w-24 h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent" />
    </div>
  );
};

export default Index;

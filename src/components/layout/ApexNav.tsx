import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import apexLogo from "@/assets/apex-logo.png";

const navItems = [
  { label: "System", href: "/commons#system-map" },
  { label: "Nodes", href: "/commons#featured-nodes" },
  { label: "Access", href: "/commons#access-tiers" },
];

export default function ApexNav() {
  const location = useLocation();
  const isGate = location.pathname === "/";

  return (
    <motion.nav
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.3 }}
      className="fixed top-0 left-0 right-0 z-50 px-6 py-6"
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* MASSIVE SOVEREIGN LOGO */}
        <Link to="/" className="flex items-center gap-4 group">
          <motion.div 
            className="relative"
            whileHover={{ scale: 1.08 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          >
            {/* Logo glow layers */}
            <motion.div
              className="absolute inset-0 blur-2xl opacity-50"
              animate={{ 
                opacity: [0.3, 0.6, 0.3],
                scale: [1, 1.1, 1],
              }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            >
              <img 
                src={apexLogo} 
                alt="" 
                className="h-20 w-auto object-contain"
                style={{ filter: 'brightness(2)' }}
              />
            </motion.div>
            
            {/* Main logo - MASSIVE */}
            <motion.img 
              src={apexLogo} 
              alt="APEX" 
              className="h-20 w-auto object-contain logo-sovereign relative z-10"
              animate={{
                filter: [
                  'drop-shadow(0 0 30px hsl(42 100% 55% / 0.5)) drop-shadow(0 0 60px hsl(42 100% 55% / 0.3))',
                  'drop-shadow(0 0 50px hsl(42 100% 55% / 0.7)) drop-shadow(0 0 100px hsl(42 100% 55% / 0.4))',
                  'drop-shadow(0 0 30px hsl(42 100% 55% / 0.5)) drop-shadow(0 0 60px hsl(42 100% 55% / 0.3))',
                ]
              }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            />
            
            {/* Purple accent glow */}
            <motion.div
              className="absolute -inset-4 rounded-full opacity-20"
              style={{
                background: 'radial-gradient(circle, hsl(280 60% 50% / 0.3) 0%, transparent 70%)',
              }}
              animate={{ opacity: [0.1, 0.25, 0.1] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
            />
          </motion.div>
        </Link>

        {/* Nav Links - Hidden on Gate */}
        {!isGate && (
          <div className="hidden md:flex items-center gap-10">
            {navItems.map((item, i) => (
              <motion.a
                key={item.label}
                href={item.href}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 + i * 0.1 }}
                className={cn(
                  "text-[10px] uppercase tracking-[0.25em] text-grey-400 hover:text-gold transition-all duration-500",
                  "relative group"
                )}
              >
                {item.label}
                <span className="absolute -bottom-1 left-0 w-0 h-px bg-gradient-to-r from-gold to-gold-ember group-hover:w-full transition-all duration-500" />
              </motion.a>
            ))}
          </div>
        )}

        {/* Gate indicator */}
        {isGate && (
          <motion.div 
            className="flex items-center gap-3 text-[10px] uppercase tracking-[0.3em] text-grey-500"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
          >
            <motion.span 
              className="text-gold"
              animate={{ opacity: [0.3, 1, 0.3] }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              ●
            </motion.span>
            <span className="text-grey-400">Sovereign System</span>
          </motion.div>
        )}
      </div>
    </motion.nav>
  );
}
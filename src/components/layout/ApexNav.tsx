import { forwardRef } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import apexLogo from "@/assets/apex-logo.png";

const navItems = [
  { label: "Portal", href: "/commons" },
  { label: "Nodes", href: "/nodes" },
  { label: "Infrastructure", href: "/infrastructure" },
  { label: "Manifesto", href: "/manifesto" },
  { label: "Request Access", href: "/request-access" },
];

const ApexNav = forwardRef<HTMLElement>((_, ref) => {
  const location = useLocation();
  const isGate = location.pathname === "/";

  return (
    <motion.nav
      ref={ref}
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.3 }}
      className="fixed top-0 left-0 right-0 z-50 px-6 py-6 bg-black/50 backdrop-blur-xl border-b border-border/10"
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* SOVEREIGN LOGO */}
        <Link to="/" className="flex items-center gap-4 group">
          <motion.div 
            className="relative"
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          >
            <motion.img 
              src={apexLogo} 
              alt="APEX" 
              className="h-12 w-auto object-contain logo-sovereign relative z-10"
              animate={{
                filter: [
                  'drop-shadow(0 0 20px hsl(42 100% 55% / 0.4)) drop-shadow(0 0 40px hsl(42 100% 55% / 0.2))',
                  'drop-shadow(0 0 30px hsl(42 100% 55% / 0.5)) drop-shadow(0 0 60px hsl(42 100% 55% / 0.3))',
                  'drop-shadow(0 0 20px hsl(42 100% 55% / 0.4)) drop-shadow(0 0 40px hsl(42 100% 55% / 0.2))',
                ]
              }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            />
          </motion.div>
          <span className="text-sm font-medium text-grey-300 tracking-[0.15em] hidden sm:block">
            APEX INFRASTRUCTURE
          </span>
        </Link>

        {/* Nav Links - Hidden on Gate, shown elsewhere */}
        {!isGate && (
          <div className="hidden lg:flex items-center gap-8">
            {navItems.map((item, i) => (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 + i * 0.08 }}
              >
                <Link
                  to={item.href}
                  className={cn(
                    "text-[10px] uppercase tracking-[0.2em] transition-all duration-500 relative group",
                    location.pathname === item.href 
                      ? "text-primary" 
                      : "text-grey-400 hover:text-grey-200"
                  )}
                >
                  {item.label}
                  <span className={cn(
                    "absolute -bottom-1 left-0 h-px bg-gradient-to-r from-primary to-gold-ember transition-all duration-500",
                    location.pathname === item.href ? "w-full" : "w-0 group-hover:w-full"
                  )} />
                </Link>
              </motion.div>
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
              className="text-primary"
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
});

ApexNav.displayName = "ApexNav";

export default ApexNav;

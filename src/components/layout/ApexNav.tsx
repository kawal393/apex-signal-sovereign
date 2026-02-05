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
      transition={{ duration: 0.6, delay: 0.2 }}
      className="fixed top-0 left-0 right-0 z-50 px-6 py-4"
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-3 group">
          <motion.div 
            className="relative"
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.3 }}
          >
            <img 
              src={apexLogo} 
              alt="APEX" 
              className="h-12 w-auto object-contain drop-shadow-[0_0_15px_rgba(212,160,32,0.4)]"
            />
          </motion.div>
        </Link>

        {/* Nav Links - Hidden on Gate */}
        {!isGate && (
          <div className="hidden md:flex items-center gap-8">
            {navItems.map((item) => (
              <a
                key={item.label}
                href={item.href}
                className={cn(
                  "text-xs uppercase tracking-[0.2em] text-muted-foreground hover:text-primary transition-colors duration-300"
                )}
              >
                {item.label}
              </a>
            ))}
          </div>
        )}

        {/* Gate - Minimal */}
        {isGate && (
          <div className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
            <span className="text-primary/60">●</span>
            <span className="ml-2">Private System</span>
          </div>
        )}
      </div>
    </motion.nav>
  );
}

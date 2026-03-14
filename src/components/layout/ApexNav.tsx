import { forwardRef, useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";
import { ChevronDown } from "lucide-react";
import apexLogo from "@/assets/apex-logo.png";

const standardsItems = [
  { label: "NDIS Integrity Shield", href: "/ndis-watchtower", micro: "July 2026 Registration" },
  { label: "Mining Strategic Choke", href: "/mining-watchtower", micro: "Critical Minerals Registry" },
  { label: "Pharma Sniper", href: "/protocol", micro: "Generic Launch Verification" },
];

const navItems = [
  { label: "Protocol", href: "/protocol", micro: "PSI v1.0" },
  { label: "Standards", href: "#", micro: "Sector Modules", isDropdown: true },
  { label: "Verification Portal", href: "/verify", micro: "Regulator Gateway" },
  { label: "Intelligence", href: "/intelligence", micro: "Command Center" },
  { label: "Governance", href: "/ledger", micro: "Proof Ledger" },
  { label: "Sovereign Partners", href: "/partner", micro: "50/5/4 Covenant", highlight: true },
];

const ApexNav = forwardRef<HTMLElement>((_, ref) => {
  const location = useLocation();
  const isGate = location.pathname === "/";
  const isMobile = useIsMobile();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [standardsOpen, setStandardsOpen] = useState(false);

  useEffect(() => {
    setIsMobileMenuOpen(false);
    setStandardsOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isMobileMenuOpen]);

  return (
    <>
      <motion.nav
        ref={ref}
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.3 }}
        className="fixed top-0 left-0 right-0 z-50 px-6 py-6 bg-black/50 backdrop-blur-xl border-b border-border/10"
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link to="/" className="flex items-center gap-4 group">
            <motion.div className="relative" whileHover={{ scale: 1.05 }} transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}>
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
            <div className="hidden sm:block">
              <span className="text-base font-medium text-grey-300 tracking-[0.15em] block">APEX INFRASTRUCTURE</span>
              <span className="text-[8px] uppercase tracking-[0.2em] text-muted-foreground/50 block">Global Standards Body — PSI Protocol</span>
            </div>
          </Link>

          {/* Desktop Nav */}
          {!isGate && (
            <div className="hidden lg:flex items-center gap-8">
              {navItems.map((item, i) => (
                <motion.div
                  key={item.label}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 + i * 0.08 }}
                  className="relative"
                  onMouseEnter={() => item.isDropdown && setStandardsOpen(true)}
                  onMouseLeave={() => item.isDropdown && setStandardsOpen(false)}
                >
                  {item.isDropdown ? (
                    <button
                      className={cn(
                        "text-[10px] uppercase tracking-[0.2em] transition-all duration-500 relative group flex flex-col items-center gap-0.5",
                        "text-grey-400 hover:text-grey-200"
                      )}
                    >
                      {item.micro && (
                        <span className="text-[7px] tracking-[0.15em] text-grey-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300">{item.micro}</span>
                      )}
                      <span className="flex items-center gap-1">
                        {item.label}
                        <ChevronDown className={cn("w-3 h-3 transition-transform duration-300", standardsOpen && "rotate-180")} />
                      </span>
                    </button>
                  ) : (
                    <Link
                      to={item.href}
                      className={cn(
                        "text-[10px] uppercase tracking-[0.2em] transition-all duration-500 relative group flex flex-col items-center gap-0.5",
                        location.pathname === item.href ? "text-primary" : item.highlight ? "text-primary/90 hover:text-primary font-semibold" : "text-grey-400 hover:text-grey-200"
                      )}
                      style={item.highlight ? { textShadow: '0 0 12px hsl(42 95% 55% / 0.4)' } : undefined}
                    >
                      {item.micro && (
                        <span className="text-[7px] tracking-[0.15em] text-grey-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300">{item.micro}</span>
                      )}
                      {item.label}
                      <span className={cn(
                        "absolute -bottom-1 left-0 h-px bg-gradient-to-r from-primary to-gold-ember transition-all duration-500",
                        location.pathname === item.href ? "w-full" : "w-0 group-hover:w-full"
                      )} />
                    </Link>
                  )}

                  {/* Standards Dropdown */}
                  {item.isDropdown && (
                    <AnimatePresence>
                      {standardsOpen && (
                        <motion.div
                          initial={{ opacity: 0, y: 8, scale: 0.95 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: 8, scale: 0.95 }}
                          transition={{ duration: 0.2 }}
                          className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-64 rounded-lg border border-border/20 bg-black/95 backdrop-blur-xl p-2 shadow-2xl"
                        >
                          {standardsItems.map((sub) => (
                            <Link
                              key={sub.label}
                              to={sub.href}
                              className="block px-4 py-3 rounded-md hover:bg-primary/5 transition-colors group"
                            >
                              <span className="text-[10px] uppercase tracking-[0.15em] text-foreground/80 group-hover:text-primary transition-colors block">{sub.label}</span>
                              <span className="text-[8px] uppercase tracking-[0.15em] text-grey-600">{sub.micro}</span>
                            </Link>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  )}
                </motion.div>
              ))}
            </div>
          )}

          {/* Mobile Hamburger */}
          {!isGate && (
            <motion.button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden relative z-[60] w-10 h-10 flex flex-col items-center justify-center gap-1.5"
              aria-label="Toggle menu"
              initial={false}
            >
              <motion.span animate={isMobileMenuOpen ? { rotate: 45, y: 6 } : { rotate: 0, y: 0 }} transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }} className="w-6 h-0.5 bg-foreground/80 block" />
              <motion.span animate={isMobileMenuOpen ? { opacity: 0, scaleX: 0 } : { opacity: 1, scaleX: 1 }} transition={{ duration: 0.2 }} className="w-6 h-0.5 bg-foreground/80 block" />
              <motion.span animate={isMobileMenuOpen ? { rotate: -45, y: -6 } : { rotate: 0, y: 0 }} transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }} className="w-6 h-0.5 bg-foreground/80 block" />
            </motion.button>
          )}

          {/* Gate indicator */}
          {isGate && (
            <motion.div className="flex items-center gap-3 text-[10px] uppercase tracking-[0.3em] text-grey-300" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1 }}>
              <motion.span className="text-primary" animate={{ opacity: [0.3, 1, 0.3] }} transition={{ duration: 3, repeat: Infinity }}>●</motion.span>
              <span className="text-grey-400">Sovereign System</span>
            </motion.div>
          )}
        </div>
      </motion.nav>

      {/* Mobile Full-Screen Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-0 z-[55] bg-black/98 backdrop-blur-2xl lg:hidden"
          >
            <div className="flex flex-col items-center justify-center min-h-screen gap-6 px-6">
              {navItems.map((item, i) => (
                <motion.div key={item.label} initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ delay: 0.1 + i * 0.08, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}>
                  {item.isDropdown ? (
                    <div className="text-center">
                      <button
                        onClick={() => setStandardsOpen(!standardsOpen)}
                        className="text-2xl md:text-3xl font-medium tracking-[0.15em] text-foreground/80 flex items-center gap-2"
                      >
                        {item.label}
                        <ChevronDown className={cn("w-5 h-5 transition-transform", standardsOpen && "rotate-180")} />
                      </button>
                      <AnimatePresence>
                        {standardsOpen && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="overflow-hidden mt-3 space-y-2"
                          >
                            {standardsItems.map((sub) => (
                              <Link
                                key={sub.label}
                                to={sub.href}
                                onClick={() => setIsMobileMenuOpen(false)}
                                className="block text-base text-grey-400 hover:text-primary transition-colors py-1"
                              >
                                {sub.label}
                              </Link>
                            ))}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  ) : (
                    <Link
                      to={item.href}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={cn(
                        "text-2xl md:text-3xl font-medium tracking-[0.15em] transition-all duration-500",
                        location.pathname === item.href ? "text-primary" : item.highlight ? "text-primary/90 font-bold" : "text-foreground/80 hover:text-foreground"
                      )}
                    >
                      {item.label}
                    </Link>
                  )}
                </motion.div>
              ))}

              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }} className="absolute bottom-12 left-0 right-0 text-center">
                <div className="flex items-center justify-center gap-3 text-[10px] uppercase tracking-[0.3em] text-grey-600">
                  <motion.span className="text-primary" animate={{ opacity: [0.3, 1, 0.3] }} transition={{ duration: 3, repeat: Infinity }}>●</motion.span>
                  <span>Sovereign System Active</span>
                </div>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
});

ApexNav.displayName = "ApexNav";
export default ApexNav;

import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import apexLogo from "@/assets/apex-logo.png";

const footerLinks = [
  { label: "Protocol", href: "/protocol" },
  { label: "Ledger", href: "/ledger" },
  { label: "Terms", href: "/terms" },
  { label: "Privacy", href: "/privacy" },
  { label: "Disclaimers", href: "/disclaimers" },
];

export default function ApexFooter() {
  return (
    <motion.footer
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      viewport={{ once: true }}
      className="relative z-10 px-6 py-16 border-t border-border bg-card/30"
    >
      <div className="max-w-7xl mx-auto">
        {/* Main footer row */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-8 mb-8">
          <div className="flex items-center gap-4">
            <img 
              src={apexLogo} 
              alt="APEX" 
              className="h-10 w-auto object-contain drop-shadow-[0_0_10px_rgba(212,160,32,0.3)]"
            />
            <span className="text-sm text-muted-foreground">
              Verified Signal Infrastructure
            </span>
          </div>
          
          <div className="flex items-center gap-2 text-xs text-muted-foreground/60">
            <div className="w-1.5 h-1.5 rounded-full bg-primary/50" />
            <span className="uppercase tracking-widest">System Operational</span>
          </div>
        </div>

        {/* Footer links */}
        <div className="flex flex-wrap items-center justify-center gap-6 md:gap-10 pt-8 border-t border-border/50">
          {footerLinks.map((link) => (
            <Link
              key={link.label}
              to={link.href}
              className="text-[10px] uppercase tracking-[0.2em] text-grey-500 hover:text-grey-300 transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Copyright */}
        <div className="text-center mt-8">
          <p className="text-[10px] text-grey-600 tracking-widest">
            © {new Date().getFullYear()} APEX INFRASTRUCTURE
          </p>
        </div>
      </div>
    </motion.footer>
  );
}

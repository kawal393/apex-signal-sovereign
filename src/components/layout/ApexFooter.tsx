import { motion } from "framer-motion";
import apexLogo from "@/assets/apex-logo.png";

export default function ApexFooter() {
  return (
    <motion.footer
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      viewport={{ once: true }}
      className="relative z-10 px-6 py-16 border-t border-border bg-card/30"
    >
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
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
    </motion.footer>
  );
}

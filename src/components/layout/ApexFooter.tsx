 import { motion } from "framer-motion";
 
 export default function ApexFooter() {
   return (
     <motion.footer
       initial={{ opacity: 0 }}
       whileInView={{ opacity: 1 }}
       transition={{ duration: 0.6 }}
       viewport={{ once: true }}
       className="border-t border-border py-12 px-6"
     >
       <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
         <div className="flex items-center gap-3">
           <div className="w-6 h-6 rounded-sm bg-primary/20 border border-primary/40 flex items-center justify-center">
             <span className="text-primary font-bold text-xs">A</span>
           </div>
           <span className="text-muted-foreground text-sm tracking-wide">
             Apex System — Verified Signal Infrastructure.
           </span>
         </div>
         
         <div className="text-xs text-muted-foreground/60 tracking-wider uppercase">
           © 2025 All Rights Reserved
         </div>
       </div>
     </motion.footer>
   );
 }
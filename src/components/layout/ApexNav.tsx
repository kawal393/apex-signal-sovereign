 import { Link, useLocation } from "react-router-dom";
 import { motion } from "framer-motion";
 import { cn } from "@/lib/utils";
 
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
       className="fixed top-0 left-0 right-0 z-50 px-6 py-6"
     >
       <div className="max-w-7xl mx-auto flex items-center justify-between">
         {/* Logo */}
         <Link to="/" className="flex items-center gap-3 group">
           <div className="w-8 h-8 rounded-sm bg-primary/20 border border-primary/40 flex items-center justify-center group-hover:bg-primary/30 transition-colors">
             <span className="text-primary font-bold text-sm">A</span>
           </div>
           <span className="text-foreground font-semibold tracking-widest text-sm uppercase">
             Apex
           </span>
         </Link>
 
         {/* Nav Links - Hidden on Gate */}
         {!isGate && (
           <div className="hidden md:flex items-center gap-8">
             {navItems.map((item) => (
               <a
                 key={item.label}
                 href={item.href}
                 className={cn(
                   "text-xs uppercase tracking-[0.2em] text-muted-foreground hover:text-foreground transition-colors duration-300"
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
             Private System
           </div>
         )}
       </div>
     </motion.nav>
   );
 }
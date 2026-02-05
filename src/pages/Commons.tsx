 import { motion } from "framer-motion";
 import ApexNav from "@/components/layout/ApexNav";
 import ApexFooter from "@/components/layout/ApexFooter";
 import SystemMap from "@/components/sections/SystemMap";
 import FeaturedNodes from "@/components/sections/FeaturedNodes";
 import AccessTiers from "@/components/sections/AccessTiers";
 import CommonsCTA from "@/components/sections/CommonsCTA";
 
 const Commons = () => {
   return (
     <div className="relative min-h-screen bg-background">
       {/* Noise overlay */}
       <div className="noise-overlay" />
       
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
             <div className="flex items-center gap-3 mb-6">
               <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
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
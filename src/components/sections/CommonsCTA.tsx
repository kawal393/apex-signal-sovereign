 import { motion } from "framer-motion";
 import { ApexButton } from "@/components/ui/apex-button";
 
 export default function CommonsCTA() {
   return (
     <section className="px-6 py-32 relative overflow-hidden">
       {/* Background glow */}
       <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
         <div className="w-[600px] h-[600px] rounded-full bg-primary/5 blur-[100px]" />
       </div>
 
       <motion.div
         initial={{ opacity: 0, y: 30 }}
         whileInView={{ opacity: 1, y: 0 }}
         transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
         viewport={{ once: true }}
         className="max-w-3xl mx-auto text-center relative z-10"
       >
         {/* Section label */}
         <span className="text-xs uppercase tracking-[0.3em] text-muted-foreground mb-6 block">
           Section D
         </span>
 
         {/* Heading */}
         <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground tracking-tight mb-6">
           Access the System
         </h2>
 
         {/* Description */}
         <p className="text-lg text-muted-foreground mb-12 max-w-xl mx-auto">
           Join the verified signal network. Start as an Observer or request institutional access.
         </p>
 
         {/* CTA Buttons */}
         <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
           <ApexButton variant="primary" size="lg">
             Join as Observer (Free)
           </ApexButton>
           
           <ApexButton variant="outline" size="lg">
             Request Institutional Access
           </ApexButton>
         </div>
       </motion.div>
     </section>
   );
 }
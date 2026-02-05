 import { motion } from "framer-motion";
 import { Check } from "lucide-react";
 
 interface Tier {
   id: string;
   name: string;
   price: string;
   period: string;
   features: string[];
   highlighted?: boolean;
 }
 
 const tiers: Tier[] = [
   {
     id: "observer",
     name: "Observer",
     price: "Free",
     period: "",
     features: [
       "Public signal access",
       "Weekly digest reports",
       "Community forum access",
     ],
   },
   {
     id: "pro",
     name: "Pro",
     price: "$99",
     period: "/month",
     features: [
       "Real-time signal alerts",
       "Advanced analytics dashboard",
       "Priority support channel",
     ],
     highlighted: true,
   },
   {
     id: "operator",
     name: "Operator",
     price: "$299",
     period: "/month",
     features: [
       "Full node access",
       "Custom alert configurations",
       "API integration access",
     ],
   },
   {
     id: "institutional",
     name: "Institutional",
     price: "Custom",
     period: "",
     features: [
       "Dedicated infrastructure",
       "White-glove onboarding",
       "Custom SLA agreements",
     ],
   },
 ];
 
 const containerVariants = {
   hidden: { opacity: 0 },
   visible: {
     opacity: 1,
     transition: {
       staggerChildren: 0.1,
     },
   },
 };
 
 const itemVariants = {
   hidden: { opacity: 0, y: 30 },
   visible: {
     opacity: 1,
     y: 0,
     transition: {
       duration: 0.6,
       ease: [0.16, 1, 0.3, 1],
     },
   },
 };
 
 export default function AccessTiers() {
   return (
     <section id="access-tiers" className="px-6 py-24 border-b border-border">
       <div className="max-w-7xl mx-auto">
         {/* Section Header */}
         <motion.div
           initial={{ opacity: 0, y: 20 }}
           whileInView={{ opacity: 1, y: 0 }}
           transition={{ duration: 0.6 }}
           viewport={{ once: true }}
           className="mb-16"
         >
           <span className="text-xs uppercase tracking-[0.3em] text-muted-foreground mb-4 block">
             Section C
           </span>
           <h2 className="text-3xl md:text-4xl font-bold text-foreground tracking-tight">
             Access Tiers
           </h2>
           <p className="mt-3 text-muted-foreground">
             Structured access. Verified intelligence.
           </p>
         </motion.div>
 
         {/* Tiers Grid */}
         <motion.div
           variants={containerVariants}
           initial="hidden"
           whileInView="visible"
           viewport={{ once: true }}
           className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
         >
           {tiers.map((tier) => (
             <motion.div
               key={tier.id}
               variants={itemVariants}
               className={`glass-card p-8 relative overflow-hidden transition-all duration-300 hover:border-primary/30 ${
                 tier.highlighted
                   ? "border-primary/40 shadow-[0_0_40px_hsl(var(--primary)/0.15)]"
                   : ""
               }`}
             >
               {/* Highlighted badge */}
               {tier.highlighted && (
                 <div className="absolute top-4 right-4">
                   <span className="text-[10px] uppercase tracking-widest text-primary bg-primary/10 px-2 py-1 rounded-full border border-primary/30">
                     Popular
                   </span>
                 </div>
               )}
 
               {/* Tier name */}
               <h3 className="text-lg font-semibold text-foreground mb-2">
                 {tier.name}
               </h3>
 
               {/* Price */}
               <div className="mb-6">
                 <span className="text-3xl font-bold text-foreground">
                   {tier.price}
                 </span>
                 <span className="text-muted-foreground text-sm">
                   {tier.period}
                 </span>
               </div>
 
               {/* Features */}
               <ul className="space-y-3">
                 {tier.features.map((feature, index) => (
                   <li key={index} className="flex items-start gap-3">
                     <Check className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                     <span className="text-sm text-muted-foreground">
                       {feature}
                     </span>
                   </li>
                 ))}
               </ul>
             </motion.div>
           ))}
         </motion.div>
       </div>
     </section>
   );
 }
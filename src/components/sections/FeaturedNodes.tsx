 import { motion } from "framer-motion";
 import { Eye, FileText, Shield } from "lucide-react";
 
 interface FeaturedNode {
   id: string;
   name: string;
   description: string;
   icon: React.ReactNode;
 }
 
 const featuredNodes: FeaturedNode[] = [
   {
     id: "ndis",
     name: "NDIS Watchtower",
     description: "Compliance enforcement signals and risk monitoring.",
     icon: <Eye className="w-6 h-6" />,
   },
   {
     id: "translator",
     name: "Corporate Translator",
     description: "Daily verdicts translating complex reports into action.",
     icon: <FileText className="w-6 h-6" />,
   },
   {
     id: "ledger",
     name: "APEX-ATA Ledger",
     description: "Immutable audit trail of verdicts and signals.",
     icon: <Shield className="w-6 h-6" />,
   },
 ];
 
 const containerVariants = {
   hidden: { opacity: 0 },
   visible: {
     opacity: 1,
     transition: {
       staggerChildren: 0.15,
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
 
 export default function FeaturedNodes() {
   return (
     <section id="featured-nodes" className="px-6 py-24 border-b border-border">
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
             Section B
           </span>
           <h2 className="text-3xl md:text-4xl font-bold text-foreground tracking-tight">
             Featured Nodes
           </h2>
           <p className="mt-3 text-muted-foreground">
             Core operational intelligence. Active signal monitoring.
           </p>
         </motion.div>
 
         {/* Featured Cards */}
         <motion.div
           variants={containerVariants}
           initial="hidden"
           whileInView="visible"
           viewport={{ once: true }}
           className="grid grid-cols-1 md:grid-cols-3 gap-6"
         >
           {featuredNodes.map((node) => (
             <motion.div
               key={node.id}
               variants={itemVariants}
               className="glass-card p-8 group hover:border-primary/30 transition-all duration-500 relative overflow-hidden"
             >
               {/* Hover glow effect */}
               <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
               
               <div className="relative z-10">
                 {/* Icon */}
                 <div className="w-12 h-12 rounded-lg bg-secondary/50 border border-border flex items-center justify-center mb-6 group-hover:border-primary/30 group-hover:bg-primary/10 transition-all duration-300">
                   <span className="text-muted-foreground group-hover:text-primary transition-colors duration-300">
                     {node.icon}
                   </span>
                 </div>
 
                 {/* Status indicator */}
                 <div className="flex items-center gap-2 mb-4">
                   <div className="w-1.5 h-1.5 rounded-full bg-status-active animate-pulse" />
                   <span className="text-xs uppercase tracking-wider text-status-active">
                     Active
                   </span>
                 </div>
 
                 {/* Content */}
                 <h3 className="text-xl font-semibold text-foreground mb-3">
                   {node.name}
                 </h3>
                 <p className="text-muted-foreground text-sm leading-relaxed">
                   {node.description}
                 </p>
               </div>
             </motion.div>
           ))}
         </motion.div>
       </div>
     </section>
   );
 }
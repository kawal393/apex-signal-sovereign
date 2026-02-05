 import { motion } from "framer-motion";
 
 interface Node {
   id: number;
   name: string;
   status: "Active" | "Operating" | "Frozen";
 }
 
 const nodes: Node[] = [
   { id: 1, name: "NDIS Watchtower", status: "Active" },
   { id: 2, name: "Corporate Translator", status: "Active" },
   { id: 3, name: "APEX-ATA Ledger", status: "Active" },
   { id: 4, name: "Grant Radar", status: "Frozen" },
   { id: 5, name: "Insurance Wording Drift Watchtower", status: "Frozen" },
   { id: 6, name: "DCP Arbitrage Tracker", status: "Frozen" },
   { id: 7, name: "Grid Constraint Watchtower", status: "Frozen" },
   { id: 8, name: "Pharma Zombie Detector", status: "Frozen" },
   { id: 9, name: "APEX Verified", status: "Frozen" },
   { id: 10, name: "Optionality Vault", status: "Frozen" },
 ];
 
 const getStatusClass = (status: Node["status"]) => {
   switch (status) {
     case "Active":
       return "status-active";
     case "Operating":
       return "status-operating";
     case "Frozen":
       return "status-frozen";
   }
 };
 
 const containerVariants = {
   hidden: { opacity: 0 },
   visible: {
     opacity: 1,
     transition: {
       staggerChildren: 0.05,
     },
   },
 };
 
 const itemVariants = {
   hidden: { opacity: 0, y: 20 },
   visible: {
     opacity: 1,
     y: 0,
     transition: {
       duration: 0.5,
       ease: [0.16, 1, 0.3, 1],
     },
   },
 };
 
 export default function SystemMap() {
   return (
     <section id="system-map" className="px-6 py-24 border-b border-border">
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
             Section A
           </span>
           <h2 className="text-3xl md:text-4xl font-bold text-foreground tracking-tight">
             System Map
           </h2>
           <p className="mt-3 text-muted-foreground">
             10 operational nodes. Real-time status monitoring.
           </p>
         </motion.div>
 
         {/* Nodes Grid */}
         <motion.div
           variants={containerVariants}
           initial="hidden"
           whileInView="visible"
           viewport={{ once: true }}
           className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4"
         >
           {nodes.map((node) => (
             <motion.div
               key={node.id}
               variants={itemVariants}
               className="glass-card p-5 group hover:border-primary/20 transition-colors duration-300"
             >
               <div className="flex items-start justify-between gap-3 mb-4">
                 <span className="text-xs text-muted-foreground/60 font-mono">
                   {String(node.id).padStart(2, "0")}
                 </span>
                 <span className={getStatusClass(node.status)}>
                   {node.status}
                 </span>
               </div>
               <h3 className="text-sm font-medium text-foreground leading-tight group-hover:text-primary transition-colors duration-300">
                 {node.name}
               </h3>
             </motion.div>
           ))}
         </motion.div>
       </div>
     </section>
   );
 }
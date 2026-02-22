import { motion } from "framer-motion";
import { ApexButton } from "@/components/ui/apex-button";

export default function CommonsCTA() {
  return (
    <section className="px-6 py-32 md:py-40 relative overflow-hidden">
      {/* Background energy */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <motion.div 
          className="w-[700px] h-[700px] rounded-full"
          style={{
            background: 'radial-gradient(circle, hsl(42 90% 55% / 0.06) 0%, transparent 60%)',
          }}
          animate={{ 
            opacity: [0.4, 0.7, 0.4],
            scale: [0.95, 1.05, 0.95],
          }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
        viewport={{ once: true }}
        className="max-w-3xl mx-auto text-center relative z-10"
      >
        {/* Section label */}
        <motion.span 
          className="text-[10px] uppercase tracking-[0.5em] text-muted-foreground/50 mb-8 block font-medium"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          Access Protocol
        </motion.span>

        {/* Heading - ritualistic */}
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-extralight text-foreground tracking-wide mb-6">
          Access the <span className="text-gradient-gold font-medium">APEX Infrastructure</span>
        </h2>

        {/* Description */}
        <p className="text-base md:text-lg text-muted-foreground/60 mb-14 max-w-xl mx-auto font-light leading-relaxed">
          Join the verified signal network. Enter as an Observer or request institutional access.
        </p>

        {/* Gate Buttons - consequential, not casual */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-5">
          <motion.div
            whileHover={{ scale: 1.03, y: -4 }}
            whileTap={{ scale: 0.98 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          >
            <ApexButton 
              variant="primary" 
              size="lg"
              className="min-w-[200px] tracking-[0.25em]"
              style={{
                boxShadow: '0 0 50px hsl(42 90% 55% / 0.2), 0 0 100px hsl(42 90% 55% / 0.08)',
              }}
            >
              Enter as Observer
            </ApexButton>
          </motion.div>
          
          <motion.div
            whileHover={{ scale: 1.02, y: -3 }}
            whileTap={{ scale: 0.98 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          >
            <ApexButton 
              variant="outline" 
              size="lg"
              className="min-w-[200px] tracking-[0.2em]"
            >
              Request APEX Access
            </ApexButton>
          </motion.div>
        </div>
      </motion.div>
      
      {/* Bottom sigil */}
      <motion.div 
        className="absolute bottom-16 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3"
        animate={{ opacity: [0.2, 0.4, 0.2] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      >
        <div className="w-8 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
        <div className="text-primary/30 text-base">◆</div>
      </motion.div>
    </section>
  );
}

import { motion } from "framer-motion";
import { useState, useEffect, useMemo } from "react";

interface LivingNodeProps {
  id: number;
  name: string;
  status: "Active" | "Frozen";
  category?: string;
}

export default function LivingNode({ id, name, status, category }: LivingNodeProps) {
  const [signalStrength, setSignalStrength] = useState(0.7);
  const [lastPing, setLastPing] = useState<string>("");
  const [isHovered, setIsHovered] = useState(false);

  // Generate random but consistent pulse timing for this node
  const pulseTiming = useMemo(() => ({
    duration: 3 + (id % 5),
    delay: id * 0.3,
  }), [id]);

  // Simulate living data for Active nodes
  useEffect(() => {
    if (status !== "Active") return;

    // Signal strength fluctuation
    const signalInterval = setInterval(() => {
      setSignalStrength(0.5 + Math.random() * 0.5);
    }, 2000 + Math.random() * 3000);

    // Last ping timestamp
    const updatePing = () => {
      const seconds = Math.floor(Math.random() * 30);
      setLastPing(`${seconds}s ago`);
    };
    updatePing();
    const pingInterval = setInterval(updatePing, 5000);

    return () => {
      clearInterval(signalInterval);
      clearInterval(pingInterval);
    };
  }, [status]);

  if (status === "Frozen") {
    // Frozen nodes - sealed, unresponsive, don't acknowledge interaction
    return (
      <div className="relative p-5 rounded-md bg-[hsl(260,15%,4%)] border border-[hsl(260,10%,12%)] opacity-40 cursor-default select-none">
        {/* No hover state, no response */}
        <div className="flex items-start justify-between gap-2 mb-4">
          <span className="text-[9px] text-muted-foreground/20 font-mono tracking-wider">
            {String(id).padStart(2, "0")}
          </span>
          <span className="text-[8px] py-1 px-2 rounded-full font-medium uppercase tracking-[0.1em] bg-[hsl(260,8%,10%)] text-muted-foreground/30 border border-[hsl(260,5%,15%)]">
            Sealed
          </span>
        </div>
        <h3 className="text-sm font-medium text-muted-foreground/30 leading-snug mb-3">
          {name}
        </h3>
        {category && (
          <span className="text-[9px] text-muted-foreground/20 uppercase tracking-[0.2em]">
            {category}
          </span>
        )}
      </div>
    );
  }

  // Active nodes - alive, responsive, watching
  return (
    <motion.div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      whileHover={{ 
        scale: 1.03, 
        y: -6,
        rotateX: 2,
        rotateY: -1,
      }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="relative p-5 rounded-md cursor-pointer group overflow-hidden"
      style={{
        background: 'linear-gradient(165deg, hsl(260 18% 5% / 0.95) 0%, hsl(260 20% 3% / 0.92) 100%)',
        border: '1px solid hsl(42 40% 30% / 0.15)',
        boxShadow: `
          0 0 0 1px hsl(42 90% 55% / 0.03),
          0 15px 50px hsl(0 0% 0% / 0.5),
          0 0 ${30 + signalStrength * 20}px hsl(42 90% 55% / ${0.03 + signalStrength * 0.04})
        `,
      }}
    >
      {/* Energy pulse - the node is alive */}
      <motion.div
        className="absolute inset-0 rounded-md pointer-events-none"
        style={{
          border: '1px solid hsl(42 90% 55% / 0.1)',
        }}
        animate={{
          opacity: [0.3, 0.6, 0.3],
          scale: [1, 1.02, 1],
        }}
        transition={{
          duration: pulseTiming.duration,
          repeat: Infinity,
          ease: "easeInOut",
          delay: pulseTiming.delay,
        }}
      />

      {/* Hover energy glow */}
      <motion.div 
        className="absolute inset-0 bg-gradient-to-br from-primary/8 to-transparent rounded-md"
        initial={{ opacity: 0 }}
        animate={{ opacity: isHovered ? 1 : 0 }}
        transition={{ duration: 0.5 }}
      />
      
      {/* Top energy line */}
      <motion.div 
        className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent"
        initial={{ opacity: 0 }}
        animate={{ opacity: isHovered ? 1 : 0 }}
        transition={{ duration: 0.5 }}
      />

      <div className="relative z-10">
        <div className="flex items-start justify-between gap-2 mb-4">
          <span className="text-[9px] text-muted-foreground/30 font-mono tracking-wider">
            {String(id).padStart(2, "0")}
          </span>
          
          {/* Living status indicator */}
          <div className="flex items-center gap-2">
            <motion.div
              className="w-1.5 h-1.5 rounded-full bg-primary"
              animate={{
                opacity: [0.4 + signalStrength * 0.3, 0.8 + signalStrength * 0.2, 0.4 + signalStrength * 0.3],
                scale: [0.9, 1 + signalStrength * 0.2, 0.9],
                boxShadow: [
                  `0 0 ${4 + signalStrength * 6}px hsl(42 90% 55% / 0.4)`,
                  `0 0 ${8 + signalStrength * 12}px hsl(42 90% 55% / 0.6)`,
                  `0 0 ${4 + signalStrength * 6}px hsl(42 90% 55% / 0.4)`,
                ],
              }}
              transition={{
                duration: 1.5 + signalStrength,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
            <span className="text-[8px] py-1 px-2 rounded-full font-semibold uppercase tracking-[0.1em] bg-primary/10 text-primary/80 border border-primary/25">
              Live
            </span>
          </div>
        </div>

        <h3 className="text-sm font-medium text-foreground leading-snug mb-3 group-hover:text-primary transition-colors duration-500">
          {name}
        </h3>

        {category && (
          <span className="text-[9px] text-muted-foreground/40 uppercase tracking-[0.2em]">
            {category}
          </span>
        )}

        {/* Living data footer */}
        <motion.div 
          className="mt-4 pt-3 border-t border-border/10 flex items-center justify-between"
          initial={{ opacity: 0 }}
          animate={{ opacity: isHovered ? 1 : 0.5 }}
          transition={{ duration: 0.4 }}
        >
          <span className="text-[8px] text-muted-foreground/40 uppercase tracking-wider">
            Last signal: {lastPing}
          </span>
          <div className="flex items-center gap-1">
            {[...Array(5)].map((_, i) => (
              <motion.div
                key={i}
                className="w-0.5 rounded-full bg-primary/40"
                style={{
                  height: `${4 + (i < Math.floor(signalStrength * 5) ? i * 2 : 0)}px`,
                  opacity: i < Math.floor(signalStrength * 5) ? 1 : 0.2,
                }}
              />
            ))}
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}

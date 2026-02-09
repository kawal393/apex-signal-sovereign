import { motion, AnimatePresence } from "framer-motion";
import { useState, useMemo, useEffect } from "react";
import { useNodeSignal } from "@/hooks/useNodeSignals";
import { useApexSystem } from "@/contexts/ApexSystemContext";

interface LivingNodeProps {
  id: number;
  name: string;
  status: "Active" | "Frozen" | "Dormant";
  category?: string;
}

export default function LivingNode({ id, name, status, category }: LivingNodeProps) {
  const lastSignal = useNodeSignal(id);
  const [signalStrength, setSignalStrength] = useState(0.7);
  const [timeSinceSignal, setTimeSinceSignal] = useState<string>("--");
  const [isHovered, setIsHovered] = useState(false);
  const { trackNodeFocus, trackNodeBlur } = useApexSystem();

  // Pulse timing for this node
  const pulseTiming = useMemo(() => ({
    duration: 3 + (id % 5),
    delay: id * 0.3,
  }), [id]);

  // Update signal strength when signal arrives (from shared realtime subscription)
  useEffect(() => {
    if (lastSignal) {
      setSignalStrength(Number(lastSignal.signal_strength) || 0.7);
    }
  }, [lastSignal]);

  // Update time since signal display (cheap interval, no network)
  useEffect(() => {
    if (status !== "Active") return;

    const interval = setInterval(() => {
      if (lastSignal) {
        const seconds = Math.floor(
          (Date.now() - new Date(lastSignal.created_at).getTime()) / 1000
        );
        if (seconds < 60) {
          setTimeSinceSignal(`${seconds}s ago`);
        } else if (seconds < 3600) {
          setTimeSinceSignal(`${Math.floor(seconds / 60)}m ago`);
        } else {
          setTimeSinceSignal(`${Math.floor(seconds / 3600)}h ago`);
        }
      }
    }, 5000); // Update every 5s instead of every 1s

    return () => clearInterval(interval);
  }, [status, lastSignal]);

  // Very slow signal fluctuation (cosmetic)
  useEffect(() => {
    if (status !== "Active") return;

    const interval = setInterval(() => {
      setSignalStrength((prev) => {
        const delta = (Math.random() - 0.5) * 0.1;
        return Math.max(0.4, Math.min(1, prev + delta));
      });
    }, 6000 + id * 500); // Stagger by node id

    return () => clearInterval(interval);
  }, [status, id]);

  const handleMouseEnter = () => {
    setIsHovered(true);
    trackNodeFocus(name);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    trackNodeBlur(name);
  };


  if (status === "Dormant") {
    // Dormant nodes - infrastructure reserved, minimal presence
    return (
      <div className="relative p-4 rounded-md bg-[hsl(260,15%,2%)] border border-[hsl(260,8%,8%)] opacity-40 cursor-default select-none">
        <div className="flex items-start justify-between gap-2 mb-3">
          <span className="text-[8px] text-muted-foreground/10 font-mono tracking-wider">
            {String(id).padStart(2, "0")}
          </span>
          <span className="text-[6px] py-0.5 px-1.5 rounded-full font-medium uppercase tracking-[0.08em] bg-[hsl(260,5%,6%)] text-muted-foreground/15 border border-[hsl(260,3%,10%)]">
            Dormant
          </span>
        </div>
        <h3 className="text-xs font-medium text-muted-foreground/20 leading-snug mb-2">
          {name}
        </h3>
        {category && (
          <span className="text-[7px] text-muted-foreground/10 uppercase tracking-[0.15em]">
            {category}
          </span>
        )}
      </div>
    );
  }

  if (status === "Frozen") {
    // Frozen nodes - sealed, monitoring active
    return (
      <div className="relative p-5 rounded-md bg-[hsl(260,15%,3%)] border border-[hsl(260,10%,10%)] opacity-50 cursor-pointer select-none hover:opacity-70 transition-opacity duration-500">
        <div className="flex items-start justify-between gap-2 mb-4">
          <span className="text-[9px] text-muted-foreground/15 font-mono tracking-wider">
            {String(id).padStart(2, "0")}
          </span>
          <span className="text-[7px] py-0.5 px-2 rounded-full font-medium uppercase tracking-[0.1em] bg-[hsl(260,8%,8%)] text-muted-foreground/25 border border-[hsl(260,5%,12%)]">
            Sealed
          </span>
        </div>
        <h3 className="text-sm font-medium text-muted-foreground/30 leading-snug mb-3">
          {name}
        </h3>
        {category && (
          <span className="text-[8px] text-muted-foreground/20 uppercase tracking-[0.2em]">
            {category}
          </span>
        )}
      </div>
    );
  }

  // Active nodes - living, responsive
  return (
    <motion.div
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
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
          0 0 ${30 + signalStrength * 25}px hsl(42 90% 55% / ${0.04 + signalStrength * 0.05})
        `,
      }}
    >
      {/* Living pulse */}
      <motion.div
        className="absolute inset-0 rounded-md pointer-events-none"
        style={{
          border: `1px solid hsl(42 90% 55% / ${0.1 + signalStrength * 0.1})`,
        }}
        animate={{
          opacity: [0.3, 0.6 + signalStrength * 0.2, 0.3],
          scale: [1, 1.01, 1],
        }}
        transition={{
          duration: pulseTiming.duration - signalStrength,
          repeat: Infinity,
          ease: "easeInOut",
          delay: pulseTiming.delay,
        }}
      />

      {/* Hover glow */}
      <AnimatePresence>
        {isHovered && (
          <motion.div 
            className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent rounded-md"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          />
        )}
      </AnimatePresence>

      {/* Top energy line */}
      <motion.div 
        className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent"
        initial={{ opacity: 0 }}
        animate={{ opacity: isHovered ? 1 : 0 }}
        transition={{ duration: 0.4 }}
      />

      <div className="relative z-10">
        <div className="flex items-start justify-between gap-2 mb-4">
          <span className="text-[9px] text-muted-foreground/30 font-mono tracking-wider">
            {String(id).padStart(2, "0")}
          </span>
          
          {/* Living status with real signal strength */}
          <div className="flex items-center gap-2">
            <motion.div
              className="w-1.5 h-1.5 rounded-full bg-primary"
              animate={{
                opacity: [0.5 + signalStrength * 0.3, 0.9, 0.5 + signalStrength * 0.3],
                scale: [0.9, 1.1 + signalStrength * 0.15, 0.9],
                boxShadow: [
                  `0 0 ${6 + signalStrength * 8}px hsl(42 90% 55% / 0.5)`,
                  `0 0 ${12 + signalStrength * 15}px hsl(42 90% 55% / 0.7)`,
                  `0 0 ${6 + signalStrength * 8}px hsl(42 90% 55% / 0.5)`,
                ],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
            <span className="text-[7px] py-0.5 px-2 rounded-full font-semibold uppercase tracking-[0.1em] bg-primary/12 text-primary/80 border border-primary/25">
              Live
            </span>
          </div>
        </div>

        <h3 className="text-sm font-medium text-foreground leading-snug mb-3 group-hover:text-primary transition-colors duration-500">
          {name}
        </h3>

        {category && (
          <span className="text-[8px] text-muted-foreground/40 uppercase tracking-[0.2em]">
            {category}
          </span>
        )}

        {/* Live data footer */}
        <motion.div 
          className="mt-4 pt-3 border-t border-border/10"
          initial={{ opacity: 0.4 }}
          animate={{ opacity: isHovered ? 1 : 0.5 }}
          transition={{ duration: 0.4 }}
        >
          {/* Last signal message */}
          {lastSignal && isHovered && (
            <motion.p
              className="text-[8px] text-primary/50 mb-2 truncate"
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
            >
              "{lastSignal.message}"
            </motion.p>
          )}
          
          <div className="flex items-center justify-between">
            <span className="text-[7px] text-muted-foreground/40 uppercase tracking-wider">
              Signal: {timeSinceSignal}
            </span>
            
            {/* Real signal strength bars */}
            <div className="flex items-end gap-0.5">
              {[...Array(5)].map((_, i) => {
                const threshold = (i + 1) / 5;
                const active = signalStrength >= threshold;
                return (
                  <motion.div
                    key={i}
                    className={`w-0.5 rounded-full ${active ? 'bg-primary' : 'bg-primary/20'}`}
                    style={{ height: `${4 + i * 2}px` }}
                    animate={active ? {
                      opacity: [0.7, 1, 0.7],
                    } : {}}
                    transition={{ duration: 2, repeat: Infinity, delay: i * 0.1 }}
                  />
                );
              })}
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}

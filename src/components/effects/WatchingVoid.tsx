import { motion } from "framer-motion";
import { useMemo } from "react";
import { useCursorPosition } from "@/hooks/useCursorPosition";

interface WatchingVoidProps {
  intensity?: "subtle" | "medium" | "strong";
  particleCount?: number;
}

export default function WatchingVoid({ 
  intensity = "medium",
  particleCount = 60 
}: WatchingVoidProps) {
  const cursor = useCursorPosition();
  
  const intensityMultiplier = {
    subtle: 0.5,
    medium: 1,
    strong: 1.5,
  }[intensity];

  // Generate star particles
  const particles = useMemo(() => 
    Array.from({ length: particleCount }).map((_, i) => ({
      id: i,
      baseX: Math.random() * 100,
      baseY: Math.random() * 100,
      size: 0.5 + Math.random() * 1.5,
      pulseDuration: 20 + Math.random() * 40,
      delay: Math.random() * 10,
      opacity: 0.1 + Math.random() * 0.35,
      cursorInfluence: 0.3 + Math.random() * 0.7, // How much this particle responds to cursor
    })),
  [particleCount]);

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none">
      {/* The absolute void */}
      <div className="absolute inset-0 bg-black" />
      
      {/* Subtle dimensional depth - responds to cursor */}
      <motion.div 
        className="absolute inset-0"
        style={{
          background: `radial-gradient(ellipse 80% 50% at ${50 + cursor.normalizedX * 5}% ${-20 + cursor.normalizedY * 3}%, hsl(260 30% 6% / 0.5), transparent)`,
        }}
      />
      
      {/* Cursor-aware glow - the watching presence */}
      <motion.div
        className="absolute w-[600px] h-[600px] rounded-full pointer-events-none"
        style={{
          left: cursor.x - 300,
          top: cursor.y - 300,
          background: `radial-gradient(circle, hsl(42 90% 55% / ${0.02 * intensityMultiplier}) 0%, transparent 70%)`,
        }}
        transition={{ type: "spring", damping: 30, stiffness: 100 }}
      />
      
      {/* Peripheral golden presence - edge acknowledgment */}
      <div 
        className="absolute inset-0"
        style={{
          background: `
            radial-gradient(ellipse 30% 50% at ${cursor.normalizedX > 0 ? '98%' : '2%'} 50%, 
              hsl(42 90% 55% / ${0.015 * intensityMultiplier * Math.abs(cursor.normalizedX)}) 0%, 
              transparent 100%)
          `,
        }}
      />
      
      {/* Star field that drifts toward cursor */}
      <div className="absolute inset-0">
        {particles.map((particle) => {
          // Calculate drift based on cursor position
          const driftX = cursor.normalizedX * 15 * particle.cursorInfluence * intensityMultiplier;
          const driftY = cursor.normalizedY * 15 * particle.cursorInfluence * intensityMultiplier;
          
          return (
            <motion.div
              key={particle.id}
              className="absolute rounded-full"
              style={{
                left: `calc(${particle.baseX}% + ${driftX}px)`,
                top: `calc(${particle.baseY}% + ${driftY}px)`,
                width: `${particle.size}px`,
                height: `${particle.size}px`,
                background: `radial-gradient(circle, hsl(42 80% 70% / ${particle.opacity}) 0%, transparent 70%)`,
                boxShadow: particle.size > 1 
                  ? `0 0 ${particle.size * 3}px hsl(42 90% 60% / ${particle.opacity * 0.4})` 
                  : 'none',
              }}
              animate={{
                opacity: [particle.opacity * 0.4, particle.opacity, particle.opacity * 0.4],
                scale: [0.9, 1.1, 0.9],
              }}
              transition={{
                duration: particle.pulseDuration,
                repeat: Infinity,
                ease: "easeInOut",
                delay: particle.delay,
              }}
            />
          );
        })}
      </div>

      {/* Occasional peripheral acknowledgment flicker */}
      <motion.div
        className="absolute w-1 h-1 rounded-full bg-primary/30"
        style={{
          left: `${90 + Math.random() * 8}%`,
          top: `${cursor.y}px`,
        }}
        animate={{
          opacity: [0, 0.3, 0],
          scale: [0.5, 1, 0.5],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          repeatDelay: 5 + Math.random() * 10,
        }}
      />
      
      {/* Noise texture */}
      <div 
        className="absolute inset-0 opacity-[0.012] mix-blend-overlay"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        }}
      />
    </div>
  );
}

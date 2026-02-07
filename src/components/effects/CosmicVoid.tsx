import { motion } from "framer-motion";
import { useMemo } from "react";

interface CosmicVoidProps {
  intensity?: "light" | "medium" | "deep";
  showPortals?: boolean;
  showParticles?: boolean;
}

export default function CosmicVoid({ 
  intensity = "deep", 
  showPortals = true,
  showParticles = true 
}: CosmicVoidProps) {
  // Reduced star count and slower animations for better performance
  const stars = useMemo(() => 
    Array.from({ length: 40 }).map((_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: 0.5 + Math.random() * 1.5,
      duration: 60 + Math.random() * 80, // Even slower: 60-140s
      delay: Math.random() * 30,
      opacity: 0.08 + Math.random() * 0.25,
    })),
  []);

  const intensityStyles = {
    light: "from-[hsl(260,15%,4%)] via-[hsl(260,12%,3%)] to-[hsl(260,20%,1%)]",
    medium: "from-[hsl(260,18%,3%)] via-[hsl(260,15%,2%)] to-[hsl(260,25%,0.5%)]",
    deep: "from-[hsl(260,20%,2%)] via-[hsl(260,18%,1%)] to-[hsl(0,0%,0%)]",
  };

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none">
      {/* The Void - absolute black space */}
      <div className={`absolute inset-0 bg-gradient-to-b ${intensityStyles[intensity]}`} />
      
      {/* Subtle dimensional depth */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,hsl(260,30%,8%,0.4),transparent)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_40%_at_50%_120%,hsl(35,20%,5%,0.3),transparent)]" />
      
      {/* Portal rings - CSS animations for better performance */}
      {showPortals && (
        <>
          <div 
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full animate-[pulse_12s_ease-in-out_infinite]"
            style={{
              width: '500px',
              height: '500px',
              border: '1px solid hsl(42 60% 50% / 0.08)',
              boxShadow: '0 0 80px hsl(42 90% 55% / 0.05), inset 0 0 80px hsl(42 90% 55% / 0.02)',
            }}
          />
          <div 
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full animate-[pulse_16s_ease-in-out_infinite_2s]"
            style={{
              width: '800px',
              height: '800px',
              border: '1px solid hsl(42 50% 45% / 0.05)',
              boxShadow: '0 0 120px hsl(42 90% 55% / 0.03)',
            }}
          />
          <div 
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full animate-[pulse_20s_ease-in-out_infinite_4s]"
            style={{
              width: '1100px',
              height: '1100px',
              border: '1px solid hsl(42 40% 40% / 0.03)',
            }}
          />
        </>
      )}
      
      {/* Star field - CSS animations for performance */}
      {showParticles && (
        <div className="absolute inset-0">
          {stars.map((star) => (
            <div
              key={star.id}
              className="absolute rounded-full animate-[twinkle_var(--duration)_ease-in-out_infinite_var(--delay)]"
              style={{
                left: `${star.x}%`,
                top: `${star.y}%`,
                width: `${star.size}px`,
                height: `${star.size}px`,
                background: `radial-gradient(circle, hsl(42 80% 75% / ${star.opacity}) 0%, transparent 70%)`,
                boxShadow: star.size > 1 ? `0 0 ${star.size * 3}px hsl(42 90% 60% / ${star.opacity * 0.4})` : 'none',
                ['--duration' as string]: `${star.duration}s`,
                ['--delay' as string]: `${star.delay}s`,
              }}
            />
          ))}
        </div>
      )}
      
      {/* Noise texture overlay */}
      <div className="absolute inset-0 opacity-[0.015] mix-blend-overlay"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        }}
      />
    </div>
  );
}

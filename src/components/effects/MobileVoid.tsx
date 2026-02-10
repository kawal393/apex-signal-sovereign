import { motion } from "framer-motion";

/**
 * Lightweight 2D void effect for mobile devices
 * Replaces heavy WebGL for better FCP and battery life
 */
export default function MobileVoid() {
  return (
    <div className="absolute inset-0 bg-black overflow-hidden">
      {/* Deep void gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-[hsl(260,20%,2%)] via-black to-black" />
      
      {/* Central glow */}
      <div 
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full"
        style={{
          background: 'radial-gradient(circle, hsl(42 90% 55% / 0.08) 0%, transparent 70%)',
        }}
      />
      
      {/* Subtle rings - CSS only, no JS */}
      <div 
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] rounded-full border border-primary/10 animate-[pulse_8s_ease-in-out_infinite]"
      />
      <div 
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[450px] h-[450px] rounded-full border border-purple-mid/8 animate-[pulse_12s_ease-in-out_infinite_2s]"
      />
      <div 
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full border border-silver-mid/5 animate-[pulse_16s_ease-in-out_infinite_4s]"
      />
      
      {/* Ambient nebula colors */}
      <motion.div
        className="absolute top-1/4 -left-20 w-[300px] h-[300px] rounded-full opacity-20"
        style={{
          background: 'radial-gradient(circle, hsl(260 50% 30% / 0.4) 0%, transparent 70%)',
          filter: 'blur(60px)',
        }}
        animate={{ x: [0, 20, 0], y: [0, 10, 0] }}
        transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute bottom-1/4 -right-20 w-[250px] h-[250px] rounded-full opacity-15"
        style={{
          background: 'radial-gradient(circle, hsl(35 60% 40% / 0.3) 0%, transparent 70%)',
          filter: 'blur(50px)',
        }}
        animate={{ x: [0, -15, 0], y: [0, -10, 0] }}
        transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
      />
      
      {/* CSS particles for mobile */}
      {[...Array(8)].map((_, i) => (
        <div
          key={i}
          className="absolute rounded-full"
          style={{
            width: 1.5 + Math.random() * 1.5,
            height: 1.5 + Math.random() * 1.5,
            left: `${10 + Math.random() * 80}%`,
            top: `${10 + Math.random() * 80}%`,
            backgroundColor: i % 2 === 0 ? 'hsl(42 100% 70%)' : 'hsl(0 0% 80%)',
            opacity: 0.2 + Math.random() * 0.15,
            boxShadow: i % 2 === 0 ? '0 0 6px hsl(42 100% 60% / 0.5)' : '0 0 4px hsl(0 0% 70% / 0.3)',
            animation: `float-particle ${8 + Math.random() * 6}s ease-in-out infinite`,
            animationDelay: `${Math.random() * 10}s`,
            willChange: 'transform, opacity',
          }}
        />
      ))}

      {/* Noise texture */}
      <div
        className="absolute inset-0 opacity-[0.02] mix-blend-overlay pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        }}
      />
    </div>
  );
}

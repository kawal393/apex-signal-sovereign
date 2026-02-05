import { motion } from "framer-motion";

interface SacredGeometryProps {
  variant?: "triangle" | "hexagon" | "circle" | "all";
  className?: string;
}

export default function SacredGeometry({ variant = "all", className = "" }: SacredGeometryProps) {
  return (
    <div className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}>
      {/* Triangular sigils */}
      {(variant === "triangle" || variant === "all") && (
        <>
          <motion.div
            className="absolute top-[15%] left-[10%] w-24 h-24"
            style={{
              clipPath: "polygon(50% 0%, 0% 100%, 100% 100%)",
              border: "1px solid hsl(42 50% 50% / 0.1)",
              background: "linear-gradient(180deg, hsl(42 90% 55% / 0.03) 0%, transparent 100%)",
            }}
            animate={{ 
              opacity: [0.1, 0.3, 0.1],
              rotate: [0, 5, 0],
            }}
            transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div
            className="absolute bottom-[20%] right-[15%] w-16 h-16"
            style={{
              clipPath: "polygon(50% 100%, 0% 0%, 100% 0%)",
              border: "1px solid hsl(42 50% 50% / 0.08)",
              background: "linear-gradient(0deg, hsl(42 90% 55% / 0.02) 0%, transparent 100%)",
            }}
            animate={{ 
              opacity: [0.08, 0.2, 0.08],
              rotate: [0, -3, 0],
            }}
            transition={{ duration: 25, repeat: Infinity, ease: "easeInOut", delay: 5 }}
          />
        </>
      )}

      {/* Hexagonal patterns */}
      {(variant === "hexagon" || variant === "all") && (
        <>
          <motion.div
            className="absolute top-[40%] right-[8%] w-32 h-32"
            style={{
              clipPath: "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)",
              border: "1px solid hsl(42 40% 45% / 0.06)",
              background: "radial-gradient(circle at center, hsl(42 90% 55% / 0.02) 0%, transparent 70%)",
            }}
            animate={{ 
              opacity: [0.05, 0.15, 0.05],
              scale: [1, 1.05, 1],
            }}
            transition={{ duration: 30, repeat: Infinity, ease: "easeInOut", delay: 3 }}
          />
        </>
      )}

      {/* Circular halos */}
      {(variant === "circle" || variant === "all") && (
        <>
          <motion.div
            className="absolute top-[25%] left-[5%] w-40 h-40 rounded-full"
            style={{
              border: "1px solid hsl(42 50% 50% / 0.04)",
              boxShadow: "inset 0 0 40px hsl(42 90% 55% / 0.02)",
            }}
            animate={{ 
              opacity: [0.05, 0.12, 0.05],
              scale: [1, 1.03, 1],
            }}
            transition={{ duration: 18, repeat: Infinity, ease: "easeInOut", delay: 8 }}
          />
          <motion.div
            className="absolute bottom-[30%] left-[12%] w-20 h-20 rounded-full"
            style={{
              border: "1px solid hsl(42 60% 55% / 0.06)",
              boxShadow: "0 0 30px hsl(42 90% 55% / 0.03)",
            }}
            animate={{ 
              opacity: [0.08, 0.18, 0.08],
            }}
            transition={{ duration: 22, repeat: Infinity, ease: "easeInOut", delay: 12 }}
          />
        </>
      )}
    </div>
  );
}

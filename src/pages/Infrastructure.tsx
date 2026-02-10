import { forwardRef } from "react";
import { motion } from "framer-motion";
import ApexNav from "@/components/layout/ApexNav";
import ApexFooter from "@/components/layout/ApexFooter";
import MobileVoid from "@/components/effects/MobileVoid";
import { useIsMobile } from "@/hooks/use-mobile";
import AmbientParticles from "@/components/effects/AmbientParticles";
import InfrastructureDiagram from "@/components/sections/InfrastructureDiagram";

const infrastructureLoop = [
  {
    phase: "ATTENTION",
    description: "Signal detection across institutional surfaces.",
    sigil: "◇",
  },
  {
    phase: "AUTHORITY",
    description: "Verification and weight assignment to detected signals.",
    sigil: "◆",
  },
  {
    phase: "MONITORING",
    description: "Continuous observation of validated signal sources.",
    sigil: "◈",
  },
  {
    phase: "DEPENDENCY",
    description: "Mapping of entity relationships and systemic connections.",
    sigil: "◇",
  },
  {
    phase: "CONTINUITY",
    description: "Preservation of signal integrity across time.",
    sigil: "◆",
  },
];

const Infrastructure = forwardRef<HTMLDivElement>((_, ref) => {
  const isMobile = useIsMobile();

  return (
    <div ref={ref} className="relative min-h-screen bg-black">
      {/* Background */}
      {isMobile && <MobileVoid />}
      <AmbientParticles />
      <div className="fixed inset-0 pointer-events-none z-[1]">
        <div className="absolute inset-0 bg-black/80" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,hsl(275_40%_15%/0.12)_0%,transparent_60%)]" />
      </div>

      <ApexNav />

      <main className="relative z-10 pt-32 pb-24 px-6">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
            className="text-center mb-24"
          >
            <span className="text-[10px] uppercase tracking-[0.6em] text-grey-500 block mb-4">
              System Architecture
            </span>
            <h1 className="text-5xl md:text-7xl font-semibold text-foreground tracking-wide mb-6">
              INFRASTRUCTURE
            </h1>
            <p className="text-lg md:text-xl text-grey-400 max-w-2xl mx-auto">
              The sovereign loop that transforms noise into recorded judgment.
            </p>
          </motion.div>

          {/* Constellation Visualization */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
            className="relative mb-24"
          >
            {/* Central Core */}
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-40 h-40 rounded-full border border-primary/30 flex items-center justify-center">
              <motion.div
                animate={{ scale: [1, 1.1, 1], opacity: [0.4, 0.7, 0.4] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="w-24 h-24 rounded-full bg-gradient-radial from-primary/20 to-transparent"
              />
              <span className="absolute text-xl font-semibold text-primary">APEX</span>
            </div>

            {/* Orbital Rings */}
            <svg
              viewBox="0 0 500 500"
              className="w-full max-w-xl mx-auto h-auto"
              style={{ filter: 'drop-shadow(0 0 40px hsl(42 95% 55% / 0.15))' }}
            >
              {/* Outer ring */}
              <circle
                cx="250"
                cy="250"
                r="200"
                fill="none"
                stroke="hsl(42 50% 50% / 0.1)"
                strokeWidth="1"
              />
              {/* Middle ring */}
              <circle
                cx="250"
                cy="250"
                r="150"
                fill="none"
                stroke="hsl(42 50% 50% / 0.15)"
                strokeWidth="1"
              />
              {/* Inner ring */}
              <circle
                cx="250"
                cy="250"
                r="100"
                fill="none"
                stroke="hsl(42 50% 50% / 0.2)"
                strokeWidth="1"
              />

              {/* Connection lines */}
              {infrastructureLoop.map((_, i) => {
                const angle = (i * 72 - 90) * (Math.PI / 180);
                const x = 250 + 200 * Math.cos(angle);
                const y = 250 + 200 * Math.sin(angle);
                return (
                  <line
                    key={i}
                    x1="250"
                    y1="250"
                    x2={x}
                    y2={y}
                    stroke="hsl(42 50% 50% / 0.08)"
                    strokeWidth="1"
                    strokeDasharray="4 4"
                  />
                );
              })}

              {/* Phase nodes */}
              {infrastructureLoop.map((phase, i) => {
                const angle = (i * 72 - 90) * (Math.PI / 180);
                const x = 250 + 200 * Math.cos(angle);
                const y = 250 + 200 * Math.sin(angle);
                return (
                  <g key={phase.phase}>
                    <motion.circle
                      cx={x}
                      cy={y}
                      r="8"
                      fill="hsl(42 95% 55%)"
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.5 + i * 0.15, duration: 0.6 }}
                    />
                    <motion.circle
                      cx={x}
                      cy={y}
                      r="20"
                      fill="none"
                      stroke="hsl(42 95% 55% / 0.3)"
                      strokeWidth="1"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.6 + i * 0.15 }}
                    />
                  </g>
                );
              })}

              {/* Center glow */}
              <circle
                cx="250"
                cy="250"
                r="30"
                fill="url(#centerGlow)"
              />
              <defs>
                <radialGradient id="centerGlow">
                  <stop offset="0%" stopColor="hsl(42 95% 55% / 0.4)" />
                  <stop offset="100%" stopColor="transparent" />
                </radialGradient>
              </defs>
            </svg>
          </motion.div>

          {/* System Architecture — Outcome View */}
          <InfrastructureDiagram />

          {/* Phase Cards */}
          <div className="space-y-6">
            {infrastructureLoop.map((phase, i) => (
              <motion.div
                key={phase.phase}
                initial={{ opacity: 0, x: i % 2 === 0 ? -30 : 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                className="glass-card p-6 flex items-center gap-6"
              >
                <div className="w-12 h-12 rounded-full border border-primary/30 flex items-center justify-center flex-shrink-0">
                  <span className="text-primary text-lg">{phase.sigil}</span>
                </div>
                <div>
                  <h3 className="text-lg font-medium text-foreground mb-1">
                    {phase.phase}
                  </h3>
                  <p className="text-grey-400 text-sm">
                    {phase.description}
                  </p>
                </div>
                <div className="ml-auto text-grey-600 text-2xl font-light">
                  {String(i + 1).padStart(2, '0')}
                </div>
              </motion.div>
            ))}
          </div>

          {/* Loop indicator */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5 }}
            className="text-center mt-16"
          >
            <span className="text-[10px] uppercase tracking-[0.4em] text-grey-500">
              The loop is continuous
            </span>
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              className="mt-4 inline-block"
            >
              <span className="text-2xl text-primary/40">◎</span>
            </motion.div>
          </motion.div>
        </div>
      </main>

      <ApexFooter />
    </div>
  );
});

Infrastructure.displayName = "Infrastructure";

export default Infrastructure;

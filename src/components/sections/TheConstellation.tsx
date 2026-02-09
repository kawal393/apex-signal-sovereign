import { motion } from "framer-motion";
import { useState } from "react";
import { ExternalLink, Lock, CircleDot } from "lucide-react";
import { getLiveNodes, getSealedNodes, getDormantNodes, ApexNode } from "@/data/nodes";

/**
 * THE CONSTELLATION — Empire Node Map
 * 
 * A sovereign infrastructure visualization displaying all nodes
 * with phase structure, sequence numbers, and status overlays.
 */

interface PhaseIndicatorProps {
  currentPhase: number;
}

const PhaseIndicator = ({ currentPhase }: PhaseIndicatorProps) => {
  const phases = [
    { id: 1, label: "Authority Online", status: "current" },
    { id: 2, label: "Sealed Expansion", status: "upcoming" },
    { id: 3, label: "Global Dominion", status: "future" },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
      className="flex flex-wrap items-center justify-center gap-4 md:gap-8 mb-16"
    >
      {phases.map((phase, i) => (
        <div key={phase.id} className="flex items-center gap-4">
          <div className={`flex items-center gap-3 px-4 py-2 rounded-full border ${
            phase.status === 'current' 
              ? 'border-primary/40 bg-primary/5 text-primary' 
              : phase.status === 'upcoming'
              ? 'border-grey-600/30 bg-grey-800/20 text-grey-400'
              : 'border-grey-700/20 bg-grey-900/10 text-grey-600'
          }`}>
            <span className={`text-[10px] uppercase tracking-[0.3em] font-medium ${
              phase.status === 'current' ? 'text-primary' : ''
            }`}>
              Phase {phase.id}
            </span>
            <span className="text-[9px] tracking-wide">
              {phase.label}
            </span>
            {phase.status === 'current' && (
              <motion.span
                animate={{ scale: [1, 1.2, 1], opacity: [0.6, 1, 0.6] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="w-1.5 h-1.5 rounded-full bg-primary"
              />
            )}
          </div>
          {i < phases.length - 1 && (
            <div className="hidden md:block w-8 h-px bg-gradient-to-r from-grey-700/40 to-transparent" />
          )}
        </div>
      ))}
    </motion.div>
  );
};

interface ConstellationNodeProps {
  node: ApexNode;
  index: number;
  globalIndex: number;
}

const ConstellationNode = ({ node, index, globalIndex }: ConstellationNodeProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const sequenceNumber = String(globalIndex + 1).padStart(2, '0');
  
  const isLive = node.status === 'live';
  const isSealed = node.status === 'sealed';
  const isDormant = node.status === 'dormant';

  const handleClick = () => {
    if (isLive && node.externalUrl) {
      const newWindow = window.open(node.externalUrl, '_blank', 'noopener,noreferrer');
      if (!newWindow || newWindow.closed || typeof newWindow.closed === 'undefined') {
        window.location.href = node.externalUrl;
      }
    }
  };

  const getPulseLabel = () => {
    if (isLive) return 'ACTIVE';
    if (isSealed) return 'MONITORING';
    return 'RESERVED';
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.08, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleClick}
      className={`relative group ${isLive ? 'cursor-pointer' : 'cursor-default'}`}
    >
      {/* Card */}
      <div className={`relative p-5 md:p-6 rounded-lg border transition-all duration-500 ${
        isLive 
          ? 'border-primary/30 bg-primary/5 hover:border-primary/50 hover:bg-primary/10' 
          : isSealed
          ? 'border-grey-600/20 bg-grey-800/10 hover:border-grey-500/30'
          : 'border-grey-700/15 bg-grey-900/5 hover:border-grey-600/20'
      } ${isLive ? 'hover:shadow-[0_0_40px_hsl(42_95%_55%/0.15)]' : ''}`}>
        
        {/* Header Row */}
        <div className="flex items-start justify-between mb-3">
          {/* Sequence Number */}
          <span className={`text-2xl md:text-3xl font-light tabular-nums ${
            isLive ? 'text-primary/80' : isSealed ? 'text-grey-500/60' : 'text-grey-700/40'
          }`}>
            {sequenceNumber}
          </span>
          
          {/* Status + Pulse */}
          <div className="flex items-center gap-2">
            {isSealed && <Lock className="w-3 h-3 text-grey-500/60" />}
            <motion.div
              animate={isLive ? { scale: [1, 1.3, 1], opacity: [0.6, 1, 0.6] } : {}}
              transition={{ duration: 2, repeat: Infinity }}
              className={`w-2 h-2 rounded-full ${
                isLive ? 'bg-primary' : isSealed ? 'bg-grey-500' : 'bg-grey-700'
              }`}
            />
          </div>
        </div>

        {/* Name */}
        <h3 className={`text-base md:text-lg font-medium mb-2 transition-colors duration-300 ${
          isLive 
            ? 'text-foreground group-hover:text-primary' 
            : isSealed 
            ? 'text-grey-300' 
            : 'text-grey-500'
        }`}>
          {node.name}
        </h3>

        {/* Domain */}
        <p className={`text-xs leading-relaxed mb-4 ${
          isLive ? 'text-grey-400' : isSealed ? 'text-grey-500' : 'text-grey-600'
        }`}>
          {node.domain || node.purpose}
        </p>

        {/* Footer Row */}
        <div className="flex items-center justify-between">
          <span className={`text-[9px] uppercase tracking-[0.2em] ${
            isLive ? 'text-primary/70' : isSealed ? 'text-grey-500' : 'text-grey-600'
          }`}>
            Pulse: {getPulseLabel()}
          </span>
          
          {isLive && (
            <ExternalLink className="w-3.5 h-3.5 text-primary/50 group-hover:text-primary transition-colors" />
          )}
        </div>

        {/* Hover Overlay for SEALED */}
        {isSealed && isHovered && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 rounded-lg bg-black/95 border border-grey-600/40 flex flex-col items-center justify-center p-4 z-10"
          >
            <Lock className="w-5 h-5 text-grey-400 mb-3" />
            <span className="text-xs uppercase tracking-[0.3em] text-grey-300 mb-2">Sealed Node</span>
            <p className="text-[10px] text-grey-500 text-center leading-relaxed">
              Monitoring active<br />
              Verdicts restricted<br />
              <span className="text-grey-400">Unlocks in Phase II</span>
            </p>
          </motion.div>
        )}

        {/* Hover Overlay for DORMANT */}
        {isDormant && isHovered && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 rounded-lg bg-black/95 border border-grey-700/30 flex flex-col items-center justify-center p-4 z-10"
          >
            <CircleDot className="w-5 h-5 text-grey-600 mb-3" />
            <span className="text-xs uppercase tracking-[0.3em] text-grey-400 mb-2">Dormant Node</span>
            <p className="text-[10px] text-grey-600 text-center leading-relaxed">
              Infrastructure reserved<br />
              <span className="text-grey-500">Unlock sequence: Phase III</span>
            </p>
          </motion.div>
        )}
      </div>

      {/* Live indicator glow */}
      {isLive && (
        <motion.div
          className="absolute inset-0 rounded-lg pointer-events-none"
          animate={{ 
            boxShadow: isHovered 
              ? '0 0 60px hsl(42 95% 55% / 0.2)' 
              : '0 0 30px hsl(42 95% 55% / 0.08)' 
          }}
          transition={{ duration: 0.5 }}
        />
      )}
    </motion.div>
  );
};

export default function TheConstellation() {
  const liveNodes = getLiveNodes();
  const sealedNodes = getSealedNodes();
  const dormantNodes = getDormantNodes();

  let globalIndex = 0;

  return (
    <section id="constellation" className="relative py-32 md:py-40 border-b border-border/5">
      {/* Subtle cosmic background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,hsl(42_30%_8%/0.06)_0%,transparent_60%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,hsl(270_30%_10%/0.04)_0%,transparent_50%)]" />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
          className="text-center mb-12"
        >
          <span className="text-[10px] uppercase tracking-[0.6em] text-grey-500 block mb-5">
            Empire Architecture
          </span>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-semibold text-foreground tracking-wide mb-6">
            THE <span className="text-gradient-gold">CONSTELLATION</span>
          </h2>
          <p className="text-grey-400 max-w-2xl mx-auto text-base leading-relaxed">
            A sovereign infrastructure spanning regulated, capital-intensive, and irreversible domains.
            Live nodes pulse. Sealed nodes await conditions. Dormant nodes mark inevitable expansion.
          </p>
        </motion.div>

        {/* Phase Indicator */}
        <PhaseIndicator currentPhase={1} />

        {/* LIVE NODES */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mb-16"
        >
          <div className="flex items-center gap-3 mb-6">
            <motion.span
              animate={{ scale: [1, 1.3, 1], opacity: [0.6, 1, 0.6] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="w-2.5 h-2.5 rounded-full bg-primary"
            />
            <h3 className="text-xs uppercase tracking-[0.4em] text-primary font-medium">
              Live Nodes — System Operational
            </h3>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {liveNodes.map((node, i) => {
              const component = (
                <ConstellationNode key={node.id} node={node} index={i} globalIndex={globalIndex} />
              );
              globalIndex++;
              return component;
            })}
          </div>
        </motion.div>

        {/* SEALED NODES */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mb-16"
        >
          <div className="flex items-center gap-3 mb-6">
            <Lock className="w-3.5 h-3.5 text-grey-500" />
            <h3 className="text-xs uppercase tracking-[0.4em] text-grey-400 font-medium">
              Sealed Nodes — Monitoring Active
            </h3>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {sealedNodes.map((node, i) => {
              const component = (
                <ConstellationNode key={node.id} node={node} index={i} globalIndex={globalIndex} />
              );
              globalIndex++;
              return component;
            })}
          </div>
        </motion.div>

        {/* DORMANT NODES */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          <div className="flex items-center gap-3 mb-4">
            <CircleDot className="w-3.5 h-3.5 text-grey-600" />
            <h3 className="text-xs uppercase tracking-[0.4em] text-grey-500 font-medium">
              Dormant Nodes — Infrastructure Reserved
            </h3>
          </div>
          <p className="text-grey-600 text-xs mb-6 max-w-xl">
            Capacity allocated for future activation. Each node represents planned expansion 
            into regulated, capital-intensive, or irreversible decision domains.
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {dormantNodes.map((node, i) => {
              const component = (
                <ConstellationNode key={node.id} node={node} index={i} globalIndex={globalIndex} />
              );
              globalIndex++;
              return component;
            })}
          </div>
        </motion.div>

        {/* Empire Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3, duration: 0.8 }}
          className="mt-16 pt-12 border-t border-grey-800/20"
        >
          <div className="grid grid-cols-4 gap-6 max-w-2xl mx-auto text-center">
            {[
              { value: liveNodes.length, label: "Live", color: "text-primary" },
              { value: sealedNodes.length, label: "Sealed", color: "text-grey-400" },
              { value: dormantNodes.length, label: "Dormant", color: "text-grey-600" },
              { value: liveNodes.length + sealedNodes.length + dormantNodes.length, label: "Total Nodes", color: "text-foreground/60" },
            ].map((stat, i) => (
              <div key={i}>
                <span className={`text-2xl md:text-3xl font-light ${stat.color}`}>{stat.value}</span>
                <span className="block text-[9px] uppercase tracking-[0.2em] text-grey-500 mt-2">{stat.label}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}

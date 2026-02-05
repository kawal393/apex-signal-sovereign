import { motion } from "framer-motion";
import { useState, useEffect } from "react";

interface Signal {
  id: string;
  nodeId: string;
  nodeName: string;
  signalType: string;
  message: string;
  intensity: number;
  timestamp: Date;
}

// Simulated live signals
const generateSignal = (id: number): Signal => {
  const nodes = [
    { id: "ndis", name: "APEX NDIS Watchtower" },
    { id: "translator", name: "APEX Corporate Translator" },
    { id: "ledger", name: "APEX-ATA Ledger" },
    { id: "core", name: "APEX Core" },
  ];
  const types = ["compliance", "verdict", "audit", "alert", "sync"];
  const messages = [
    "Compliance threshold exceeded in sector 7",
    "New verdict processed and verified",
    "Immutable entry recorded to ledger",
    "Signal propagation complete",
    "Node synchronization achieved",
    "Behavioral pattern detected",
    "Access request evaluated",
    "Sovereign signal transmitted",
  ];
  
  const node = nodes[Math.floor(Math.random() * nodes.length)];
  return {
    id: `sig-${id}`,
    nodeId: node.id,
    nodeName: node.name,
    signalType: types[Math.floor(Math.random() * types.length)],
    message: messages[Math.floor(Math.random() * messages.length)],
    intensity: 0.3 + Math.random() * 0.7,
    timestamp: new Date(),
  };
};

export default function ActivityFeed() {
  const [signals, setSignals] = useState<Signal[]>([]);
  const [isLive, setIsLive] = useState(true);

  // Initialize with some signals
  useEffect(() => {
    const initial = Array.from({ length: 5 }, (_, i) => generateSignal(i));
    setSignals(initial);
  }, []);

  // Simulate live updates
  useEffect(() => {
    if (!isLive) return;
    
    const interval = setInterval(() => {
      setSignals(prev => {
        const newSignal = generateSignal(Date.now());
        return [newSignal, ...prev.slice(0, 7)];
      });
    }, 4000 + Math.random() * 3000);

    return () => clearInterval(interval);
  }, [isLive]);

  const getIntensityColor = (intensity: number) => {
    if (intensity >= 0.8) return "bg-primary";
    if (intensity >= 0.5) return "bg-silver-mid";
    return "bg-grey-500";
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit', 
      second: '2-digit',
      hour12: false 
    });
  };

  return (
    <section className="px-6 py-24 md:py-32 border-b border-border/5 relative overflow-hidden">
      <div className="max-w-4xl mx-auto">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          viewport={{ once: true }}
          className="mb-12 flex items-center justify-between"
        >
          <div>
            <span className="text-[11px] uppercase tracking-[0.6em] text-grey-500 mb-4 block font-medium">
              System Activity
            </span>
            <h2 className="text-3xl md:text-4xl font-extralight text-grey-300 tracking-wide">
              Live <span className="text-gradient-gold font-medium">Signal Feed</span>
            </h2>
          </div>
          
          <motion.button
            onClick={() => setIsLive(!isLive)}
            className={`flex items-center gap-3 px-4 py-2 rounded-full border transition-all duration-500 ${
              isLive 
                ? 'border-primary/40 bg-primary/10' 
                : 'border-grey-700 bg-grey-800/50'
            }`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <motion.div
              className={`w-2 h-2 rounded-full ${isLive ? 'bg-primary' : 'bg-grey-600'}`}
              animate={isLive ? { opacity: [0.5, 1, 0.5], scale: [0.9, 1.1, 0.9] } : {}}
              transition={{ duration: 1.5, repeat: Infinity }}
            />
            <span className={`text-[10px] uppercase tracking-widest ${isLive ? 'text-primary' : 'text-grey-500'}`}>
              {isLive ? 'Live' : 'Paused'}
            </span>
          </motion.button>
        </motion.div>

        {/* Feed Container */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="rounded-lg bg-grey-900/50 border border-grey-800/30 backdrop-blur-xl overflow-hidden"
        >
          {/* Header bar */}
          <div className="px-6 py-4 border-b border-grey-800/30 flex items-center justify-between">
            <span className="text-[10px] uppercase tracking-widest text-grey-500">
              Node Transmissions
            </span>
            <span className="text-[10px] text-grey-600 font-mono">
              {signals.length} signals
            </span>
          </div>

          {/* Signals list */}
          <div className="divide-y divide-grey-800/20">
            {signals.map((signal, index) => (
              <motion.div
                key={signal.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.5, delay: index * 0.05 }}
                className="px-6 py-4 hover:bg-grey-800/20 transition-colors group"
              >
                <div className="flex items-start gap-4">
                  {/* Intensity indicator */}
                  <div className="flex flex-col items-center gap-1 pt-1">
                    <motion.div
                      className={`w-2 h-2 rounded-full ${getIntensityColor(signal.intensity)}`}
                      animate={{ opacity: [0.5, 1, 0.5] }}
                      transition={{ duration: 2, repeat: Infinity, delay: index * 0.2 }}
                    />
                    <div className="w-px h-8 bg-grey-800" />
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-1">
                      <span className="text-sm text-grey-300 font-medium truncate">
                        {signal.nodeName}
                      </span>
                      <span className="text-[9px] uppercase tracking-widest text-primary/60 bg-primary/10 px-2 py-0.5 rounded">
                        {signal.signalType}
                      </span>
                    </div>
                    <p className="text-sm text-grey-500 leading-relaxed">
                      {signal.message}
                    </p>
                  </div>

                  {/* Timestamp */}
                  <div className="text-right shrink-0">
                    <span className="text-[10px] text-grey-600 font-mono">
                      {formatTime(signal.timestamp)}
                    </span>
                    <div className="text-xs text-grey-700 mt-1">
                      {Math.round(signal.intensity * 100)}%
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}

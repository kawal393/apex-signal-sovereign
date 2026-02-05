import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import ApexFooter from "@/components/layout/ApexFooter";
import SovereignVoid from "@/components/3d/SovereignVoid";
import apexLogo from "@/assets/apex-logo.png";

interface ActivityEvent {
  id: string;
  type: "signal" | "node" | "system" | "access";
  message: string;
  timestamp: Date;
  intensity: number;
}

const generateMockActivity = (): ActivityEvent[] => {
  const events: ActivityEvent[] = [
    { id: "1", type: "signal", message: "APEX NDIS Watchtower emitted compliance signal", timestamp: new Date(Date.now() - 120000), intensity: 0.8 },
    { id: "2", type: "node", message: "Corporate Translator node processed 47 verdicts", timestamp: new Date(Date.now() - 300000), intensity: 0.6 },
    { id: "3", type: "system", message: "Behavioral threshold exceeded by Observer-7721", timestamp: new Date(Date.now() - 480000), intensity: 0.9 },
    { id: "4", type: "access", message: "Access request submitted from sector 12", timestamp: new Date(Date.now() - 720000), intensity: 0.4 },
    { id: "5", type: "signal", message: "APEX-ATA Ledger recorded immutable entry", timestamp: new Date(Date.now() - 1200000), intensity: 0.7 },
    { id: "6", type: "system", message: "Inner Circle quorum achieved for proposal #221", timestamp: new Date(Date.now() - 1800000), intensity: 1.0 },
  ];
  return events;
};

const Dashboard = () => {
  const [scrollDepth, setScrollDepth] = useState(0);
  const voidActive = scrollDepth < 0.2;
  const [activity] = useState<ActivityEvent[]>(generateMockActivity());
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      const depth = maxScroll > 0 ? window.scrollY / maxScroll : 0;
      setScrollDepth(depth);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const formatTimestamp = (date: Date) => {
    const diff = Date.now() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    return `${hours}h ago`;
  };

  const getEventColor = (type: ActivityEvent["type"]) => {
    switch (type) {
      case "signal": return "text-primary";
      case "node": return "text-silver-light";
      case "system": return "text-purple-light";
      case "access": return "text-crimson-bright";
      default: return "text-grey-400";
    }
  };

  // Mock user stats
  const userStats = {
    level: "Observer",
    levelNum: 1,
    patienceScore: 0.73,
    curiosityScore: 0.82,
    timeSpent: "4h 27m",
    nodesViewed: 12,
    scrollDepthMax: 0.94,
    visits: 7,
  };

  return (
    <div className="relative min-h-screen bg-black">
      {/* 3D Void Background */}
      <SovereignVoid active={voidActive} scrollDepth={scrollDepth} className="fixed inset-0 z-0" />
      
      {/* Atmospheric overlays */}
      <div className="fixed inset-0 pointer-events-none z-[1]">
        <div className="absolute inset-0 bg-black/60" />
      </div>

      {/* Main Content */}
      <main className="relative z-10 px-6 py-12 lg:py-20">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            className="flex items-center justify-between mb-12"
          >
            <div className="flex items-center gap-6">
              <img src={apexLogo} alt="APEX" className="w-12 h-12 opacity-60" />
              <div>
                <h1 className="text-3xl md:text-4xl font-extralight text-grey-200 tracking-wide">
                  Observer <span className="text-gradient-gold font-medium">Dashboard</span>
                </h1>
                <p className="text-sm text-grey-500 mt-1">Your presence within the system</p>
              </div>
            </div>
            <div className="hidden md:block text-right">
              <div className="text-2xl font-mono text-grey-300">
                {currentTime.toLocaleTimeString('en-US', { hour12: false })}
              </div>
              <div className="text-xs text-grey-600 uppercase tracking-widest">
                System Time
              </div>
            </div>
          </motion.div>

          {/* Stats Grid */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12"
          >
            {[
              { label: "Access Level", value: userStats.level, sub: `Level ${userStats.levelNum}` },
              { label: "Patience Score", value: `${Math.round(userStats.patienceScore * 100)}%`, sub: "Behavioral metric" },
              { label: "Curiosity Index", value: `${Math.round(userStats.curiosityScore * 100)}%`, sub: "Exploration depth" },
              { label: "Total Time", value: userStats.timeSpent, sub: `${userStats.visits} visits` },
            ].map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + i * 0.1 }}
                className="p-6 rounded-lg bg-grey-900/70 border border-grey-800/50 backdrop-blur-xl"
              >
                <div className="text-[10px] uppercase tracking-[0.25em] text-grey-500 mb-2">
                  {stat.label}
                </div>
                <div className="text-2xl md:text-3xl font-light text-grey-200 mb-1">
                  {stat.value}
                </div>
                <div className="text-xs text-grey-600">{stat.sub}</div>
              </motion.div>
            ))}
          </motion.div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Activity Feed */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 1, delay: 0.4 }}
              className="lg:col-span-2 rounded-lg bg-grey-900/60 border border-grey-800/40 backdrop-blur-xl p-6"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-light text-grey-200 tracking-wide">
                  Live Activity Feed
                </h2>
                <motion.div
                  className="flex items-center gap-2"
                  animate={{ opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <div className="w-2 h-2 rounded-full bg-primary" />
                  <span className="text-[10px] uppercase tracking-widest text-primary/70">Live</span>
                </motion.div>
              </div>

              <div className="space-y-4">
                {activity.map((event, i) => (
                  <motion.div
                    key={event.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 + i * 0.1 }}
                    className="flex items-start gap-4 p-4 rounded-md bg-grey-800/30 border border-grey-800/30 hover:border-grey-700/50 transition-colors"
                  >
                    <div 
                      className={`w-1 h-full min-h-[40px] rounded-full ${getEventColor(event.type)}`}
                      style={{ opacity: event.intensity }}
                    />
                    <div className="flex-1">
                      <p className="text-sm text-grey-300 leading-relaxed">
                        {event.message}
                      </p>
                      <div className="flex items-center gap-3 mt-2">
                        <span className={`text-[9px] uppercase tracking-widest ${getEventColor(event.type)}`}>
                          {event.type}
                        </span>
                        <span className="text-[9px] text-grey-600">
                          {formatTimestamp(event.timestamp)}
                        </span>
                      </div>
                    </div>
                    <div className="text-grey-700">
                      <span className="text-lg">{event.intensity >= 0.8 ? '◆' : event.intensity >= 0.5 ? '◈' : '◇'}</span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Behavioral Profile */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 1, delay: 0.5 }}
              className="rounded-lg bg-grey-900/60 border border-grey-800/40 backdrop-blur-xl p-6"
            >
              <h2 className="text-xl font-light text-grey-200 tracking-wide mb-6">
                Behavioral Profile
              </h2>

              <div className="space-y-6">
                {/* Patience meter */}
                <div>
                  <div className="flex justify-between text-xs mb-2">
                    <span className="text-grey-500 uppercase tracking-widest">Patience</span>
                    <span className="text-silver-light">{Math.round(userStats.patienceScore * 100)}%</span>
                  </div>
                  <div className="h-2 bg-grey-800 rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-gradient-to-r from-silver-dark to-silver-light rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: `${userStats.patienceScore * 100}%` }}
                      transition={{ duration: 1.5, delay: 0.8 }}
                    />
                  </div>
                </div>

                {/* Curiosity meter */}
                <div>
                  <div className="flex justify-between text-xs mb-2">
                    <span className="text-grey-500 uppercase tracking-widest">Curiosity</span>
                    <span className="text-primary">{Math.round(userStats.curiosityScore * 100)}%</span>
                  </div>
                  <div className="h-2 bg-grey-800 rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-gradient-to-r from-gold-deep to-primary rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: `${userStats.curiosityScore * 100}%` }}
                      transition={{ duration: 1.5, delay: 0.9 }}
                    />
                  </div>
                </div>

                {/* Depth meter */}
                <div>
                  <div className="flex justify-between text-xs mb-2">
                    <span className="text-grey-500 uppercase tracking-widest">Max Depth</span>
                    <span className="text-purple-light">{Math.round(userStats.scrollDepthMax * 100)}%</span>
                  </div>
                  <div className="h-2 bg-grey-800 rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-gradient-to-r from-purple-deep to-purple-light rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: `${userStats.scrollDepthMax * 100}%` }}
                      transition={{ duration: 1.5, delay: 1.0 }}
                    />
                  </div>
                </div>

                {/* Additional stats */}
                <div className="pt-6 border-t border-grey-800/50 space-y-4">
                  <div className="flex justify-between">
                    <span className="text-xs text-grey-500">Nodes Viewed</span>
                    <span className="text-sm text-grey-300">{userStats.nodesViewed}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-xs text-grey-500">Visit Count</span>
                    <span className="text-sm text-grey-300">{userStats.visits}</span>
                  </div>
                </div>

                {/* Level progress */}
                <div className="pt-6 border-t border-grey-800/50">
                  <div className="text-center">
                    <span className="text-[10px] uppercase tracking-widest text-grey-600 block mb-2">
                      Progress to Acknowledged
                    </span>
                    <div className="text-3xl font-light text-grey-300 mb-4">62%</div>
                    <div className="h-1 bg-grey-800 rounded-full overflow-hidden">
                      <motion.div
                        className="h-full bg-gradient-to-r from-silver-mid to-primary rounded-full"
                        initial={{ width: 0 }}
                        animate={{ width: "62%" }}
                        transition={{ duration: 2, delay: 1.2 }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </main>

      <ApexFooter />
    </div>
  );
};

export default Dashboard;

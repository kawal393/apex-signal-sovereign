import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import ApexFooter from "@/components/layout/ApexFooter";
import ApexNav from "@/components/layout/ApexNav";
import { supabase } from "@/integrations/supabase/client";
import apexLogo from "@/assets/apex-logo.png";
import { useApexSystem } from "@/contexts/ApexSystemContext";

const Dashboard = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const { patienceScore, curiosityScore, status, returnCount } = useApexSystem();

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Fetch real visitor stats
  const { data: visitorStats } = useQuery({
    queryKey: ['visitor-stats'],
    queryFn: async () => {
      const { data: profiles } = await supabase
        .from('visitor_profiles')
        .select('access_level, patience_score, curiosity_score, total_time_seconds');
      
      if (!profiles) return null;

      const tierCounts = {
        observer: profiles.filter(p => p.access_level === 'observer').length,
        acknowledged: profiles.filter(p => p.access_level === 'acknowledged').length,
        considered: profiles.filter(p => p.access_level === 'considered').length,
      };

      const avgPatience = profiles.reduce((sum, p) => sum + (p.patience_score || 0), 0) / profiles.length;
      const avgCuriosity = profiles.reduce((sum, p) => sum + (p.curiosity_score || 0), 0) / profiles.length;

      return { total: profiles.length, tierCounts, avgPatience, avgCuriosity };
    },
    refetchInterval: 30000,
  });

  // Fetch AI intelligence logs
  const { data: aiLogs } = useQuery({
    queryKey: ['ai-logs'],
    queryFn: async () => {
      const { data } = await supabase
        .from('ai_intelligence_logs')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(10);
      return data || [];
    },
    refetchInterval: 15000,
  });

  // Fetch recent access requests
  const { data: accessRequests } = useQuery({
    queryKey: ['access-requests'],
    queryFn: async () => {
      const { data } = await supabase
        .from('access_requests')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(10);
      return data || [];
    },
    refetchInterval: 30000,
  });

  // Fetch scheduled insights
  const { data: scheduledInsights } = useQuery({
    queryKey: ['scheduled-insights'],
    queryFn: async () => {
      const { data } = await supabase
        .from('scheduled_insights')
        .select('*')
        .order('generated_at', { ascending: false })
        .limit(10);
      return data || [];
    },
    refetchInterval: 30000,
  });

  const formatTimestamp = (date: string) => {
    const d = new Date(date);
    const diff = Date.now() - d.getTime();
    const minutes = Math.floor(diff / 60000);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    return `${Math.floor(hours / 24)}d ago`;
  };

  const getLogTypeColor = (type: string) => {
    switch (type) {
      case 'classification': return 'text-purple-light';
      case 'verdict_generation': return 'text-primary';
      case 'oracle_response': return 'text-silver-light';
      case 'scheduled_cycle': return 'text-crimson-bright';
      default: return 'text-grey-400';
    }
  };

  const getInsightTypeColor = (type: string) => {
    switch (type) {
      case 're_engagement': return 'text-primary border-primary/20 bg-primary/5';
      case 'threshold_alert': return 'text-purple-light border-purple-mid/20 bg-purple-mid/5';
      case 'signal_digest': return 'text-silver-light border-silver-mid/20 bg-silver-mid/5';
      default: return 'text-grey-400 border-grey-700/20 bg-grey-800/5';
    }
  };

  return (
    <div className="relative min-h-screen bg-black">
      {/* Background gradient */}
      <div className="fixed inset-0 bg-gradient-to-b from-[hsl(260,20%,3%)] via-[hsl(260,15%,2%)] to-black" />
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_60%_40%_at_50%_20%,hsl(42_80%_50%_/_0.04),transparent)]" />

      <ApexNav />

      {/* Main Content */}
      <main className="relative z-10 px-6 py-24 lg:py-32">
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
                  Intelligence <span className="text-gradient-gold font-medium">Dashboard</span>
                </h1>
                <p className="text-sm text-grey-500 mt-1">AI Brain Operations Monitor</p>
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

          {/* Your Status Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.1 }}
            className="mb-8 p-6 rounded-lg bg-grey-900/50 border border-primary/20 backdrop-blur-xl"
          >
            <div className="flex items-center gap-4 mb-4">
              <span className="text-2xl text-primary">◆</span>
              <h2 className="text-lg font-light text-grey-200">Your Presence</h2>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <div className="text-[10px] uppercase tracking-widest text-grey-500 mb-1">Status</div>
                <div className="text-xl font-light text-primary capitalize">{status}</div>
              </div>
              <div>
                <div className="text-[10px] uppercase tracking-widest text-grey-500 mb-1">Patience</div>
                <div className="text-xl font-light text-silver-light">{Math.round(patienceScore * 100)}%</div>
              </div>
              <div>
                <div className="text-[10px] uppercase tracking-widest text-grey-500 mb-1">Curiosity</div>
                <div className="text-xl font-light text-primary">{Math.round(curiosityScore * 100)}%</div>
              </div>
              <div>
                <div className="text-[10px] uppercase tracking-widest text-grey-500 mb-1">Visits</div>
                <div className="text-xl font-light text-grey-300">{returnCount}</div>
              </div>
            </div>
          </motion.div>

          {/* System Stats Grid */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12"
          >
            {[
              { label: "Total Visitors", value: visitorStats?.total || 0, sub: "Tracked profiles" },
              { label: "Observers", value: visitorStats?.tierCounts?.observer || 0, sub: "Entry tier" },
              { label: "Acknowledged", value: visitorStats?.tierCounts?.acknowledged || 0, sub: "Elevated tier" },
              { label: "Inner Circle", value: visitorStats?.tierCounts?.considered || 0, sub: "Maximum access" },
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

          <div className="grid lg:grid-cols-2 gap-8">
            {/* AI Activity Feed */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 1, delay: 0.4 }}
              className="rounded-lg bg-grey-900/60 border border-grey-800/40 backdrop-blur-xl p-6"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-light text-grey-200 tracking-wide">
                  AI Intelligence Logs
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

              <div className="space-y-3 max-h-[400px] overflow-y-auto">
                {aiLogs?.map((log, i) => (
                  <motion.div
                    key={log.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 + i * 0.05 }}
                    className="p-3 rounded-md bg-grey-800/30 border border-grey-800/30"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className={`text-[9px] uppercase tracking-widest ${getLogTypeColor(log.log_type)}`}>
                        {log.log_type.replace('_', ' ')}
                      </span>
                      <span className="text-[9px] text-grey-600">{formatTimestamp(log.created_at)}</span>
                    </div>
                    <p className="text-xs text-grey-400">
                      {log.trigger_source} • {log.processing_time_ms ? `${log.processing_time_ms}ms` : 'async'}
                    </p>
                  </motion.div>
                ))}
                {(!aiLogs || aiLogs.length === 0) && (
                  <p className="text-sm text-grey-600 text-center py-8">No AI activity logged yet</p>
                )}
              </div>
            </motion.div>

            {/* Access Requests */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 1, delay: 0.5 }}
              className="rounded-lg bg-grey-900/60 border border-grey-800/40 backdrop-blur-xl p-6"
            >
              <h2 className="text-xl font-light text-grey-200 tracking-wide mb-6">
                Verdict Brief Requests
              </h2>

              <div className="space-y-3 max-h-[400px] overflow-y-auto">
                {accessRequests?.map((request, i) => (
                  <motion.div
                    key={request.id}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 + i * 0.05 }}
                    className="p-3 rounded-md bg-grey-800/30 border border-grey-800/30"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-grey-300">{request.organization || 'Anonymous'}</span>
                      <span className={`text-[9px] uppercase tracking-widest px-2 py-0.5 rounded ${
                        request.status === 'pending' ? 'text-primary bg-primary/10' :
                        request.status === 'approved' ? 'text-green-400 bg-green-400/10' :
                        'text-grey-500 bg-grey-800/50'
                      }`}>
                        {request.status}
                      </span>
                    </div>
                    <p className="text-xs text-grey-500 line-clamp-2">{request.intent}</p>
                    {request.ai_risk_score && (
                      <div className="mt-2 flex items-center gap-2">
                        <span className="text-[9px] text-grey-600">Risk Score:</span>
                        <span className={`text-[9px] font-medium ${
                          request.ai_risk_score > 0.7 ? 'text-crimson-bright' :
                          request.ai_risk_score > 0.4 ? 'text-primary' :
                          'text-green-400'
                        }`}>
                          {Math.round(request.ai_risk_score * 100)}%
                        </span>
                      </div>
                    )}
                  </motion.div>
                ))}
                {(!accessRequests || accessRequests.length === 0) && (
                  <p className="text-sm text-grey-600 text-center py-8">No requests yet</p>
                )}
              </div>
            </motion.div>
          </div>

          {/* Scheduled Insights */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.6 }}
            className="mt-8 rounded-lg bg-grey-900/60 border border-grey-800/40 backdrop-blur-xl p-6"
          >
            <h2 className="text-xl font-light text-grey-200 tracking-wide mb-6">
              Scheduled Intelligence
            </h2>

            <div className="grid md:grid-cols-3 gap-4">
              {scheduledInsights?.slice(0, 6).map((insight, i) => (
                <motion.div
                  key={insight.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7 + i * 0.05 }}
                  className={`p-4 rounded-lg border ${getInsightTypeColor(insight.insight_type)}`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[9px] uppercase tracking-widest">
                      {insight.insight_type.replace('_', ' ')}
                    </span>
                    {insight.delivered ? (
                      <span className="text-[8px] text-green-400">✓ Delivered</span>
                    ) : (
                      <span className="text-[8px] text-grey-500">Pending</span>
                    )}
                  </div>
                  <p className="text-xs text-grey-300 line-clamp-3">{insight.content}</p>
                  <div className="mt-2 text-[9px] text-grey-600">
                    {formatTimestamp(insight.generated_at)}
                  </div>
                </motion.div>
              ))}
              {(!scheduledInsights || scheduledInsights.length === 0) && (
                <p className="text-sm text-grey-600 text-center py-8 col-span-3">
                  No scheduled insights yet. The AI brain will generate proactive intelligence.
                </p>
              )}
            </div>
          </motion.div>
        </div>
      </main>

      <ApexFooter />
    </div>
  );
};

export default Dashboard;
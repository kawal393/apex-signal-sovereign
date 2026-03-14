import { useState } from "react";
import { motion } from "framer-motion";
import { Activity, Database, Play, RefreshCw, Zap, Globe, Shield, Clock, AlertTriangle, CheckCircle, BarChart3 } from "lucide-react";
import ApexNav from "@/components/layout/ApexNav";
import ApexFooter from "@/components/layout/ApexFooter";
import MobileVoid from "@/components/effects/MobileVoid";
import { useIsMobile } from "@/hooks/use-mobile";
import { useIntelligenceData } from "@/hooks/useIntelligenceData";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const scraperIcons: Record<string, typeof Activity> = {
  'mining-scraper': Activity,
  'regulatory-monitor': Globe,
  'ndis-scraper': Shield,
  'pharma-scanner': AlertTriangle,
  'court-crawler': BarChart3,
  'asx-scanner': Zap,
  'global-sanctions': Globe,
  'company-scanner': Database,
};

const IntelligenceCenter = () => {
  const isMobile = useIsMobile();
  const { scrapers, totalRecords, loading, refresh } = useIntelligenceData();
  const { toast } = useToast();
  const [triggering, setTriggering] = useState<string | null>(null);

  const triggerScraper = async (edgeFunction: string, batch = 0) => {
    setTriggering(edgeFunction);
    try {
      const { data, error } = await supabase.functions.invoke(edgeFunction, {
        body: {},
      });
      if (error) throw error;
      toast({
        title: "Scraper Triggered",
        description: `${edgeFunction} batch ${batch}: ${data?.inserted || 0} records inserted`,
      });
      setTimeout(refresh, 2000);
    } catch (err) {
      toast({
        title: "Trigger Failed",
        description: `${edgeFunction}: ${err instanceof Error ? err.message : 'Unknown error'}`,
        variant: "destructive",
      });
    } finally {
      setTriggering(null);
    }
  };

  const formatTime = (iso: string | null) => {
    if (!iso) return "Never";
    const d = new Date(iso);
    const now = new Date();
    const diff = now.getTime() - d.getTime();
    if (diff < 60000) return "Just now";
    if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
    if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`;
    return `${Math.floor(diff / 86400000)}d ago`;
  };

  return (
    <div className="relative min-h-screen bg-black">
      {isMobile && <MobileVoid />}
      <div className="fixed inset-0 pointer-events-none z-[1]">
        <div className="absolute inset-0 bg-black/80" />
      </div>

      <ApexNav />

      <main className="relative z-10 pt-32 pb-24 px-6">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
            className="text-center mb-16"
          >
            <span className="text-[10px] uppercase tracking-[0.6em] text-grey-300 block mb-4">
              Mission Control
            </span>
            <h1 className="text-4xl md:text-5xl font-semibold text-foreground tracking-wide mb-6">
              Intelligence <span className="text-gradient-gold">Command Center</span>
            </h1>
            <p className="text-grey-400 text-sm max-w-lg mx-auto">
              8 autonomous data pipelines harvesting enforcement, compliance, and regulatory intelligence globally.
            </p>
          </motion.div>

          {/* Total Records Counter */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="text-center mb-12"
          >
            <div className="inline-flex items-center gap-6 px-10 py-6 rounded-lg border border-primary/30 bg-primary/5">
              <Database className="w-8 h-8 text-primary" />
              <div>
                <motion.div
                  className="text-4xl md:text-5xl font-bold tabular-nums"
                  style={{ background: "linear-gradient(135deg, hsl(42 95% 55%), hsl(42 80% 70%))", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}
                >
                  {loading ? "..." : totalRecords.toLocaleString()}
                </motion.div>
                <span className="text-[10px] uppercase tracking-[0.4em] text-grey-400">Total Intelligence Records</span>
              </div>
              <motion.button
                onClick={refresh}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="p-2 rounded-md border border-border/30 hover:border-primary/40 transition-colors"
              >
                <RefreshCw className={`w-4 h-4 text-grey-400 ${loading ? 'animate-spin' : ''}`} />
              </motion.button>
            </div>
          </motion.div>

          {/* Pipeline Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
            {scrapers.map((scraper, i) => {
              const Icon = scraperIcons[scraper.name] || Activity;
              const isActive = triggering === scraper.edgeFunction;

              return (
                <motion.div
                  key={scraper.name}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 + i * 0.06, duration: 0.6 }}
                  className="relative p-5 rounded-lg border border-border/20 bg-card/40 backdrop-blur-sm hover:border-primary/30 transition-all duration-500 group"
                >
                  {/* Status indicator */}
                  <div className="absolute top-3 right-3">
                    {scraper.lastStatus === 'completed' ? (
                      <CheckCircle className="w-3.5 h-3.5 text-green-400" />
                    ) : scraper.lastStatus === 'partial' ? (
                      <AlertTriangle className="w-3.5 h-3.5 text-yellow-400" />
                    ) : (
                      <Clock className="w-3.5 h-3.5 text-grey-600" />
                    )}
                  </div>

                  <Icon className="w-5 h-5 text-primary mb-3" />
                  <h3 className="text-sm font-medium text-foreground/90 tracking-wide mb-1">{scraper.label}</h3>
                  <div className="text-2xl font-bold text-foreground tabular-nums mb-2">
                    {scraper.count.toLocaleString()}
                  </div>

                  <div className="space-y-1 mb-4">
                    <div className="flex justify-between text-[9px] text-grey-500">
                      <span>Last Run</span>
                      <span>{formatTime(scraper.lastRun)}</span>
                    </div>
                    <div className="flex justify-between text-[9px] text-grey-500">
                      <span>Schedule</span>
                      <span>{scraper.schedule}</span>
                    </div>
                    {scraper.lastDuration && (
                      <div className="flex justify-between text-[9px] text-grey-500">
                        <span>Duration</span>
                        <span>{(scraper.lastDuration / 1000).toFixed(1)}s</span>
                      </div>
                    )}
                  </div>

                  <motion.button
                    onClick={() => triggerScraper(scraper.edgeFunction)}
                    disabled={isActive}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-md border border-primary/30 bg-primary/5 hover:bg-primary/15 text-primary text-[10px] uppercase tracking-[0.2em] transition-all disabled:opacity-50"
                  >
                    {isActive ? (
                      <RefreshCw className="w-3 h-3 animate-spin" />
                    ) : (
                      <Play className="w-3 h-3" />
                    )}
                    {isActive ? "Running..." : "Trigger"}
                  </motion.button>
                </motion.div>
              );
            })}
          </div>

          {/* Data Pipeline Visualization */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.8 }}
            className="rounded-lg border border-border/20 bg-card/30 p-8 mb-12"
          >
            <span className="text-[10px] uppercase tracking-[0.4em] text-grey-400 block mb-6 text-center">
              Data Pipeline Architecture
            </span>
            <div className="flex items-center justify-center gap-4 md:gap-8 flex-wrap">
              {[
                { label: "Internet Sources", icon: Globe, color: "text-blue-400" },
                { label: "→", icon: null, color: "" },
                { label: "Firecrawl + AI", icon: Zap, color: "text-primary" },
                { label: "→", icon: null, color: "" },
                { label: "8 Scrapers", icon: Activity, color: "text-green-400" },
                { label: "→", icon: null, color: "" },
                { label: "SHA-256 Dedup", icon: Shield, color: "text-purple-400" },
                { label: "→", icon: null, color: "" },
                { label: "Database", icon: Database, color: "text-primary" },
              ].map((step, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1 + i * 0.1 }}
                  className="flex flex-col items-center gap-1"
                >
                  {step.icon ? (
                    <>
                      <step.icon className={`w-5 h-5 ${step.color}`} />
                      <span className="text-[8px] uppercase tracking-[0.2em] text-grey-500">{step.label}</span>
                    </>
                  ) : (
                    <span className="text-primary/40 text-lg">→</span>
                  )}
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Recent Scraper Runs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1, duration: 0.8 }}
            className="rounded-lg border border-border/20 bg-card/30 p-8"
          >
            <span className="text-[10px] uppercase tracking-[0.4em] text-grey-400 block mb-4">
              System Status
            </span>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-4 rounded-md border border-border/10">
                <div className="text-2xl font-bold text-green-400 tabular-nums">8</div>
                <span className="text-[9px] text-grey-500 uppercase tracking-wider">Active Pipelines</span>
              </div>
              <div className="text-center p-4 rounded-md border border-border/10">
                <div className="text-2xl font-bold text-primary tabular-nums">{totalRecords.toLocaleString()}</div>
                <span className="text-[9px] text-grey-500 uppercase tracking-wider">Total Records</span>
              </div>
              <div className="text-center p-4 rounded-md border border-border/10">
                <div className="text-2xl font-bold text-blue-400 tabular-nums">25+</div>
                <span className="text-[9px] text-grey-500 uppercase tracking-wider">Countries Covered</span>
              </div>
              <div className="text-center p-4 rounded-md border border-border/10">
                <div className="text-2xl font-bold text-purple-400 tabular-nums">SHA-256</div>
                <span className="text-[9px] text-grey-500 uppercase tracking-wider">Deduplication</span>
              </div>
            </div>
          </motion.div>
        </div>
      </main>

      <ApexFooter />
    </div>
  );
};

export default IntelligenceCenter;

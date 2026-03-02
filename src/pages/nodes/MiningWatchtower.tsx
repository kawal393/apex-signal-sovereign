import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Database, Loader2, AlertTriangle, Lock, Eye, EyeOff, Shield } from "lucide-react";
import { Link } from "react-router-dom";
import ApexNav from "@/components/layout/ApexNav";
import ApexFooter from "@/components/layout/ApexFooter";
import AmbientParticles from "@/components/effects/AmbientParticles";
import { ApexButton } from "@/components/ui/apex-button";
import WatchtowerFilters from "@/components/watchtower/WatchtowerFilters";
import WatchtowerStats from "@/components/watchtower/WatchtowerStats";
import RiskBadge from "@/components/watchtower/RiskBadge";
import { useMiningData, useFilteredMining } from "@/hooks/useWatchtowerData";
import { useAuth } from "@/contexts/AuthContext";

const PREVIEW_LIMIT = 4;

export default function MiningWatchtower() {
  const { data, meta, loading, error } = useMiningData();
  const { user } = useAuth();
  const [search, setSearch] = useState("");
  const [stateFilter, setStateFilter] = useState("");
  const [riskFilter, setRiskFilter] = useState("");
  const [sourceFilter, setSourceFilter] = useState("");

  const filtered = useFilteredMining(data, search, stateFilter, riskFilter, sourceFilter);
  const isUnlocked = !!user;
  const visibleData = isUnlocked ? filtered : filtered.slice(0, PREVIEW_LIMIT);
  const hiddenCount = isUnlocked ? 0 : Math.max(0, filtered.length - PREVIEW_LIMIT);

  const uniqueStates = useMemo(() => [...new Set(data.map(s => s.state))].sort(), [data]);
  const uniqueRisks = useMemo(() => [...new Set(data.map(s => s.risk))].sort(), [data]);
  const uniqueSources = useMemo(() => [...new Set(data.map(s => s.source))].sort(), [data]);

  const highCount = useMemo(() => data.filter(s => s.risk === "HIGH").length, [data]);

  const stats = [
    { label: "Total Signals", value: meta?.total_signals || data.length },
    { label: "High Risk", value: highCount, color: "text-red-400" },
    { label: "States Covered", value: uniqueStates.length },
    { label: "Regulators", value: uniqueSources.length },
  ];

  return (
    <div className="relative min-h-screen bg-background">
      <AmbientParticles />
      <div className="fixed inset-0 pointer-events-none z-[1]">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,hsl(42_50%_15%/0.15)_0%,transparent_70%)]" />
      </div>

      <ApexNav />

      <main className="relative z-10 pt-32 pb-24 px-6 md:px-12 max-w-[1400px] mx-auto">
        <Link to="/commons" className="inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.3em] text-muted-foreground hover:text-foreground transition-colors mb-12">
          <ArrowLeft className="w-4 h-4" />
          Back to Portal
        </Link>

        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-12">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="max-w-3xl"
          >
            <div className="flex items-center gap-3 mb-4">
              <span className="status-active">LIVE FEED</span>
              <Database className="w-3.5 h-3.5 text-primary animate-pulse" />
              {meta?.generated && (
                <span className="text-[9px] uppercase tracking-[0.15em] text-muted-foreground">
                  Updated {new Date(meta.generated).toLocaleDateString()}
                </span>
              )}
            </div>
            <h1 className="text-3xl md:text-5xl font-semibold text-foreground tracking-wide mb-4">
              Mining <span className="text-gradient-gold">Watchtower</span>
            </h1>
            <p className="text-muted-foreground text-lg leading-relaxed">
              Live enforcement and compliance data from Australian state mining regulators.
              Tracking safety breaches, prosecutions, and prohibition notices across all jurisdictions.
            </p>
          </motion.div>

          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2, duration: 0.8 }} className="flex-shrink-0">
            <Link to="/request-verdict">
              <ApexButton variant="primary" size="lg" className="gap-2">
                <Lock className="w-4 h-4" /> Get Mining Intelligence
              </ApexButton>
            </Link>
          </motion.div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-32">
            <Loader2 className="w-8 h-8 text-primary animate-spin" />
            <span className="ml-3 text-muted-foreground">Loading mining enforcement data…</span>
          </div>
        ) : error ? (
          <div className="flex items-center justify-center py-32 text-destructive gap-3">
            <AlertTriangle className="w-6 h-6" />
            <span>Failed to load data: {error}</span>
          </div>
        ) : (
          <>
            <WatchtowerStats stats={stats} />

            <WatchtowerFilters
              search={search}
              onSearchChange={setSearch}
              searchPlaceholder="Search company or mine…"
              filters={[
                { label: "All States", value: stateFilter, options: uniqueStates, onChange: setStateFilter },
                { label: "All Risk", value: riskFilter, options: uniqueRisks, onChange: setRiskFilter },
                { label: "All Regulators", value: sourceFilter, options: uniqueSources, onChange: setSourceFilter },
              ]}
            />

            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.8 }}
              className="bg-card border border-border/20 rounded-xl overflow-hidden"
            >
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-border/30 text-[10px] uppercase tracking-[0.3em] text-muted-foreground bg-muted/20">
                      <th className="p-5 font-medium">Company</th>
                      <th className="p-5 font-medium">Mine</th>
                      <th className="p-5 font-medium">Action</th>
                      <th className="p-5 font-medium">Risk</th>
                      <th className="p-5 font-medium">State</th>
                      <th className="p-5 font-medium">Source</th>
                      <th className="p-5 font-medium">Date</th>
                    </tr>
                  </thead>
                  <tbody className="text-sm">
                    {visibleData.map((s, i) => (
                      <tr key={s.id || i} className="border-b border-border/10 hover:bg-muted/10 transition-colors">
                        <td className="p-5 text-foreground font-medium max-w-[200px] truncate">{s.company}</td>
                        <td className="p-5 text-muted-foreground max-w-[180px] truncate">{s.mine}</td>
                        <td className="p-5 text-muted-foreground">{s.action}</td>
                        <td className="p-5"><RiskBadge risk={s.risk} /></td>
                        <td className="p-5 text-muted-foreground">{s.state}</td>
                        <td className="p-5 text-muted-foreground text-xs">{s.source}</td>
                        <td className="p-5 text-muted-foreground font-mono text-xs">{s.date}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Membership Gate Overlay */}
              {!isUnlocked && hiddenCount > 0 && (
                <div className="relative">
                  {/* Blurred preview rows */}
                  <div className="overflow-hidden max-h-[160px] relative">
                    <table className="w-full text-left border-collapse blur-[6px] select-none pointer-events-none opacity-50">
                      <tbody className="text-sm">
                        {filtered.slice(PREVIEW_LIMIT, PREVIEW_LIMIT + 3).map((s, i) => (
                          <tr key={i} className="border-b border-border/10">
                            <td className="p-5 text-foreground font-medium">{s.company}</td>
                            <td className="p-5 text-muted-foreground">{s.mine}</td>
                            <td className="p-5 text-muted-foreground">{s.action}</td>
                            <td className="p-5"><RiskBadge risk={s.risk} /></td>
                            <td className="p-5 text-muted-foreground">{s.state}</td>
                            <td className="p-5 text-muted-foreground text-xs">{s.source}</td>
                            <td className="p-5 text-muted-foreground font-mono text-xs">{s.date}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/60 to-background" />
                  </div>

                  {/* CTA */}
                  <div className="flex flex-col items-center justify-center py-12 px-6 text-center">
                    <div className="w-16 h-16 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center mb-6">
                      <Shield className="w-7 h-7 text-primary" />
                    </div>
                    <h3 className="text-xl font-semibold text-foreground mb-2">
                      {hiddenCount} More Signals Behind the Gate
                    </h3>
                    <p className="text-muted-foreground text-sm max-w-md mb-6">
                      Full enforcement intelligence — every prosecution, every penalty, every state — 
                      is reserved for registered APEX members only.
                    </p>
                    <div className="flex items-center gap-4">
                      <Link to="/auth">
                        <ApexButton variant="primary" size="lg" className="gap-2">
                          <Lock className="w-4 h-4" /> Unlock Full Access
                        </ApexButton>
                      </Link>
                      <Link to="/auth">
                        <ApexButton variant="outline" size="lg" className="gap-2">
                          <Eye className="w-4 h-4" /> Login
                        </ApexButton>
                      </Link>
                    </div>
                    <p className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground mt-4">
                      Free registration • Instant access • No credit card
                    </p>
                  </div>
                </div>
              )}

              {filtered.length === 0 && (
                <div className="text-center py-16 text-muted-foreground">No signals match your filters.</div>
              )}
            </motion.div>
          </>
        )}
      </main>

      <ApexFooter />
    </div>
  );
}

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Database, Loader2, AlertTriangle, Lock } from "lucide-react";
import { Link } from "react-router-dom";
import ApexNav from "@/components/layout/ApexNav";
import ApexFooter from "@/components/layout/ApexFooter";
import AmbientParticles from "@/components/effects/AmbientParticles";
import { ApexButton } from "@/components/ui/apex-button";
import WatchtowerFilters from "@/components/watchtower/WatchtowerFilters";
import WatchtowerStats from "@/components/watchtower/WatchtowerStats";
import RiskBadge from "@/components/watchtower/RiskBadge";
import { useNDISData, useFilteredNDIS } from "@/hooks/useWatchtowerData";

export default function NDISWatchtower() {
  const { data, count, updatedAt, loading, error } = useNDISData();
  const [search, setSearch] = useState("");
  const [stateFilter, setStateFilter] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [riskFilter, setRiskFilter] = useState("");

  const filtered = useFilteredNDIS(data, search, stateFilter, typeFilter, riskFilter);

  const uniqueStates = useMemo(() => [...new Set(data.map(s => s.state))].sort(), [data]);
  const uniqueTypes = useMemo(() => [...new Set(data.map(s => s.type))].sort(), [data]);
  const uniqueRisks = useMemo(() => [...new Set(data.map(s => s.risk))].sort(), [data]);

  const highCount = useMemo(() => data.filter(s => s.risk === "HIGH").length, [data]);

  const stats = [
    { label: "Total Actions", value: count || data.length },
    { label: "High Risk", value: highCount, color: "text-red-400" },
    { label: "States Covered", value: uniqueStates.length },
    { label: "Filtered Results", value: filtered.length },
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
              {updatedAt && (
                <span className="text-[9px] uppercase tracking-[0.15em] text-muted-foreground">
                  Updated {new Date(updatedAt).toLocaleDateString()}
                </span>
              )}
            </div>
            <h1 className="text-3xl md:text-5xl font-semibold text-foreground tracking-wide mb-4">
              NDIS <span className="text-gradient-gold">Watchtower</span>
            </h1>
            <p className="text-muted-foreground text-lg leading-relaxed">
              Live enforcement actions from the NDIS Quality & Safeguards Commission.
              {count > 0 && ` Tracking ${count.toLocaleString()} compliance signals across Australia.`}
            </p>
          </motion.div>

          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2, duration: 0.8 }} className="flex-shrink-0 flex flex-col gap-3">
            <Link to="/compliance-ledger">
              <ApexButton variant="primary" size="lg" className="gap-2 w-full">
                <Database className="w-4 h-4" /> Audit-Ready Ledger
              </ApexButton>
            </Link>
            <Link to="/request-verdict">
              <ApexButton variant="secondary" size="lg" className="gap-2 w-full">
                <Lock className="w-4 h-4" /> Check Your Compliance
              </ApexButton>
            </Link>
          </motion.div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-32">
            <Loader2 className="w-8 h-8 text-primary animate-spin" />
            <span className="ml-3 text-muted-foreground">Loading enforcement data…</span>
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
              searchPlaceholder="Search provider name…"
              filters={[
                { label: "All States", value: stateFilter, options: uniqueStates, onChange: setStateFilter },
                { label: "All Types", value: typeFilter, options: uniqueTypes, onChange: setTypeFilter },
                { label: "All Risk", value: riskFilter, options: uniqueRisks, onChange: setRiskFilter },
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
                      <th className="p-5 font-medium">Provider</th>
                      <th className="p-5 font-medium">Action Type</th>
                      <th className="p-5 font-medium">Risk</th>
                      <th className="p-5 font-medium">State</th>
                      <th className="p-5 font-medium">Effective</th>
                    </tr>
                  </thead>
                  <tbody className="text-sm">
                    {filtered.slice(0, 100).map((s, i) => (
                      <tr key={i} className="border-b border-border/10 hover:bg-muted/10 transition-colors">
                        <td className="p-5 text-foreground font-medium max-w-[300px] truncate">{s.name}</td>
                        <td className="p-5 text-muted-foreground">{s.type}</td>
                        <td className="p-5"><RiskBadge risk={s.risk} /></td>
                        <td className="p-5 text-muted-foreground">{s.state}</td>
                        <td className="p-5 text-muted-foreground font-mono text-xs">{s.effective || "—"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {filtered.length > 100 && (
                <div className="text-center py-6 text-muted-foreground text-sm border-t border-border/20">
                  Showing 100 of {filtered.length.toLocaleString()} results. Refine your search for more specific data.
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

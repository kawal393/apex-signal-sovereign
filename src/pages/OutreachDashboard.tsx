import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Mail, Users, Send, Search, Loader2, Play, Eye, AlertCircle, CheckCircle2, Clock } from "lucide-react";
import ApexNav from "@/components/layout/ApexNav";
import ApexFooter from "@/components/layout/ApexFooter";
import AmbientParticles from "@/components/effects/AmbientParticles";
import MobileVoid from "@/components/effects/MobileVoid";
import { ApexButton } from "@/components/ui/apex-button";
import { useIsMobile } from "@/hooks/use-mobile";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const SECTORS = ["ndis", "mining", "pharma", "legal"];

const OutreachDashboard = () => {
  const isMobile = useIsMobile();
  const { toast } = useToast();
  const [leads, setLeads] = useState<any[]>([]);
  const [emails, setEmails] = useState<any[]>([]);
  const [stats, setStats] = useState({ total: 0, contacted: 0, new: 0, sent: 0, failed: 0 });
  const [loading, setLoading] = useState(true);
  const [activeSector, setActiveSector] = useState("all");
  const [runningAction, setRunningAction] = useState<string | null>(null);

  const fetchData = async () => {
    setLoading(true);
    const [leadsRes, emailsRes] = await Promise.all([
      supabase.from("outreach_leads").select("*").order("created_at", { ascending: false }).limit(100),
      supabase.from("outreach_emails").select("*, outreach_leads(company_name, email, sector)").order("created_at", { ascending: false }).limit(100),
    ]);

    const allLeads = leadsRes.data || [];
    const allEmails = emailsRes.data || [];

    setLeads(allLeads);
    setEmails(allEmails);
    setStats({
      total: allLeads.length,
      contacted: allLeads.filter((l: any) => l.status === "contacted").length,
      new: allLeads.filter((l: any) => l.status === "new").length,
      sent: allEmails.filter((e: any) => e.status === "sent").length,
      failed: allEmails.filter((e: any) => e.status === "failed").length,
    });
    setLoading(false);
  };

  useEffect(() => { fetchData(); }, []);

  const runAction = async (action: string, sector: string) => {
    setRunningAction(`${action}-${sector}`);
    try {
      const { data, error } = await supabase.functions.invoke(
        action === "discover" ? "lead-discovery" : "send-outreach",
        { body: { sector, batch: 0, limit: 5, dry_run: false } }
      );
      if (error) throw error;
      toast({
        title: action === "discover" ? "Lead Discovery Complete" : "Outreach Sent",
        description: action === "discover"
          ? `Found ${data.leads_found} leads, inserted ${data.leads_inserted}`
          : `Sent ${data.emails_sent} emails for ${sector}`,
      });
      fetchData();
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    }
    setRunningAction(null);
  };

  const runFullCycle = async () => {
    setRunningAction("full-cycle");
    try {
      const { data, error } = await supabase.functions.invoke("outreach-scheduler", { body: {} });
      if (error) throw error;
      toast({ title: "Full Cycle Complete", description: `Processed ${data.results?.length || 0} steps` });
      fetchData();
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    }
    setRunningAction(null);
  };

  const filteredLeads = activeSector === "all" ? leads : leads.filter((l: any) => l.sector === activeSector);

  const statusBadge = (status: string) => {
    const styles: Record<string, string> = {
      new: "bg-blue-500/20 text-blue-300 border-blue-500/30",
      contacted: "bg-green-500/20 text-green-300 border-green-500/30",
      sent: "bg-green-500/20 text-green-300 border-green-500/30",
      failed: "bg-red-500/20 text-red-300 border-red-500/30",
      pending: "bg-yellow-500/20 text-yellow-300 border-yellow-500/30",
    };
    return (
      <span className={`px-2 py-0.5 rounded-full border text-[10px] uppercase tracking-wider ${styles[status] || styles.pending}`}>
        {status}
      </span>
    );
  };

  return (
    <div className="relative min-h-screen bg-black">
      {isMobile && <MobileVoid />}
      <AmbientParticles />
      <div className="fixed inset-0 pointer-events-none z-[1]">
        <div className="absolute inset-0 bg-black/80" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,hsl(42_50%_20%/0.06)_0%,transparent_60%)]" />
      </div>

      <ApexNav />

      <main className="relative z-10 pt-32 pb-24 px-4 md:px-6">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12"
          >
            <span className="text-[10px] uppercase tracking-[0.6em] text-grey-300 block mb-4">Autonomous Engine</span>
            <h1 className="text-3xl md:text-4xl font-semibold text-foreground tracking-wide mb-4">
              <span className="text-gradient-gold">Outreach Command Center</span>
            </h1>
            <p className="text-grey-300 max-w-lg mx-auto text-base">
              Automated lead discovery and email outreach across all sectors.
            </p>
          </motion.div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-8">
            {[
              { label: "Total Leads", value: stats.total, icon: Users, color: "text-primary" },
              { label: "New Leads", value: stats.new, icon: Search, color: "text-blue-400" },
              { label: "Contacted", value: stats.contacted, icon: CheckCircle2, color: "text-green-400" },
              { label: "Emails Sent", value: stats.sent, icon: Send, color: "text-emerald-400" },
              { label: "Failed", value: stats.failed, icon: AlertCircle, color: "text-red-400" },
            ].map((s, i) => (
              <motion.div
                key={s.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08 }}
                className="glass-card p-4 text-center"
              >
                <s.icon className={`w-5 h-5 ${s.color} mx-auto mb-2`} />
                <div className={`text-2xl font-semibold ${s.color}`}>{loading ? "—" : s.value}</div>
                <div className="text-grey-400 text-xs mt-1">{s.label}</div>
              </motion.div>
            ))}
          </div>

          {/* Actions */}
          <div className="glass-card p-6 mb-8">
            <h2 className="text-foreground text-lg font-medium mb-4 flex items-center gap-2">
              <Play className="w-4 h-4 text-primary" /> Trigger Actions
            </h2>
            <div className="grid md:grid-cols-2 gap-4 mb-4">
              {SECTORS.map((sector) => (
                <div key={sector} className="flex items-center gap-2">
                  <span className="text-grey-300 text-sm uppercase tracking-wider w-16">{sector}</span>
                  <ApexButton
                    variant="outline"
                    size="sm"
                    onClick={() => runAction("discover", sector)}
                    disabled={!!runningAction}
                    className="flex-1"
                  >
                    {runningAction === `discover-${sector}` ? <Loader2 className="w-3 h-3 animate-spin mr-1" /> : <Search className="w-3 h-3 mr-1" />}
                    Discover
                  </ApexButton>
                  <ApexButton
                    variant="outline"
                    size="sm"
                    onClick={() => runAction("send", sector)}
                    disabled={!!runningAction}
                    className="flex-1"
                  >
                    {runningAction === `send-${sector}` ? <Loader2 className="w-3 h-3 animate-spin mr-1" /> : <Send className="w-3 h-3 mr-1" />}
                    Send
                  </ApexButton>
                </div>
              ))}
            </div>
            <ApexButton
              variant="primary"
              size="lg"
              onClick={runFullCycle}
              disabled={!!runningAction}
              className="w-full gap-2"
            >
              {runningAction === "full-cycle" ? (
                <><Loader2 className="w-4 h-4 animate-spin" /> Running Full Cycle...</>
              ) : (
                <><Mail className="w-4 h-4" /> Run Full Autonomous Cycle</>
              )}
            </ApexButton>
          </div>

          {/* Sector Filter */}
          <div className="flex gap-2 mb-6 overflow-x-auto">
            {["all", ...SECTORS].map((s) => (
              <button
                key={s}
                onClick={() => setActiveSector(s)}
                className={`px-3 py-1.5 rounded text-xs uppercase tracking-wider border transition-all ${
                  activeSector === s
                    ? "bg-primary/20 border-primary/40 text-primary"
                    : "bg-black/30 border-grey-700/30 text-grey-400 hover:border-grey-600"
                }`}
              >
                {s}
              </button>
            ))}
          </div>

          {/* Leads Table */}
          <div className="glass-card p-6 mb-8">
            <h2 className="text-foreground text-lg font-medium mb-4 flex items-center gap-2">
              <Users className="w-4 h-4 text-primary" /> Leads ({filteredLeads.length})
            </h2>
            {loading ? (
              <div className="flex justify-center py-8"><Loader2 className="w-6 h-6 animate-spin text-primary" /></div>
            ) : filteredLeads.length === 0 ? (
              <p className="text-grey-400 text-center py-8">No leads yet. Run discovery to find contacts.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-grey-400 text-xs uppercase tracking-wider border-b border-grey-700/30">
                      <th className="text-left py-2 px-3">Company</th>
                      <th className="text-left py-2 px-3">Email</th>
                      <th className="text-left py-2 px-3">Sector</th>
                      <th className="text-left py-2 px-3">State</th>
                      <th className="text-left py-2 px-3">Status</th>
                      <th className="text-left py-2 px-3">Added</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredLeads.slice(0, 50).map((lead: any) => (
                      <tr key={lead.id} className="border-b border-grey-800/20 hover:bg-white/[0.02]">
                        <td className="py-2 px-3 text-foreground">{lead.company_name}</td>
                        <td className="py-2 px-3 text-grey-300">{lead.email}</td>
                        <td className="py-2 px-3 text-grey-400 uppercase text-xs">{lead.sector}</td>
                        <td className="py-2 px-3 text-grey-400">{lead.state || "—"}</td>
                        <td className="py-2 px-3">{statusBadge(lead.status)}</td>
                        <td className="py-2 px-3 text-grey-500 text-xs">
                          {new Date(lead.created_at).toLocaleDateString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Recent Emails */}
          <div className="glass-card p-6">
            <h2 className="text-foreground text-lg font-medium mb-4 flex items-center gap-2">
              <Mail className="w-4 h-4 text-primary" /> Recent Emails ({emails.length})
            </h2>
            {loading ? (
              <div className="flex justify-center py-8"><Loader2 className="w-6 h-6 animate-spin text-primary" /></div>
            ) : emails.length === 0 ? (
              <p className="text-grey-400 text-center py-8">No emails sent yet.</p>
            ) : (
              <div className="space-y-3">
                {emails.slice(0, 20).map((email: any) => (
                  <div key={email.id} className="flex items-center gap-4 p-3 rounded bg-black/20 border border-grey-800/20">
                    <div className="flex-1">
                      <div className="text-foreground text-sm">{email.subject}</div>
                      <div className="text-grey-400 text-xs mt-1">
                        To: {(email as any).outreach_leads?.email || "—"} • {(email as any).outreach_leads?.company_name || "—"}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {statusBadge(email.status)}
                      <span className="text-grey-500 text-xs">
                        {email.sent_at ? new Date(email.sent_at).toLocaleDateString() : "—"}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>

      <ApexFooter />
    </div>
  );
};

export default OutreachDashboard;

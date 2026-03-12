import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { Shield, Plus, Hash, AlertTriangle, ExternalLink, Copy, CheckCircle, FileText, Lock, Trash2 } from "lucide-react";
import ApexNav from "@/components/layout/ApexNav";
import ApexFooter from "@/components/layout/ApexFooter";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface PracticeStandard {
  id: string;
  standard_code: string;
  standard_name: string;
  category: string;
  description: string;
}

interface EvidenceRecord {
  id: string;
  title: string;
  description: string;
  evidence_type: string;
  content_hash: string;
  sequence_number: number;
  previous_hash: string | null;
  standard_id: string | null;
  status: string;
  created_at: string;
  signature: string | null;
}

interface AuditLink {
  id: string;
  link_token: string;
  label: string;
  expires_at: string;
  access_count: number;
  is_active: boolean;
  created_at: string;
}

interface SequenceAlert {
  id: string;
  alert_type: string;
  description: string;
  resolved: boolean;
  created_at: string;
}

// Client-side SHA-256 hashing
async function hashContent(content: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(content);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  return Array.from(new Uint8Array(hashBuffer)).map(b => b.toString(16).padStart(2, '0')).join('');
}

const ComplianceLedger = () => {
  const { user } = useAuth();
  const [standards, setStandards] = useState<PracticeStandard[]>([]);
  const [evidence, setEvidence] = useState<EvidenceRecord[]>([]);
  const [auditLinks, setAuditLinks] = useState<AuditLink[]>([]);
  const [alerts, setAlerts] = useState<SequenceAlert[]>([]);
  const [isAddingEvidence, setIsAddingEvidence] = useState(false);
  const [selectedStandard, setSelectedStandard] = useState<string>("");
  const [newTitle, setNewTitle] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [newType, setNewType] = useState("document");
  const [loading, setLoading] = useState(true);

  // Load data
  const loadData = useCallback(async () => {
    if (!user) return;
    
    const [standardsRes, evidenceRes, linksRes, alertsRes] = await Promise.all([
      supabase.from('ndis_practice_standards').select('*').order('standard_code'),
      supabase.from('compliance_evidence').select('*').eq('provider_user_id', user.id).order('sequence_number', { ascending: true }),
      supabase.from('audit_links').select('*').eq('provider_user_id', user.id).order('created_at', { ascending: false }),
      supabase.from('sequence_alerts').select('*').eq('provider_user_id', user.id).order('created_at', { ascending: false }),
    ]);

    if (standardsRes.data) setStandards(standardsRes.data);
    if (evidenceRes.data) setEvidence(evidenceRes.data as EvidenceRecord[]);
    if (linksRes.data) setAuditLinks(linksRes.data as AuditLink[]);
    if (alertsRes.data) setAlerts(alertsRes.data as SequenceAlert[]);
    setLoading(false);
  }, [user]);

  useEffect(() => { loadData(); }, [loadData]);

  // Add evidence with cryptographic chaining
  const addEvidence = async () => {
    if (!user || !newTitle.trim()) return;

    const lastRecord = evidence.length > 0 ? evidence[evidence.length - 1] : null;
    const sequenceNumber = lastRecord ? lastRecord.sequence_number + 1 : 1;
    const previousHash = lastRecord ? lastRecord.content_hash : null;

    // RFC 8785 - canonical JSON for hashing
    const canonical = JSON.stringify({
      title: newTitle,
      description: newDescription,
      type: newType,
      sequence: sequenceNumber,
      previous_hash: previousHash,
      standard_id: selectedStandard || null,
      timestamp: new Date().toISOString(),
    });

    const contentHash = await hashContent(canonical);

    const { error } = await supabase.from('compliance_evidence').insert({
      provider_user_id: user.id,
      title: newTitle,
      description: newDescription,
      evidence_type: newType,
      content_hash: contentHash,
      sequence_number: sequenceNumber,
      previous_hash: previousHash,
      standard_id: selectedStandard || null,
    });

    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Evidence Recorded", description: `Sequence #${sequenceNumber} — Hash: ${contentHash.slice(0, 12)}...` });
      setNewTitle("");
      setNewDescription("");
      setSelectedStandard("");
      setIsAddingEvidence(false);
      loadData();
    }
  };

  // Generate audit link
  const createAuditLink = async () => {
    if (!user) return;
    const { error } = await supabase.from('audit_links').insert({
      provider_user_id: user.id,
      label: `Audit Access — ${new Date().toLocaleDateString()}`,
    });
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Audit Link Generated", description: "Share this link with your auditor for read-only access." });
      loadData();
    }
  };

  // Verify chain integrity
  const verifyChain = async () => {
    let broken = false;
    for (let i = 1; i < evidence.length; i++) {
      if (evidence[i].previous_hash !== evidence[i - 1].content_hash) {
        broken = true;
        toast({
          title: "⚠️ SEQUENCE BREAK DETECTED",
          description: `Record #${evidence[i].sequence_number} has a broken chain link. Previous hash mismatch.`,
          variant: "destructive",
        });
      }
    }
    if (!broken) {
      toast({ title: "✓ Chain Integrity Verified", description: `All ${evidence.length} records form a valid cryptographic chain.` });
    }
  };

  const copyAuditLink = (token: string) => {
    const url = `${window.location.origin}/audit/${token}`;
    navigator.clipboard.writeText(url);
    toast({ title: "Link Copied", description: "Audit link copied to clipboard." });
  };

  const getStandardName = (id: string | null) => {
    if (!id) return "Unmapped";
    const s = standards.find(s => s.id === id);
    return s ? `${s.standard_code}: ${s.standard_name}` : "Unknown";
  };

  if (!user) {
    return (
      <div className="relative min-h-screen bg-black">
        <ApexNav />
        <main className="relative z-10 pt-28 pb-16 px-6 text-center">
          <Shield className="w-16 h-16 text-primary mx-auto mb-6" />
          <h1 className="text-3xl font-semibold text-foreground mb-4">NDIS Compliance Ledger</h1>
          <p className="text-grey-400 mb-8 max-w-md mx-auto">
            The Audit-Ready Shield requires authentication. Log in to access your compliance dashboard.
          </p>
          <Link to="/auth" className="px-8 py-3 bg-primary/20 border border-primary/50 rounded-md text-primary text-xs uppercase tracking-[0.3em] hover:bg-primary/30 transition-all">
            Login to Continue
          </Link>
        </main>
        <ApexFooter />
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-black">
      <div className="fixed inset-0 pointer-events-none z-[1]">
        <div className="absolute inset-0 bg-black/80" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,hsl(280_40%_15%/0.08)_0%,transparent_60%)]" />
      </div>

      <ApexNav />

      <main className="relative z-10 pt-28 pb-16 px-6">
        <div className="max-w-6xl mx-auto">

          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="mb-12"
          >
            <div className="flex items-center justify-between flex-wrap gap-4 mb-6">
              <div>
                <span className="text-[10px] uppercase tracking-[0.5em] text-purple-light block mb-2">
                  NDIS Practice Standards Compliance
                </span>
                <h1 className="text-3xl md:text-4xl font-semibold text-foreground tracking-wide">
                  Audit-Ready <span className="text-purple-light">Shield</span>
                </h1>
              </div>
              <div className="flex gap-3">
                <Button
                  onClick={verifyChain}
                  variant="outline"
                  className="border-purple-mid/30 text-purple-light hover:bg-purple-mid/10 text-xs uppercase tracking-wider"
                  disabled={evidence.length === 0}
                >
                  <Hash className="w-4 h-4 mr-2" /> Verify Chain
                </Button>
                <Button
                  onClick={createAuditLink}
                  variant="outline"
                  className="border-primary/30 text-primary hover:bg-primary/10 text-xs uppercase tracking-wider"
                >
                  <ExternalLink className="w-4 h-4 mr-2" /> Generate Audit Link
                </Button>
              </div>
            </div>

            {/* Stats Bar */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { label: "Evidence Records", value: evidence.length, color: "text-purple-light" },
                { label: "Standards Mapped", value: new Set(evidence.filter(e => e.standard_id).map(e => e.standard_id)).size, color: "text-primary" },
                { label: "Sequence Alerts", value: alerts.filter(a => !a.resolved).length, color: alerts.filter(a => !a.resolved).length > 0 ? "text-crimson-bright" : "text-grey-400" },
                { label: "Audit Links", value: auditLinks.filter(l => l.is_active).length, color: "text-sky-400" },
              ].map((stat, i) => (
                <div key={i} className="p-4 rounded-lg border border-border/20 bg-card/30 backdrop-blur-sm">
                  <span className="text-[9px] uppercase tracking-[0.3em] text-grey-500 block mb-1">{stat.label}</span>
                  <span className={`text-2xl font-semibold ${stat.color}`}>{stat.value}</span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Sequence Alerts */}
          <AnimatePresence>
            {alerts.filter(a => !a.resolved).length > 0 && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mb-8"
              >
                <div className="p-4 rounded-lg border border-crimson-deep/40 bg-crimson-deep/10">
                  <div className="flex items-center gap-2 mb-2">
                    <AlertTriangle className="w-4 h-4 text-crimson-bright" />
                    <span className="text-xs uppercase tracking-[0.3em] text-crimson-bright font-semibold">Sequence Break Detected</span>
                  </div>
                  {alerts.filter(a => !a.resolved).map(alert => (
                    <p key={alert.id} className="text-sm text-grey-400">{alert.description}</p>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Add Evidence Button */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="mb-8"
          >
            <Dialog open={isAddingEvidence} onOpenChange={setIsAddingEvidence}>
              <DialogTrigger asChild>
                <Button className="bg-purple-mid/20 border border-purple-mid/40 text-purple-light hover:bg-purple-mid/30 text-xs uppercase tracking-wider">
                  <Plus className="w-4 h-4 mr-2" /> Record Evidence
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-black/95 border-purple-mid/30 max-w-lg">
                <DialogHeader>
                  <DialogTitle className="text-foreground text-lg">Record Compliance Evidence</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 mt-4">
                  <div>
                    <label className="text-[10px] uppercase tracking-[0.3em] text-grey-400 block mb-2">Evidence Title</label>
                    <Input
                      value={newTitle}
                      onChange={(e) => setNewTitle(e.target.value)}
                      placeholder="e.g. Staff Training Record — Manual Handling"
                      className="bg-card/50 border-border/30"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] uppercase tracking-[0.3em] text-grey-400 block mb-2">Description</label>
                    <Textarea
                      value={newDescription}
                      onChange={(e) => setNewDescription(e.target.value)}
                      placeholder="Describe the evidence..."
                      className="bg-card/50 border-border/30 min-h-[80px]"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] uppercase tracking-[0.3em] text-grey-400 block mb-2">Evidence Type</label>
                    <Select value={newType} onValueChange={setNewType}>
                      <SelectTrigger className="bg-card/50 border-border/30">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="document">Document</SelectItem>
                        <SelectItem value="shift_note">Shift Note</SelectItem>
                        <SelectItem value="invoice">Invoice</SelectItem>
                        <SelectItem value="training">Training Record</SelectItem>
                        <SelectItem value="incident">Incident Report</SelectItem>
                        <SelectItem value="policy">Policy Document</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="text-[10px] uppercase tracking-[0.3em] text-grey-400 block mb-2">Map to Practice Standard</label>
                    <Select value={selectedStandard} onValueChange={setSelectedStandard}>
                      <SelectTrigger className="bg-card/50 border-border/30">
                        <SelectValue placeholder="Select standard..." />
                      </SelectTrigger>
                      <SelectContent>
                        {standards.map(s => (
                          <SelectItem key={s.id} value={s.id}>
                            {s.standard_code}: {s.standard_name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <Button
                    onClick={addEvidence}
                    disabled={!newTitle.trim()}
                    className="w-full bg-purple-mid/30 border border-purple-mid/50 text-purple-light hover:bg-purple-mid/40"
                  >
                    <Lock className="w-4 h-4 mr-2" /> Hash & Record (Sequence #{evidence.length + 1})
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </motion.div>

          {/* Evidence Chain */}
          <div className="space-y-3">
            <span className="text-[10px] uppercase tracking-[0.5em] text-grey-400 block mb-4">
              Cryptographic Evidence Chain — {evidence.length} Records
            </span>
            {loading ? (
              <div className="text-center text-grey-500 py-12">Loading evidence chain...</div>
            ) : evidence.length === 0 ? (
              <div className="text-center py-16 border border-border/20 rounded-lg bg-card/20">
                <FileText className="w-12 h-12 text-grey-600 mx-auto mb-4" />
                <h3 className="text-lg text-grey-400 mb-2">No Evidence Recorded</h3>
                <p className="text-sm text-grey-500 max-w-sm mx-auto">
                  Start recording compliance evidence to build your audit-ready cryptographic chain.
                </p>
              </div>
            ) : (
              evidence.map((record, i) => (
                <motion.div
                  key={record.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="p-4 rounded-lg border border-border/20 bg-card/30 backdrop-blur-sm hover:bg-card/50 transition-all group"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-1">
                        <span className="text-[9px] font-mono text-purple-light bg-purple-mid/20 px-2 py-0.5 rounded">
                          #{record.sequence_number}
                        </span>
                        <span className="text-[9px] uppercase tracking-[0.2em] text-grey-500 bg-card/50 px-2 py-0.5 rounded">
                          {record.evidence_type}
                        </span>
                        <span className="text-[9px] text-grey-600">
                          {getStandardName(record.standard_id)}
                        </span>
                      </div>
                      <h4 className="text-sm font-medium text-foreground mb-1">{record.title}</h4>
                      {record.description && (
                        <p className="text-xs text-grey-400">{record.description}</p>
                      )}
                    </div>
                    <div className="text-right shrink-0">
                      <span className="text-[8px] font-mono text-sky-400 block mb-1" title={record.content_hash}>
                        {record.content_hash.slice(0, 16)}...
                      </span>
                      <span className="text-[8px] text-grey-600 block">
                        {new Date(record.created_at).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  {/* Chain link indicator */}
                  {i > 0 && (
                    <div className="mt-2 flex items-center gap-2">
                      <span className="text-[7px] text-grey-600">←</span>
                      <span className="text-[7px] font-mono text-grey-600" title={record.previous_hash || ''}>
                        prev: {record.previous_hash?.slice(0, 12)}...
                      </span>
                      {record.previous_hash === evidence[i - 1]?.content_hash ? (
                        <CheckCircle className="w-3 h-3 text-green-500" />
                      ) : (
                        <AlertTriangle className="w-3 h-3 text-crimson-bright" />
                      )}
                    </div>
                  )}
                </motion.div>
              ))
            )}
          </div>

          {/* Audit Links Section */}
          {auditLinks.length > 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="mt-12"
            >
              <span className="text-[10px] uppercase tracking-[0.5em] text-grey-400 block mb-4">
                Active Audit Links
              </span>
              <div className="space-y-3">
                {auditLinks.map(link => (
                  <div key={link.id} className="p-4 rounded-lg border border-sky-500/20 bg-sky-500/5 flex items-center justify-between">
                    <div>
                      <span className="text-sm text-foreground">{link.label}</span>
                      <span className="text-[9px] text-grey-500 block mt-1">
                        Expires: {new Date(link.expires_at).toLocaleDateString()} · Accessed: {link.access_count}x
                      </span>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => copyAuditLink(link.link_token)}
                      className="text-sky-400 hover:text-sky-300"
                    >
                      <Copy className="w-4 h-4 mr-1" /> Copy Link
                    </Button>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Practice Standards Reference */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-12"
          >
            <span className="text-[10px] uppercase tracking-[0.5em] text-grey-400 block mb-4">
              NDIS Practice Standards Reference
            </span>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {standards.map(s => {
                const mappedCount = evidence.filter(e => e.standard_id === s.id).length;
                return (
                  <div
                    key={s.id}
                    className={`p-4 rounded-lg border transition-all ${
                      mappedCount > 0
                        ? 'border-purple-mid/40 bg-purple-mid/10'
                        : 'border-border/20 bg-card/20'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-semibold text-purple-light">{s.standard_code}</span>
                      {mappedCount > 0 && (
                        <span className="text-[9px] text-purple-light bg-purple-mid/20 px-2 py-0.5 rounded">
                          {mappedCount} evidence
                        </span>
                      )}
                    </div>
                    <h4 className="text-sm text-foreground mb-1">{s.standard_name}</h4>
                    <p className="text-[11px] text-grey-500">{s.description}</p>
                  </div>
                );
              })}
            </div>
          </motion.div>

        </div>
      </main>
      <ApexFooter />
    </div>
  );
};

export default ComplianceLedger;

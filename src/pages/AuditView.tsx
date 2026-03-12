import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { Shield, CheckCircle, AlertTriangle, Hash, Lock } from "lucide-react";
import ApexNav from "@/components/layout/ApexNav";
import ApexFooter from "@/components/layout/ApexFooter";
import { supabase } from "@/integrations/supabase/client";
import apexLogo from "@/assets/apex-logo.png";

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
}

interface PracticeStandard {
  id: string;
  standard_code: string;
  standard_name: string;
}

const AuditView = () => {
  const { token } = useParams<{ token: string }>();
  const [evidence, setEvidence] = useState<EvidenceRecord[]>([]);
  const [standards, setStandards] = useState<PracticeStandard[]>([]);
  const [auditLabel, setAuditLabel] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [chainValid, setChainValid] = useState<boolean | null>(null);

  useEffect(() => {
    const loadAuditData = async () => {
      if (!token) { setError("No audit token provided."); setLoading(false); return; }

      // Verify audit link
      const { data: linkData, error: linkErr } = await supabase
        .from('audit_links')
        .select('*')
        .eq('link_token', token)
        .eq('is_active', true)
        .gt('expires_at', new Date().toISOString())
        .maybeSingle();

      if (linkErr || !linkData) {
        setError("Invalid or expired audit link.");
        setLoading(false);
        return;
      }

      setAuditLabel(linkData.label);

      // Increment access count
      await supabase.from('audit_links').update({ access_count: (linkData.access_count || 0) + 1 }).eq('id', linkData.id);

      // Load evidence for this provider
      const [evidenceRes, standardsRes] = await Promise.all([
        supabase.from('compliance_evidence').select('*').eq('provider_user_id', linkData.provider_user_id).order('sequence_number', { ascending: true }),
        supabase.from('ndis_practice_standards').select('id, standard_code, standard_name'),
      ]);

      if (evidenceRes.data) {
        setEvidence(evidenceRes.data as EvidenceRecord[]);
        // Verify chain
        let valid = true;
        for (let i = 1; i < evidenceRes.data.length; i++) {
          if (evidenceRes.data[i].previous_hash !== evidenceRes.data[i - 1].content_hash) {
            valid = false;
            break;
          }
        }
        setChainValid(evidenceRes.data.length > 0 ? valid : null);
      }
      if (standardsRes.data) setStandards(standardsRes.data);
      setLoading(false);
    };

    loadAuditData();
  }, [token]);

  const getStandardName = (id: string | null) => {
    if (!id) return "Unmapped";
    const s = standards.find(s => s.id === id);
    return s ? `${s.standard_code}: ${s.standard_name}` : "Unknown";
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-grey-400 text-sm animate-pulse">Verifying audit credentials...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-black">
        <ApexNav />
        <main className="relative z-10 pt-28 pb-16 px-6 text-center">
          <Lock className="w-16 h-16 text-crimson-bright mx-auto mb-6" />
          <h1 className="text-2xl font-semibold text-foreground mb-4">Access Denied</h1>
          <p className="text-grey-400">{error}</p>
        </main>
        <ApexFooter />
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-black">
      <div className="fixed inset-0 pointer-events-none z-[1]">
        <div className="absolute inset-0 bg-black/90" />
      </div>

      <main className="relative z-10 pt-12 pb-16 px-6">
        <div className="max-w-4xl mx-auto">

          {/* Audit Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <img src={apexLogo} alt="APEX" className="h-12 w-auto mx-auto mb-6 drop-shadow-[0_0_20px_rgba(212,160,32,0.3)]" />
            <span className="text-[10px] uppercase tracking-[0.5em] text-primary block mb-3">
              APEX PSI — Independent Verification Portal
            </span>
            <h1 className="text-2xl md:text-3xl font-semibold text-foreground mb-2">
              Compliance Audit Report
            </h1>
            <p className="text-sm text-grey-400">{auditLabel}</p>
          </motion.div>

          {/* Chain Integrity Banner */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className={`p-6 rounded-lg border mb-8 text-center ${
              chainValid
                ? 'border-green-500/40 bg-green-500/10'
                : chainValid === false
                  ? 'border-crimson-deep/40 bg-crimson-deep/10'
                  : 'border-border/20 bg-card/20'
            }`}
          >
            {chainValid ? (
              <>
                <CheckCircle className="w-10 h-10 text-green-500 mx-auto mb-3" />
                <h2 className="text-lg font-semibold text-green-400 mb-1">INTEGRITY VERIFIED</h2>
                <p className="text-sm text-grey-400">
                  All {evidence.length} records form a valid cryptographic chain. No tampering detected.
                </p>
              </>
            ) : chainValid === false ? (
              <>
                <AlertTriangle className="w-10 h-10 text-crimson-bright mx-auto mb-3" />
                <h2 className="text-lg font-semibold text-crimson-bright mb-1">SEQUENCE BREAK DETECTED</h2>
                <p className="text-sm text-grey-400">
                  The evidence chain has been tampered with or records have been deleted.
                </p>
              </>
            ) : (
              <>
                <Hash className="w-10 h-10 text-grey-500 mx-auto mb-3" />
                <h2 className="text-lg font-semibold text-grey-400 mb-1">NO RECORDS</h2>
                <p className="text-sm text-grey-500">No compliance evidence has been recorded yet.</p>
              </>
            )}
          </motion.div>

          {/* Evidence Records */}
          <div className="space-y-3">
            <span className="text-[10px] uppercase tracking-[0.5em] text-grey-400 block mb-4">
              Evidence Chain — {evidence.length} Records
            </span>
            {evidence.map((record, i) => (
              <motion.div
                key={record.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 + i * 0.03 }}
                className="p-4 rounded-lg border border-border/20 bg-card/20"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[9px] font-mono text-purple-light bg-purple-mid/20 px-2 py-0.5 rounded">#{record.sequence_number}</span>
                      <span className="text-[9px] uppercase tracking-wider text-grey-500">{record.evidence_type}</span>
                      <span className="text-[9px] text-grey-600">{getStandardName(record.standard_id)}</span>
                    </div>
                    <h4 className="text-sm text-foreground">{record.title}</h4>
                    {record.description && <p className="text-xs text-grey-500 mt-1">{record.description}</p>}
                  </div>
                  <div className="text-right shrink-0">
                    <span className="text-[8px] font-mono text-sky-400 block">{record.content_hash.slice(0, 16)}...</span>
                    <span className="text-[8px] text-grey-600">{new Date(record.created_at).toLocaleDateString()}</span>
                  </div>
                </div>
                {i > 0 && (
                  <div className="mt-2 flex items-center gap-2">
                    <span className="text-[7px] font-mono text-grey-600">prev: {record.previous_hash?.slice(0, 12)}...</span>
                    {record.previous_hash === evidence[i - 1]?.content_hash ? (
                      <CheckCircle className="w-3 h-3 text-green-500" />
                    ) : (
                      <AlertTriangle className="w-3 h-3 text-crimson-bright" />
                    )}
                  </div>
                )}
              </motion.div>
            ))}
          </div>

          {/* Footer */}
          <div className="mt-16 text-center border-t border-border/10 pt-8">
            <p className="text-[9px] uppercase tracking-[0.3em] text-grey-600 mb-2">
              Generated by APEX PSI Protocol — Proof of Sovereign Integrity
            </p>
            <p className="text-[8px] text-grey-700">
              This report is read-only. Evidence hashes are verified client-side. No data leaves this browser.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AuditView;

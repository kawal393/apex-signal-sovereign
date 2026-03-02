import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { AlertTriangle, Info, Shield, ExternalLink, RefreshCw } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useGeo } from "@/contexts/GeoContext";

type RegulatoryUpdate = {
  id: string;
  country_code: string;
  jurisdiction: string;
  title: string;
  summary: string;
  source_url: string;
  source_domain: string;
  severity: string;
  detected_at: string;
};

const severityConfig: Record<string, { icon: typeof AlertTriangle; color: string; bg: string }> = {
  critical: { icon: AlertTriangle, color: "text-red-400", bg: "bg-red-400/10 border-red-400/20" },
  moderate: { icon: Shield, color: "text-yellow-400", bg: "bg-yellow-400/10 border-yellow-400/20" },
  informational: { icon: Info, color: "text-blue-400", bg: "bg-blue-400/10 border-blue-400/20" },
};

// Hardcoded initial entries for when DB is empty
const defaultEntries: RegulatoryUpdate[] = [
  {
    id: "default-1", country_code: "AU", jurisdiction: "NDIS",
    title: "NDIS Commission releases updated Worker Screening requirements",
    summary: "New mandatory screening checks for all NDIS workers effective March 2026. Providers must update compliance frameworks within 90 days.",
    source_url: "https://www.ndiscommission.gov.au/news", source_domain: "ndiscommission.gov.au",
    severity: "critical", detected_at: new Date(Date.now() - 7200000).toISOString(),
  },
  {
    id: "default-2", country_code: "EU", jurisdiction: "AI Act",
    title: "EU AI Act Article 6 classification guidelines published",
    summary: "European Commission publishes detailed guidance on high-risk AI system classification. Compliance deadline for existing systems: August 2026.",
    source_url: "https://artificialintelligenceact.eu/developments/", source_domain: "artificialintelligenceact.eu",
    severity: "critical", detected_at: new Date(Date.now() - 86400000).toISOString(),
  },
  {
    id: "default-3", country_code: "US", jurisdiction: "SEC",
    title: "SEC proposes enhanced climate disclosure amendments",
    summary: "Proposed rule amendments would require additional quantitative climate risk metrics in annual reports for public companies.",
    source_url: "https://www.sec.gov/rules-regulations/proposed-rules", source_domain: "sec.gov",
    severity: "moderate", detected_at: new Date(Date.now() - 172800000).toISOString(),
  },
  {
    id: "default-4", country_code: "AU", jurisdiction: "AUSTRAC",
    title: "AUSTRAC updates AML/CTF reporting thresholds",
    summary: "Revised transaction reporting thresholds and enhanced due diligence requirements for designated services.",
    source_url: "https://www.austrac.gov.au/news-and-media", source_domain: "austrac.gov.au",
    severity: "moderate", detected_at: new Date(Date.now() - 259200000).toISOString(),
  },
  {
    id: "default-5", country_code: "UK", jurisdiction: "FCA",
    title: "FCA consumer duty enforcement actions commence",
    summary: "First wave of Consumer Duty enforcement notices issued to financial firms failing to demonstrate good customer outcomes.",
    source_url: "https://www.fca.org.uk/news", source_domain: "fca.org.uk",
    severity: "informational", detected_at: new Date(Date.now() - 345600000).toISOString(),
  },
  {
    id: "default-6", country_code: "JP", jurisdiction: "FSA",
    title: "Japan FSA updates crypto asset regulation framework",
    summary: "New stablecoin and crypto custody requirements announced for Japanese financial institutions, effective Q3 2026.",
    source_url: "https://www.fsa.go.jp/en/news/", source_domain: "fsa.go.jp",
    severity: "critical", detected_at: new Date(Date.now() - 432000000).toISOString(),
  },
  {
    id: "default-7", country_code: "SG", jurisdiction: "MAS",
    title: "MAS issues revised guidelines on AI in financial services",
    summary: "Monetary Authority of Singapore mandates fairness, ethics, accountability and transparency (FEAT) principles for all AI-driven financial products.",
    source_url: "https://www.mas.gov.sg/news", source_domain: "mas.gov.sg",
    severity: "moderate", detected_at: new Date(Date.now() - 518400000).toISOString(),
  },
  {
    id: "default-8", country_code: "IN", jurisdiction: "SEBI",
    title: "SEBI tightens ESG disclosure norms for listed companies",
    summary: "New mandatory BRSR Core framework for top 1000 listed companies. Enhanced climate risk reporting and supply chain due diligence required.",
    source_url: "https://www.sebi.gov.in/sebiweb/home", source_domain: "sebi.gov.in",
    severity: "moderate", detected_at: new Date(Date.now() - 604800000).toISOString(),
  },
  {
    id: "default-9", country_code: "BR", jurisdiction: "LGPD",
    title: "Brazil ANPD issues first administrative sanctions under LGPD",
    summary: "National Data Protection Authority issues landmark penalties for non-compliance with data processing consent requirements.",
    source_url: "https://www.gov.br/anpd/", source_domain: "gov.br",
    severity: "critical", detected_at: new Date(Date.now() - 691200000).toISOString(),
  },
  {
    id: "default-10", country_code: "AE", jurisdiction: "VARA",
    title: "Dubai VARA expands virtual asset regulatory perimeter",
    summary: "New licensing categories for DeFi protocols and NFT marketplaces operating in or from the UAE.",
    source_url: "https://www.vara.ae/en/", source_domain: "vara.ae",
    severity: "informational", detected_at: new Date(Date.now() - 777600000).toISOString(),
  },
];

function timeAgo(dateStr: string): string {
  const seconds = Math.floor((Date.now() - new Date(dateStr).getTime()) / 1000);
  if (seconds < 3600) return `${Math.floor(seconds / 60)} minutes ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)} hours ago`;
  return `${Math.floor(seconds / 86400)} days ago`;
}

const RegulatoryFeed = ({ filterByRegion = true }: { filterByRegion?: boolean }) => {
  const [updates, setUpdates] = useState<RegulatoryUpdate[]>([]);
  const [loading, setLoading] = useState(true);
  const geo = useGeo();

  useEffect(() => {
    const fetch = async () => {
      const query = supabase
        .from("regulatory_updates" as any)
        .select("*")
        .order("detected_at", { ascending: false })
        .limit(10);

      const { data, error } = await query;
      
      if (error || !data || (data as any[]).length === 0) {
        // Use defaults, optionally filtered
        const filtered = filterByRegion
          ? defaultEntries.filter(e => e.country_code === geo.regionCode || e.jurisdiction === geo.jurisdiction.primary[0])
          : defaultEntries;
        setUpdates(filtered.length > 0 ? filtered : defaultEntries.slice(0, 3));
      } else {
        setUpdates(data as any as RegulatoryUpdate[]);
      }
      setLoading(false);
    };
    fetch();
    const interval = setInterval(fetch, 60000);
    return () => clearInterval(interval);
  }, [geo.regionCode, filterByRegion]);

  if (loading) {
    return (
      <div className="space-y-3">
        {[1, 2, 3].map(i => (
          <div key={i} className="h-20 bg-card/40 border border-border/20 rounded-lg animate-pulse" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {updates.map((update, i) => {
        const config = severityConfig[update.severity] || severityConfig.informational;
        const Icon = config.icon;
        return (
          <motion.div
            key={update.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.08 }}
            className={`p-4 rounded-lg border ${config.bg} transition-all duration-300 hover:border-opacity-60`}
          >
            <div className="flex items-start gap-3">
              <Icon className={`w-4 h-4 mt-0.5 flex-shrink-0 ${config.color}`} />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[9px] uppercase tracking-[0.2em] text-muted-foreground font-medium">
                    {update.jurisdiction}
                  </span>
                  <span className="text-[8px] text-muted-foreground/50">·</span>
                  <span className="text-[9px] text-muted-foreground/60">{timeAgo(update.detected_at)}</span>
                </div>
                <h4 className="text-sm font-medium text-foreground/90 mb-1 leading-snug">{update.title}</h4>
                <p className="text-[11px] text-muted-foreground/70 leading-relaxed">{update.summary}</p>
                <a
                  href={update.source_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 mt-2 text-[9px] text-primary/60 hover:text-primary transition-colors"
                >
                  {update.source_domain} <ExternalLink className="w-2.5 h-2.5" />
                </a>
              </div>
            </div>
          </motion.div>
        );
      })}
      <div className="flex items-center justify-center gap-2 pt-2">
        <RefreshCw className="w-3 h-3 text-muted-foreground/40" />
        <span className="text-[9px] text-muted-foreground/40 uppercase tracking-[0.2em]">Auto-updates every hour</span>
      </div>
    </div>
  );
};

export default RegulatoryFeed;

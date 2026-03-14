import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

export type ScraperInfo = {
  name: string;
  label: string;
  table: string;
  edgeFunction: string;
  schedule: string;
  count: number;
  lastRun: string | null;
  lastStatus: string | null;
  lastDuration: number | null;
};

const SCRAPERS: Omit<ScraperInfo, 'count' | 'lastRun' | 'lastStatus' | 'lastDuration'>[] = [
  { name: 'mining-scraper', label: 'Mining Signals', table: 'mining_signals', edgeFunction: 'mining-scraper', schedule: 'Daily 7:00 UTC' },
  { name: 'regulatory-monitor', label: 'Regulatory Updates', table: 'regulatory_updates', edgeFunction: 'regulatory-monitor', schedule: 'Daily 6:00 UTC' },
  { name: 'ndis-scraper', label: 'NDIS Enforcement', table: 'ndis_enforcement', edgeFunction: 'ndis-scraper', schedule: 'Daily 8:00 UTC' },
  { name: 'pharma-scanner', label: 'Pharma Signals', table: 'pharma_signals', edgeFunction: 'pharma-scanner', schedule: 'Daily 9:00 UTC' },
  { name: 'court-crawler', label: 'Court Judgments', table: 'court_judgments', edgeFunction: 'court-crawler', schedule: 'Daily 10:00 UTC' },
  { name: 'asx-scanner', label: 'ASX Disclosures', table: 'asx_disclosures', edgeFunction: 'asx-scanner', schedule: 'Every 4 hours' },
  { name: 'global-sanctions', label: 'Sanctions Updates', table: 'sanctions_updates', edgeFunction: 'global-sanctions', schedule: 'Daily 11:00 UTC' },
  { name: 'company-scanner', label: 'Company Actions', table: 'company_actions', edgeFunction: 'company-scanner', schedule: 'Daily 12:00 UTC' },
];

export function useIntelligenceData() {
  const [scrapers, setScrapers] = useState<ScraperInfo[]>([]);
  const [totalRecords, setTotalRecords] = useState(0);
  const [loading, setLoading] = useState(true);

  const fetchCounts = async () => {
    setLoading(true);
    const results: ScraperInfo[] = [];
    let total = 0;

    for (const scraper of SCRAPERS) {
      // Get count from table
      const { count } = await supabase
        .from(scraper.table as any)
        .select('*', { count: 'exact', head: true });

      // Get last run info
      const { data: lastRunData } = await supabase
        .from('scraper_runs' as any)
        .select('created_at, status, duration_ms')
        .eq('scraper_name', scraper.name)
        .order('created_at', { ascending: false })
        .limit(1);

      const lastRun = (lastRunData as any)?.[0];
      const recordCount = count || 0;
      total += recordCount;

      results.push({
        ...scraper,
        count: recordCount,
        lastRun: lastRun?.created_at || null,
        lastStatus: lastRun?.status || null,
        lastDuration: lastRun?.duration_ms || null,
      });
    }

    setScrapers(results);
    setTotalRecords(total);
    setLoading(false);
  };

  useEffect(() => {
    fetchCounts();
  }, []);

  return { scrapers, totalRecords, loading, refresh: fetchCounts };
}

import { useState, useEffect, useMemo } from "react";

export interface NDISSignal {
  risk: string;
  type: string;
  name: string;
  state: string;
  effective: string;
  end: string;
}

export interface MiningSignal {
  id: string;
  state: string;
  source: string;
  type: string;
  risk: string;
  company: string;
  mine: string;
  action: string;
  description: string;
  date: string;
  penalty: string;
  status: string;
}

interface NDISResponse {
  updated_utc: string;
  count: number;
  signals: NDISSignal[];
}

interface MiningResponse {
  meta: { generated: string; total_signals: number };
  signals: MiningSignal[];
}

export function useNDISData() {
  const [data, setData] = useState<NDISSignal[]>([]);
  const [count, setCount] = useState(0);
  const [updatedAt, setUpdatedAt] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("https://raw.githubusercontent.com/kawal393/ndis-signal-board/main/docs/signals.json")
      .then(r => { if (!r.ok) throw new Error("Failed to fetch"); return r.json(); })
      .then((d: NDISResponse) => {
        setData(d.signals);
        setCount(d.count);
        setUpdatedAt(d.updated_utc);
      })
      .catch(e => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  return { data, count, updatedAt, loading, error };
}

export function useMiningData() {
  const [data, setData] = useState<MiningSignal[]>([]);
  const [meta, setMeta] = useState<MiningResponse["meta"] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("https://raw.githubusercontent.com/kawal393/mining-signal-board/master/docs/signals.json")
      .then(r => { if (!r.ok) throw new Error("Failed to fetch"); return r.json(); })
      .then((d: MiningResponse) => {
        setData(d.signals);
        setMeta(d.meta);
      })
      .catch(e => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  return { data, meta, loading, error };
}

export function useFilteredNDIS(
  data: NDISSignal[],
  search: string,
  stateFilter: string,
  typeFilter: string,
  riskFilter: string
) {
  return useMemo(() => {
    return data.filter(s => {
      if (search && !s.name.toLowerCase().includes(search.toLowerCase())) return false;
      if (stateFilter && s.state !== stateFilter) return false;
      if (typeFilter && s.type !== typeFilter) return false;
      if (riskFilter && s.risk !== riskFilter) return false;
      return true;
    });
  }, [data, search, stateFilter, typeFilter, riskFilter]);
}

export function useFilteredMining(
  data: MiningSignal[],
  search: string,
  stateFilter: string,
  riskFilter: string,
  sourceFilter: string
) {
  return useMemo(() => {
    return data.filter(s => {
      const q = search.toLowerCase();
      if (search && !s.company.toLowerCase().includes(q) && !s.mine.toLowerCase().includes(q)) return false;
      if (stateFilter && s.state !== stateFilter) return false;
      if (riskFilter && s.risk !== riskFilter) return false;
      if (sourceFilter && s.source !== sourceFilter) return false;
      return true;
    });
  }, [data, search, stateFilter, riskFilter, sourceFilter]);
}

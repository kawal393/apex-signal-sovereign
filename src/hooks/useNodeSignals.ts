// Centralized realtime subscription for node signals
// Eliminates per-node polling (was causing ~100+ requests)

import { useEffect, useState, useCallback, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface NodeSignal {
  id: string;
  node_id: number;
  signal_type: string;
  signal_strength: number;
  message: string;
  created_at: string;
}

type SignalsMap = Record<number, NodeSignal>;

let sharedSignals: SignalsMap = {};
let subscriberCount = 0;
let channel: ReturnType<typeof supabase.channel> | null = null;
const listeners = new Set<() => void>();

function notifyListeners() {
  listeners.forEach((fn) => fn());
}

async function fetchInitialSignals() {
  // Fetch latest signal per node in a single query (using distinct on)
  const { data } = await supabase
    .from('node_signals')
    .select('*')
    .order('node_id', { ascending: true })
    .order('created_at', { ascending: false });

  if (data) {
    const map: SignalsMap = {};
    for (const signal of data) {
      // Keep only the latest signal per node
      if (!map[signal.node_id]) {
        map[signal.node_id] = signal as NodeSignal;
      }
    }
    sharedSignals = map;
    notifyListeners();
  }
}

function subscribe() {
  subscriberCount++;

  if (subscriberCount === 1) {
    // First subscriber – fetch initial data and set up realtime
    fetchInitialSignals();

    channel = supabase
      .channel('global_node_signals')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'node_signals',
        },
        (payload) => {
          const newSignal = payload.new as NodeSignal;
          sharedSignals = {
            ...sharedSignals,
            [newSignal.node_id]: newSignal,
          };
          notifyListeners();
        }
      )
      .subscribe();
  }

  return () => {
    subscriberCount--;
    if (subscriberCount === 0 && channel) {
      channel.unsubscribe();
      channel = null;
      sharedSignals = {};
    }
  };
}

export function useNodeSignals() {
  const [signals, setSignals] = useState<SignalsMap>(() => sharedSignals);
  const unsubRef = useRef<(() => void) | null>(null);

  const listener = useCallback(() => {
    setSignals({ ...sharedSignals });
  }, []);

  useEffect(() => {
    listeners.add(listener);
    unsubRef.current = subscribe();

    // Sync immediately if data already exists
    if (Object.keys(sharedSignals).length > 0) {
      setSignals({ ...sharedSignals });
    }

    return () => {
      listeners.delete(listener);
      unsubRef.current?.();
    };
  }, [listener]);

  return signals;
}

export function useNodeSignal(nodeId: number) {
  const signals = useNodeSignals();
  return signals[nodeId] ?? null;
}

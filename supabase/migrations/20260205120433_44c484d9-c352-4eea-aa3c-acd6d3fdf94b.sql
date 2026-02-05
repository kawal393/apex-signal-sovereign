-- APEX System Backend Infrastructure
-- Access requests, visitor profiles, behavioral data

-- Visitor profiles - tracks returning visitors and their behavior
CREATE TABLE public.visitor_profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  fingerprint TEXT NOT NULL UNIQUE,
  first_visit TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  last_visit TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  visit_count INTEGER NOT NULL DEFAULT 1,
  total_time_seconds INTEGER NOT NULL DEFAULT 0,
  patience_score DECIMAL(3,2) DEFAULT 0.5,
  curiosity_score DECIMAL(3,2) DEFAULT 0.5,
  impatience_events INTEGER NOT NULL DEFAULT 0,
  deepest_scroll_depth DECIMAL(3,2) DEFAULT 0,
  nodes_viewed TEXT[] DEFAULT '{}',
  access_level TEXT NOT NULL DEFAULT 'observer',
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Access requests - stores intent submissions for evaluation
CREATE TABLE public.access_requests (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  visitor_id UUID REFERENCES public.visitor_profiles(id),
  intent TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  behavioral_data JSONB DEFAULT '{}',
  patience_score_at_request DECIMAL(3,2),
  time_spent_before_request INTEGER,
  scroll_depth_at_request DECIMAL(3,2),
  reviewed_at TIMESTAMP WITH TIME ZONE,
  reviewed_by TEXT,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Session events - granular behavioral tracking
CREATE TABLE public.session_events (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  visitor_id UUID REFERENCES public.visitor_profiles(id),
  session_id TEXT NOT NULL,
  event_type TEXT NOT NULL,
  event_data JSONB DEFAULT '{}',
  timestamp TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Node signals - simulated but structured node activity
CREATE TABLE public.node_signals (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  node_id INTEGER NOT NULL,
  node_name TEXT NOT NULL,
  signal_type TEXT NOT NULL,
  signal_strength DECIMAL(3,2) DEFAULT 0.5,
  message TEXT,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.visitor_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.access_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.session_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.node_signals ENABLE ROW LEVEL SECURITY;

-- Public read/write for visitor profiles (anonymous tracking)
CREATE POLICY "Allow anonymous visitor profile creation" 
ON public.visitor_profiles FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Allow anonymous visitor profile updates" 
ON public.visitor_profiles FOR UPDATE 
USING (true);

CREATE POLICY "Allow anonymous visitor profile reads" 
ON public.visitor_profiles FOR SELECT 
USING (true);

-- Public insert for access requests
CREATE POLICY "Allow anonymous access request submission" 
ON public.access_requests FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Allow anonymous access request reads" 
ON public.access_requests FOR SELECT 
USING (true);

-- Public insert for session events
CREATE POLICY "Allow anonymous session event tracking" 
ON public.session_events FOR INSERT 
WITH CHECK (true);

-- Public read for node signals
CREATE POLICY "Allow public node signal reads" 
ON public.node_signals FOR SELECT 
USING (true);

CREATE POLICY "Allow node signal creation" 
ON public.node_signals FOR INSERT 
WITH CHECK (true);

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER update_visitor_profiles_updated_at
BEFORE UPDATE ON public.visitor_profiles
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Seed some initial node signals to make it feel alive
INSERT INTO public.node_signals (node_id, node_name, signal_type, signal_strength, message) VALUES
(1, 'APEX NDIS Watchtower', 'verification', 0.87, 'Compliance check complete'),
(1, 'APEX NDIS Watchtower', 'alert', 0.92, 'Provider variance detected'),
(2, 'APEX Corporate Translator', 'translation', 0.78, 'Report processed'),
(3, 'APEX-ATA Ledger', 'audit', 0.95, 'Ledger synchronized'),
(1, 'APEX NDIS Watchtower', 'scan', 0.81, 'Sector analysis in progress');
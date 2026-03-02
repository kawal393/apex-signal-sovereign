
-- Create mining_signals table for real enforcement data
CREATE TABLE public.mining_signals (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  company TEXT NOT NULL,
  mine TEXT,
  action TEXT NOT NULL,
  risk TEXT NOT NULL DEFAULT 'MEDIUM',
  state TEXT NOT NULL,
  source TEXT NOT NULL,
  description TEXT,
  date TEXT,
  penalty TEXT,
  status TEXT DEFAULT 'active',
  source_url TEXT,
  content_hash TEXT UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.mining_signals ENABLE ROW LEVEL SECURITY;

-- Public read access
CREATE POLICY "Anyone can read mining signals"
  ON public.mining_signals FOR SELECT
  USING (true);

-- No client writes
CREATE POLICY "No client inserts on mining signals"
  ON public.mining_signals FOR INSERT
  WITH CHECK (false);

CREATE POLICY "No client updates on mining signals"
  ON public.mining_signals FOR UPDATE
  USING (false);

CREATE POLICY "No client deletes on mining signals"
  ON public.mining_signals FOR DELETE
  USING (false);

-- Index for fast filtering
CREATE INDEX idx_mining_signals_state ON public.mining_signals(state);
CREATE INDEX idx_mining_signals_risk ON public.mining_signals(risk);
CREATE INDEX idx_mining_signals_content_hash ON public.mining_signals(content_hash);

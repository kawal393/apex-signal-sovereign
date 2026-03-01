
-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS pg_net WITH SCHEMA extensions;

-- Create regulatory_updates table
CREATE TABLE public.regulatory_updates (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  country_code TEXT NOT NULL,
  jurisdiction TEXT NOT NULL,
  title TEXT NOT NULL,
  summary TEXT NOT NULL,
  source_url TEXT NOT NULL,
  source_domain TEXT NOT NULL,
  content_hash TEXT,
  severity TEXT NOT NULL DEFAULT 'informational',
  detected_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  raw_content TEXT,
  ai_analysis JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create monitored_sources table
CREATE TABLE public.monitored_sources (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  country_code TEXT NOT NULL,
  jurisdiction TEXT NOT NULL,
  source_url TEXT NOT NULL,
  source_name TEXT NOT NULL,
  check_interval_hours INTEGER NOT NULL DEFAULT 6,
  last_checked_at TIMESTAMPTZ,
  last_content_hash TEXT,
  active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS on both tables
ALTER TABLE public.regulatory_updates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.monitored_sources ENABLE ROW LEVEL SECURITY;

-- RLS: regulatory_updates - public read, no client writes
CREATE POLICY "Anyone can read regulatory updates"
  ON public.regulatory_updates FOR SELECT
  USING (true);

CREATE POLICY "No client inserts on regulatory updates"
  ON public.regulatory_updates FOR INSERT
  WITH CHECK (false);

CREATE POLICY "No client updates on regulatory updates"
  ON public.regulatory_updates FOR UPDATE
  USING (false);

CREATE POLICY "No client deletes on regulatory updates"
  ON public.regulatory_updates FOR DELETE
  USING (false);

-- RLS: monitored_sources - public read, no client writes
CREATE POLICY "Anyone can read monitored sources"
  ON public.monitored_sources FOR SELECT
  USING (true);

CREATE POLICY "No client inserts on monitored sources"
  ON public.monitored_sources FOR INSERT
  WITH CHECK (false);

CREATE POLICY "No client updates on monitored sources"
  ON public.monitored_sources FOR UPDATE
  USING (false);

CREATE POLICY "No client deletes on monitored sources"
  ON public.monitored_sources FOR DELETE
  USING (false);

-- Indexes
CREATE INDEX idx_regulatory_updates_country ON public.regulatory_updates(country_code);
CREATE INDEX idx_regulatory_updates_jurisdiction ON public.regulatory_updates(jurisdiction);
CREATE INDEX idx_regulatory_updates_severity ON public.regulatory_updates(severity);
CREATE INDEX idx_regulatory_updates_detected_at ON public.regulatory_updates(detected_at DESC);
CREATE INDEX idx_monitored_sources_country ON public.monitored_sources(country_code);
CREATE INDEX idx_monitored_sources_active ON public.monitored_sources(active);

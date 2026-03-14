
-- 1. NDIS Enforcement table
CREATE TABLE public.ndis_enforcement (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  entity_name TEXT NOT NULL,
  action_type TEXT NOT NULL,
  description TEXT,
  date TEXT,
  state TEXT NOT NULL DEFAULT 'National',
  severity TEXT NOT NULL DEFAULT 'MEDIUM',
  source TEXT NOT NULL,
  source_url TEXT,
  content_hash TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(content_hash)
);
ALTER TABLE public.ndis_enforcement ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can read ndis enforcement" ON public.ndis_enforcement FOR SELECT TO public USING (true);
CREATE POLICY "No client inserts on ndis enforcement" ON public.ndis_enforcement FOR INSERT TO public WITH CHECK (false);
CREATE POLICY "No client updates on ndis enforcement" ON public.ndis_enforcement FOR UPDATE TO public USING (false);
CREATE POLICY "No client deletes on ndis enforcement" ON public.ndis_enforcement FOR DELETE TO public USING (false);

-- 2. Pharma Signals table
CREATE TABLE public.pharma_signals (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  product_name TEXT NOT NULL,
  signal_type TEXT NOT NULL,
  description TEXT,
  date TEXT,
  severity TEXT NOT NULL DEFAULT 'MEDIUM',
  source TEXT NOT NULL,
  source_url TEXT,
  regulator TEXT DEFAULT 'TGA',
  content_hash TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(content_hash)
);
ALTER TABLE public.pharma_signals ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can read pharma signals" ON public.pharma_signals FOR SELECT TO public USING (true);
CREATE POLICY "No client inserts on pharma signals" ON public.pharma_signals FOR INSERT TO public WITH CHECK (false);
CREATE POLICY "No client updates on pharma signals" ON public.pharma_signals FOR UPDATE TO public USING (false);
CREATE POLICY "No client deletes on pharma signals" ON public.pharma_signals FOR DELETE TO public USING (false);

-- 3. Court Judgments table
CREATE TABLE public.court_judgments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  case_name TEXT NOT NULL,
  court TEXT NOT NULL,
  outcome TEXT,
  penalty TEXT,
  date TEXT,
  jurisdiction TEXT NOT NULL DEFAULT 'Federal',
  sector TEXT,
  severity TEXT NOT NULL DEFAULT 'MEDIUM',
  source TEXT NOT NULL,
  source_url TEXT,
  content_hash TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(content_hash)
);
ALTER TABLE public.court_judgments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can read court judgments" ON public.court_judgments FOR SELECT TO public USING (true);
CREATE POLICY "No client inserts on court judgments" ON public.court_judgments FOR INSERT TO public WITH CHECK (false);
CREATE POLICY "No client updates on court judgments" ON public.court_judgments FOR UPDATE TO public USING (false);
CREATE POLICY "No client deletes on court judgments" ON public.court_judgments FOR DELETE TO public USING (false);

-- 4. ASX Disclosures table
CREATE TABLE public.asx_disclosures (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  company_code TEXT NOT NULL,
  company_name TEXT NOT NULL,
  announcement_type TEXT NOT NULL,
  headline TEXT NOT NULL,
  description TEXT,
  date TEXT,
  price_sensitive BOOLEAN DEFAULT false,
  sector TEXT,
  source_url TEXT,
  content_hash TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(content_hash)
);
ALTER TABLE public.asx_disclosures ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can read asx disclosures" ON public.asx_disclosures FOR SELECT TO public USING (true);
CREATE POLICY "No client inserts on asx disclosures" ON public.asx_disclosures FOR INSERT TO public WITH CHECK (false);
CREATE POLICY "No client updates on asx disclosures" ON public.asx_disclosures FOR UPDATE TO public USING (false);
CREATE POLICY "No client deletes on asx disclosures" ON public.asx_disclosures FOR DELETE TO public USING (false);

-- 5. Sanctions Updates table
CREATE TABLE public.sanctions_updates (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  entity_name TEXT NOT NULL,
  list_source TEXT NOT NULL,
  action_type TEXT NOT NULL,
  country TEXT,
  description TEXT,
  date TEXT,
  severity TEXT NOT NULL DEFAULT 'HIGH',
  source_url TEXT,
  content_hash TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(content_hash)
);
ALTER TABLE public.sanctions_updates ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can read sanctions updates" ON public.sanctions_updates FOR SELECT TO public USING (true);
CREATE POLICY "No client inserts on sanctions updates" ON public.sanctions_updates FOR INSERT TO public WITH CHECK (false);
CREATE POLICY "No client updates on sanctions updates" ON public.sanctions_updates FOR UPDATE TO public USING (false);
CREATE POLICY "No client deletes on sanctions updates" ON public.sanctions_updates FOR DELETE TO public USING (false);

-- 6. Company Actions table
CREATE TABLE public.company_actions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  company_name TEXT NOT NULL,
  action_type TEXT NOT NULL,
  regulator TEXT NOT NULL DEFAULT 'ASIC',
  description TEXT,
  date TEXT,
  severity TEXT NOT NULL DEFAULT 'MEDIUM',
  director_name TEXT,
  source_url TEXT,
  content_hash TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(content_hash)
);
ALTER TABLE public.company_actions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can read company actions" ON public.company_actions FOR SELECT TO public USING (true);
CREATE POLICY "No client inserts on company actions" ON public.company_actions FOR INSERT TO public WITH CHECK (false);
CREATE POLICY "No client updates on company actions" ON public.company_actions FOR UPDATE TO public USING (false);
CREATE POLICY "No client deletes on company actions" ON public.company_actions FOR DELETE TO public USING (false);

-- 7. Scraper Runs audit table
CREATE TABLE public.scraper_runs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  scraper_name TEXT NOT NULL,
  batch_number INTEGER DEFAULT 0,
  records_found INTEGER DEFAULT 0,
  records_inserted INTEGER DEFAULT 0,
  errors TEXT[],
  duration_ms INTEGER,
  status TEXT NOT NULL DEFAULT 'completed',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);
ALTER TABLE public.scraper_runs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can read scraper runs" ON public.scraper_runs FOR SELECT TO public USING (true);
CREATE POLICY "No client inserts on scraper runs" ON public.scraper_runs FOR INSERT TO public WITH CHECK (false);
CREATE POLICY "No client updates on scraper runs" ON public.scraper_runs FOR UPDATE TO public USING (false);
CREATE POLICY "No client deletes on scraper runs" ON public.scraper_runs FOR DELETE TO public USING (false);

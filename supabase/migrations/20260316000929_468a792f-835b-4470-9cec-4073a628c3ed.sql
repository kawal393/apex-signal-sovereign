-- Outreach leads table
CREATE TABLE public.outreach_leads (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_name text NOT NULL,
  email text NOT NULL,
  sector text NOT NULL DEFAULT 'general',
  source text NOT NULL DEFAULT 'manual',
  state text,
  website text,
  contact_name text,
  company_size text,
  compliance_risk text,
  status text NOT NULL DEFAULT 'new',
  notes text,
  metadata jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  last_contacted_at timestamptz,
  UNIQUE(email)
);

-- Outreach emails log
CREATE TABLE public.outreach_emails (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  lead_id uuid REFERENCES public.outreach_leads(id) ON DELETE CASCADE,
  subject text NOT NULL,
  body_preview text,
  status text NOT NULL DEFAULT 'pending',
  sent_at timestamptz,
  opened_at timestamptz,
  error_message text,
  template_used text,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Outreach campaigns
CREATE TABLE public.outreach_campaigns (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  sector text NOT NULL DEFAULT 'all',
  status text NOT NULL DEFAULT 'draft',
  total_leads integer DEFAULT 0,
  emails_sent integer DEFAULT 0,
  emails_opened integer DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  started_at timestamptz,
  completed_at timestamptz
);

-- RLS
ALTER TABLE public.outreach_leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.outreach_emails ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.outreach_campaigns ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read outreach leads" ON public.outreach_leads FOR SELECT TO public USING (true);
CREATE POLICY "No client inserts on outreach leads" ON public.outreach_leads FOR INSERT TO public WITH CHECK (false);
CREATE POLICY "No client updates on outreach leads" ON public.outreach_leads FOR UPDATE TO public USING (false);
CREATE POLICY "No client deletes on outreach leads" ON public.outreach_leads FOR DELETE TO public USING (false);

CREATE POLICY "Anyone can read outreach emails" ON public.outreach_emails FOR SELECT TO public USING (true);
CREATE POLICY "No client inserts on outreach emails" ON public.outreach_emails FOR INSERT TO public WITH CHECK (false);
CREATE POLICY "No client updates on outreach emails" ON public.outreach_emails FOR UPDATE TO public USING (false);
CREATE POLICY "No client deletes on outreach emails" ON public.outreach_emails FOR DELETE TO public USING (false);

CREATE POLICY "Anyone can read outreach campaigns" ON public.outreach_campaigns FOR SELECT TO public USING (true);
CREATE POLICY "No client inserts on outreach campaigns" ON public.outreach_campaigns FOR INSERT TO public WITH CHECK (false);
CREATE POLICY "No client updates on outreach campaigns" ON public.outreach_campaigns FOR UPDATE TO public USING (false);
CREATE POLICY "No client deletes on outreach campaigns" ON public.outreach_campaigns FOR DELETE TO public USING (false);
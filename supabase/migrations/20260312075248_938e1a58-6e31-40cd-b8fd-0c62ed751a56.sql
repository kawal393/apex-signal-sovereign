-- NDIS Compliance Ledger: Practice Standards mapping
CREATE TABLE public.ndis_practice_standards (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  standard_code text NOT NULL UNIQUE,
  standard_name text NOT NULL,
  category text NOT NULL,
  description text,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Compliance evidence records (the core B2B product)
CREATE TABLE public.compliance_evidence (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  provider_user_id uuid NOT NULL,
  standard_id uuid REFERENCES public.ndis_practice_standards(id),
  evidence_type text NOT NULL DEFAULT 'document',
  title text NOT NULL,
  description text,
  content_hash text NOT NULL,
  signature text,
  sequence_number bigint NOT NULL,
  previous_hash text,
  metadata jsonb DEFAULT '{}'::jsonb,
  file_url text,
  status text NOT NULL DEFAULT 'active',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Audit links for regulators (guest access)
CREATE TABLE public.audit_links (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  provider_user_id uuid NOT NULL,
  link_token text NOT NULL UNIQUE DEFAULT encode(gen_random_bytes(32), 'hex'),
  label text NOT NULL DEFAULT 'Audit Access',
  expires_at timestamptz NOT NULL DEFAULT (now() + interval '30 days'),
  access_count integer NOT NULL DEFAULT 0,
  max_access integer DEFAULT 100,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Sequence break alerts
CREATE TABLE public.sequence_alerts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  provider_user_id uuid NOT NULL,
  evidence_id uuid REFERENCES public.compliance_evidence(id),
  alert_type text NOT NULL DEFAULT 'sequence_break',
  description text NOT NULL,
  resolved boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.ndis_practice_standards ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.compliance_evidence ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_links ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sequence_alerts ENABLE ROW LEVEL SECURITY;

-- Practice standards: public read
CREATE POLICY "Anyone can read practice standards" ON public.ndis_practice_standards FOR SELECT TO public USING (true);
CREATE POLICY "No client writes on practice standards" ON public.ndis_practice_standards FOR INSERT TO public WITH CHECK (false);

-- Compliance evidence: users CRUD own records
CREATE POLICY "Users can view own evidence" ON public.compliance_evidence FOR SELECT TO authenticated USING (auth.uid() = provider_user_id);
CREATE POLICY "Users can insert own evidence" ON public.compliance_evidence FOR INSERT TO authenticated WITH CHECK (auth.uid() = provider_user_id);
CREATE POLICY "Users can update own evidence" ON public.compliance_evidence FOR UPDATE TO authenticated USING (auth.uid() = provider_user_id);
CREATE POLICY "Users can delete own evidence" ON public.compliance_evidence FOR DELETE TO authenticated USING (auth.uid() = provider_user_id);

-- Audit links: users CRUD own
CREATE POLICY "Users can view own audit links" ON public.audit_links FOR SELECT TO authenticated USING (auth.uid() = provider_user_id);
CREATE POLICY "Users can create audit links" ON public.audit_links FOR INSERT TO authenticated WITH CHECK (auth.uid() = provider_user_id);
CREATE POLICY "Users can update own audit links" ON public.audit_links FOR UPDATE TO authenticated USING (auth.uid() = provider_user_id);
-- Public read via token (for regulator guest access)
CREATE POLICY "Public audit link access by token" ON public.audit_links FOR SELECT TO public USING (is_active = true AND expires_at > now());

-- Public read evidence via audit link (regulators)
CREATE POLICY "Public evidence read via audit context" ON public.compliance_evidence FOR SELECT TO public USING (
  EXISTS (
    SELECT 1 FROM public.audit_links al
    WHERE al.provider_user_id = compliance_evidence.provider_user_id
    AND al.is_active = true
    AND al.expires_at > now()
  )
);

-- Sequence alerts: users view own
CREATE POLICY "Users can view own alerts" ON public.sequence_alerts FOR SELECT TO authenticated USING (auth.uid() = provider_user_id);

-- Seed NDIS Practice Standards (Core Module categories)
INSERT INTO public.ndis_practice_standards (standard_code, standard_name, category, description) VALUES
  ('PS1', 'Rights and Responsibilities', 'Core', 'Each participant accesses supports that promote and respect their legal and human rights.'),
  ('PS2', 'Person-Centred Supports', 'Core', 'Each participant receives supports that are responsive to their strengths, preferences and goals.'),
  ('PS3', 'Provider Governance and Operational Management', 'Core', 'Each provider has effective governance, management and business systems.'),
  ('PS4', 'Provision of Supports', 'Core', 'Each participant receives quality and safe supports.'),
  ('PS5', 'Support Provision Environment', 'Core', 'The provision environment is safe, accessible and promotes wellbeing.'),
  ('PS6', 'Feedback and Complaints Management', 'Core', 'Each participant has access to a fair and effective complaints management process.'),
  ('PS7', 'Human Resource Management', 'Core', 'Workers are competent, supported and operating within their scope of practice.'),
  ('PS8', 'Information Management', 'Core', 'Providers manage information to ensure quality support delivery.'),
  ('PS9', 'Continuity of Supports', 'Core', 'Each participant is supported to maintain continuity of services.'),
  ('SM1', 'High Intensity Daily Personal Activities', 'Supplementary', 'Providers of high intensity supports meet additional requirements.'),
  ('SM2', 'Specialist Behaviour Support', 'Supplementary', 'Behaviour support is evidence-based and respects participant rights.'),
  ('SM3', 'Early Childhood Supports', 'Supplementary', 'Providers deliver evidence-based early childhood supports.'),
  ('SM4', 'Specialist Disability Accommodation', 'Supplementary', 'SDA providers meet design, build and maintenance standards.'),
  ('SM5', 'Supported Independent Living', 'Supplementary', 'SIL providers enable participants to live independently.'),
  ('SM6', 'Plan Management', 'Supplementary', 'Plan managers operate effectively on behalf of participants.'),
  ('SM7', 'Support Coordination', 'Supplementary', 'Support coordinators assist participants to implement their plans.');

-- Updated_at trigger for compliance_evidence
CREATE TRIGGER update_compliance_evidence_updated_at
  BEFORE UPDATE ON public.compliance_evidence
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
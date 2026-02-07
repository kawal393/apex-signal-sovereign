-- Add AI-generated fields to access_requests
ALTER TABLE public.access_requests
ADD COLUMN IF NOT EXISTS ai_assessment text,
ADD COLUMN IF NOT EXISTS ai_risk_score numeric,
ADD COLUMN IF NOT EXISTS ai_recommendation text,
ADD COLUMN IF NOT EXISTS ai_processed_at timestamp with time zone,
ADD COLUMN IF NOT EXISTS decision_area text,
ADD COLUMN IF NOT EXISTS urgency text,
ADD COLUMN IF NOT EXISTS budget_range text,
ADD COLUMN IF NOT EXISTS organization text,
ADD COLUMN IF NOT EXISTS name text,
ADD COLUMN IF NOT EXISTS email text;

-- Create AI intelligence logs table
CREATE TABLE IF NOT EXISTS public.ai_intelligence_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  log_type text NOT NULL,
  trigger_source text NOT NULL,
  visitor_id uuid REFERENCES public.visitor_profiles(id),
  request_id uuid REFERENCES public.access_requests(id),
  input_data jsonb DEFAULT '{}'::jsonb,
  output_data jsonb DEFAULT '{}'::jsonb,
  model_used text,
  tokens_used integer,
  processing_time_ms integer
);

-- Enable RLS on ai_intelligence_logs
ALTER TABLE public.ai_intelligence_logs ENABLE ROW LEVEL SECURITY;

-- Allow inserts from edge functions
CREATE POLICY "Allow AI intelligence log creation"
ON public.ai_intelligence_logs
FOR INSERT
WITH CHECK (true);

-- Allow public reads for transparency
CREATE POLICY "Allow public intelligence log reads"
ON public.ai_intelligence_logs
FOR SELECT
USING (true);

-- Create chat messages table for Sovereign Interface
CREATE TABLE IF NOT EXISTS public.oracle_conversations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  visitor_id uuid REFERENCES public.visitor_profiles(id),
  session_id text NOT NULL,
  messages jsonb NOT NULL DEFAULT '[]'::jsonb,
  context jsonb DEFAULT '{}'::jsonb,
  status text NOT NULL DEFAULT 'active'
);

-- Enable RLS
ALTER TABLE public.oracle_conversations ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Allow conversation creation"
ON public.oracle_conversations
FOR INSERT
WITH CHECK (true);

CREATE POLICY "Allow conversation reads"
ON public.oracle_conversations
FOR SELECT
USING (true);

CREATE POLICY "Allow conversation updates"
ON public.oracle_conversations
FOR UPDATE
USING (true);

-- Add realtime for conversations
ALTER PUBLICATION supabase_realtime ADD TABLE public.oracle_conversations;
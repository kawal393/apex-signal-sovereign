-- Add scheduled_insights table for proactive AI-generated insights
CREATE TABLE public.scheduled_insights (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  insight_type TEXT NOT NULL, -- 're_engagement', 'signal_digest', 'threshold_alert'
  target_visitor_id UUID REFERENCES public.visitor_profiles(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  metadata JSONB DEFAULT '{}'::jsonb,
  generated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  delivered BOOLEAN DEFAULT FALSE,
  delivered_at TIMESTAMPTZ
);

-- Add promotion_probability column to visitor_profiles
ALTER TABLE public.visitor_profiles 
ADD COLUMN IF NOT EXISTS promotion_probability NUMERIC DEFAULT 0;

-- Enable RLS on scheduled_insights
ALTER TABLE public.scheduled_insights ENABLE ROW LEVEL SECURITY;

-- Policy for reading insights
CREATE POLICY "Allow public insight reads"
ON public.scheduled_insights
FOR SELECT
USING (true);

-- Policy for creating insights (from edge functions)
CREATE POLICY "Allow insight creation"
ON public.scheduled_insights
FOR INSERT
WITH CHECK (true);

-- Policy for updating insights
CREATE POLICY "Allow insight updates"
ON public.scheduled_insights
FOR UPDATE
USING (true);

-- Index for efficient querying
CREATE INDEX idx_scheduled_insights_visitor ON public.scheduled_insights(target_visitor_id);
CREATE INDEX idx_scheduled_insights_type ON public.scheduled_insights(insight_type);
CREATE INDEX idx_scheduled_insights_delivered ON public.scheduled_insights(delivered) WHERE delivered = false;
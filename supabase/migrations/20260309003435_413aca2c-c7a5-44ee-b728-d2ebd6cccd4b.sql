-- Create lattice_config table for cross-platform configuration
CREATE TABLE public.lattice_config (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  key text NOT NULL UNIQUE,
  value text NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.lattice_config ENABLE ROW LEVEL SECURITY;

-- Allow authenticated users to read
CREATE POLICY "Authenticated users can read lattice config"
  ON public.lattice_config
  FOR SELECT
  TO authenticated
  USING (true);

-- No client writes (admin only via service_role)
CREATE POLICY "No client writes on lattice config"
  ON public.lattice_config
  FOR INSERT
  WITH CHECK (false);

CREATE POLICY "No client updates on lattice config"
  ON public.lattice_config
  FOR UPDATE
  USING (false);

CREATE POLICY "No client deletes on lattice config"
  ON public.lattice_config
  FOR DELETE
  USING (false);

-- Seed with sovereign lattice URL
INSERT INTO public.lattice_config (key, value) VALUES 
  ('sovereign_lattice_url', 'https://uvhpmohzdwbbsldotszy.supabase.co/functions/v1/sovereign-lattice'),
  ('node_name', 'Apex Infrastructure'),
  ('node_id', 'apex-infrastructure');
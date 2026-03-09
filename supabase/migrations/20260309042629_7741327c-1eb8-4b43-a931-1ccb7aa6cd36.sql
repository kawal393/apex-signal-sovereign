
CREATE TABLE public.orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz NOT NULL DEFAULT now(),
  email text NOT NULL,
  name text,
  tier text NOT NULL,
  amount_cents integer NOT NULL DEFAULT 0,
  currency text NOT NULL DEFAULT 'aud',
  stripe_session_id text UNIQUE,
  stripe_payment_intent_id text,
  status text NOT NULL DEFAULT 'pending',
  access_request_id uuid REFERENCES public.access_requests(id),
  referral_partner_id text,
  metadata jsonb DEFAULT '{}'::jsonb
);

ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "No client reads on orders" ON public.orders FOR SELECT USING (false);
CREATE POLICY "No client inserts on orders" ON public.orders FOR INSERT WITH CHECK (false);
CREATE POLICY "No client updates on orders" ON public.orders FOR UPDATE USING (false);
CREATE POLICY "No client deletes on orders" ON public.orders FOR DELETE USING (false);

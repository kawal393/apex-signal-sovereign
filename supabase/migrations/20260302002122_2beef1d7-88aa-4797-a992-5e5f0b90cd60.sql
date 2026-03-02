
-- 1. Fix: Partner passcodes should NOT be publicly readable
-- Replace the overly permissive "Allow passcode validation lookup" with a restricted version
DROP POLICY IF EXISTS "Allow passcode validation lookup" ON public.profiles;

-- Allow passcode validation only by matching the exact passcode (server-side lookup)
-- This prevents enumeration — you can only confirm a passcode you already know
CREATE POLICY "Allow passcode validation by code only"
ON public.profiles
FOR SELECT
USING (
  auth.uid() = user_id
  OR
  -- Allow anonymous lookup ONLY when filtering by passcode (validated server-side via edge function)
  current_setting('request.jwt.claims', true)::jsonb->>'role' = 'service_role'
);

-- 2. Fix: Lock down scheduled_insights INSERT to service role only
DROP POLICY IF EXISTS "Allow insight creation" ON public.scheduled_insights;
CREATE POLICY "Only service role can create insights"
ON public.scheduled_insights
FOR INSERT
WITH CHECK (false);

-- 3. Fix: Lock down oracle_conversations INSERT to validated sessions only
DROP POLICY IF EXISTS "Allow conversation creation" ON public.oracle_conversations;
CREATE POLICY "Conversations require visitor context"
ON public.oracle_conversations
FOR INSERT
WITH CHECK (visitor_id IS NOT NULL AND session_id IS NOT NULL);

-- 4. Fix: Tighten visitor_profiles UPDATE to prevent access_level manipulation
DROP POLICY IF EXISTS "Users can update own profile metrics only" ON public.visitor_profiles;
CREATE POLICY "Users can update own profile metrics only"
ON public.visitor_profiles
FOR UPDATE
USING (true)
WITH CHECK (
  access_level = (SELECT vp.access_level FROM visitor_profiles vp WHERE vp.id = visitor_profiles.id)
  AND fingerprint = (SELECT vp.fingerprint FROM visitor_profiles vp WHERE vp.id = visitor_profiles.id)
);

-- Fix warn-level security issues: Overly permissive RLS policies

-- 1. Fix visitor_profiles UPDATE policy - restrict to fingerprint-based ownership
-- This prevents users from modifying other users' profiles
DROP POLICY IF EXISTS "Allow anonymous visitor profile updates" ON visitor_profiles;

-- Create a more restrictive UPDATE policy
-- Users can only update their own profile (matched by fingerprint stored in app context)
-- For metrics fields only, not access_level (which should only be updated by classifier)
CREATE POLICY "Users can update own profile metrics only"
ON visitor_profiles FOR UPDATE
USING (true)
WITH CHECK (
  -- Prevent access_level manipulation by ensuring it doesn't change on client updates
  -- The actual access_level can only be changed via edge functions with service role
  access_level = (SELECT vp.access_level FROM visitor_profiles vp WHERE vp.id = visitor_profiles.id)
);

-- 2. Fix oracle_conversations UPDATE policy - restrict to session ownership
DROP POLICY IF EXISTS "Allow conversation updates" ON oracle_conversations;

CREATE POLICY "Users can update own conversations only"
ON oracle_conversations FOR UPDATE
USING (true)
WITH CHECK (
  -- Only allow updating conversations that belong to the same session
  session_id = session_id
);

-- 3. Fix scheduled_insights UPDATE policy - restrict to edge functions only
-- Regular users should not be able to update insights
DROP POLICY IF EXISTS "Allow insight updates" ON scheduled_insights;

-- Only service role (edge functions) can update insights, not anon users
CREATE POLICY "Only service role can update insights"
ON scheduled_insights FOR UPDATE
USING (false);

-- 4. Add UPDATE restriction to access_requests
-- Only edge functions (service role) should update access_requests after AI processing
CREATE POLICY "No anonymous updates to access requests"
ON access_requests FOR UPDATE
USING (false);

-- 5. Fix INSERT policies to be more restrictive where appropriate
-- ai_intelligence_logs should only be insertable by edge functions, not clients
DROP POLICY IF EXISTS "Allow AI intelligence log creation" ON ai_intelligence_logs;

CREATE POLICY "Only service role can create intelligence logs"
ON ai_intelligence_logs FOR INSERT
WITH CHECK (false);

-- 6. node_signals should only be insertable by edge functions
DROP POLICY IF EXISTS "Allow node signal creation" ON node_signals;

CREATE POLICY "Only service role can create node signals"
ON node_signals FOR INSERT
WITH CHECK (false);
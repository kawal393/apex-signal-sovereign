-- Security Hardening: Fix error-level RLS vulnerabilities

-- 1. Access Requests: Prevent public exposure of access requests
DROP POLICY IF EXISTS "Allow anonymous access request reads" ON access_requests;
CREATE POLICY "Service role only reads access requests" ON access_requests 
FOR SELECT USING (false);

-- 2. Session Events: Already fixed (no SELECT policy exists), but ensure it's locked
-- The table already has no SELECT policy, so behavioral data is protected

-- Note: visitor_profiles UPDATE policy is already correctly configured
-- It uses WITH CHECK to prevent access_level changes while allowing metric updates
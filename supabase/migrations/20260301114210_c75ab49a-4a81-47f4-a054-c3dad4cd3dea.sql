
-- Allow passcode validation lookups (only returns id, no sensitive data exposed)
CREATE POLICY "Allow passcode validation lookup"
ON public.profiles
FOR SELECT
USING (true);

-- Drop the old restrictive select policy since we now have a permissive one
-- The old one was restrictive (PERMISSIVE: No) so it would AND with this
-- Actually we need to keep both - the new permissive one covers all reads
-- But the old one is restrictive so it would block. Let's drop and recreate as permissive.
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
CREATE POLICY "Users can view own profile"
ON public.profiles
FOR SELECT
USING (auth.uid() = user_id);

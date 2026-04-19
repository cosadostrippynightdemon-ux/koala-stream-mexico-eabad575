-- Simplify user_roles RLS: remove the permissive ALL policy that overlaps
-- with the restrictive INSERT/UPDATE/DELETE admin policies. Keep clear,
-- single-purpose policies to eliminate fragile dual-policy patterns.

DROP POLICY IF EXISTS "Admins can manage roles" ON public.user_roles;

-- Ensure admins can still perform each action via dedicated permissive
-- policies (the existing RESTRICTIVE policies will additionally enforce
-- that only admins can write).
DROP POLICY IF EXISTS "Admins can insert any role" ON public.user_roles;
CREATE POLICY "Admins can insert any role"
ON public.user_roles
FOR INSERT
TO authenticated
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

DROP POLICY IF EXISTS "Admins can update any role" ON public.user_roles;
CREATE POLICY "Admins can update any role"
ON public.user_roles
FOR UPDATE
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

DROP POLICY IF EXISTS "Admins can delete any role" ON public.user_roles;
CREATE POLICY "Admins can delete any role"
ON public.user_roles
FOR DELETE
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));

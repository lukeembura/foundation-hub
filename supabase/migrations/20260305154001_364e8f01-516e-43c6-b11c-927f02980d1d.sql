-- Allow authenticated users to update only their own non-admin role.
-- This supports tenant/landlord selection right after signup while preventing privilege escalation.
CREATE POLICY "Users can update own non-admin role"
ON public.user_roles
FOR UPDATE
TO authenticated
USING (
  auth.uid() = user_id
  AND role IN ('tenant'::app_role, 'landlord'::app_role)
)
WITH CHECK (
  auth.uid() = user_id
  AND role IN ('tenant'::app_role, 'landlord'::app_role)
);
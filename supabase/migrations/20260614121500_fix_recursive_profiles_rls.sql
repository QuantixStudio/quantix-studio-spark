-- Fix recursive RLS checks that reference public.profiles inside policies.
-- The live project uses profiles.role as the source of truth for roles, so
-- helper functions must read profiles via SECURITY DEFINER instead of
-- recursively querying profiles through another RLS policy.

CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.profiles
    WHERE id = _user_id
      AND role = _role
  );
$$;

CREATE OR REPLACE FUNCTION public.has_any_role(_user_id uuid, _roles public.app_role[])
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.profiles
    WHERE id = _user_id
      AND role = ANY (_roles)
  );
$$;

CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT public.has_role(auth.uid(), 'admin'::public.app_role);
$$;

DO $$
DECLARE
  policy_record record;
BEGIN
  FOR policy_record IN
    SELECT
      schemaname,
      tablename,
      policyname,
      with_check IS NOT NULL AS has_with_check
    FROM pg_policies
    WHERE schemaname = 'public'
      AND (
        COALESCE(qual, '') ILIKE '%from profiles%'
        OR COALESCE(with_check, '') ILIKE '%from profiles%'
      )
  LOOP
    IF policy_record.has_with_check THEN
      EXECUTE format(
        'ALTER POLICY %I ON %I.%I TO authenticated USING (public.has_any_role(auth.uid(), ARRAY[''admin''::public.app_role, ''manager''::public.app_role])) WITH CHECK (public.has_any_role(auth.uid(), ARRAY[''admin''::public.app_role, ''manager''::public.app_role]))',
        policy_record.policyname,
        policy_record.schemaname,
        policy_record.tablename
      );
    ELSE
      EXECUTE format(
        'ALTER POLICY %I ON %I.%I TO authenticated USING (public.has_any_role(auth.uid(), ARRAY[''admin''::public.app_role, ''manager''::public.app_role]))',
        policy_record.policyname,
        policy_record.schemaname,
        policy_record.tablename
      );
    END IF;
  END LOOP;
END
$$;

ALTER POLICY "public_read_how_we_work"
ON public.how_we_work
TO public
USING (true);

ALTER POLICY "public_read_why_choose_us"
ON public.why_choose_us
TO public
USING (true);

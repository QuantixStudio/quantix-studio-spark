-- Create a dedicated storage bucket for profile avatars and align RLS with
-- both self-service profile editing and admin-side profile management.

INSERT INTO storage.buckets (id, name, public)
VALUES ('profiles_avatar', 'profiles_avatar', true)
ON CONFLICT (id) DO UPDATE
SET public = EXCLUDED.public;

DROP POLICY IF EXISTS "profiles_avatar_public_read" ON storage.objects;
DROP POLICY IF EXISTS "profiles_avatar_self_insert" ON storage.objects;
DROP POLICY IF EXISTS "profiles_avatar_self_update" ON storage.objects;
DROP POLICY IF EXISTS "profiles_avatar_self_delete" ON storage.objects;
DROP POLICY IF EXISTS "profiles_avatar_admin_insert" ON storage.objects;
DROP POLICY IF EXISTS "profiles_avatar_admin_update" ON storage.objects;
DROP POLICY IF EXISTS "profiles_avatar_admin_delete" ON storage.objects;

CREATE POLICY "profiles_avatar_public_read"
ON storage.objects
FOR SELECT
TO public
USING (bucket_id = 'profiles_avatar');

CREATE POLICY "profiles_avatar_self_insert"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'profiles_avatar'
  AND auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "profiles_avatar_self_update"
ON storage.objects
FOR UPDATE
TO authenticated
USING (
  bucket_id = 'profiles_avatar'
  AND auth.uid()::text = (storage.foldername(name))[1]
)
WITH CHECK (
  bucket_id = 'profiles_avatar'
  AND auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "profiles_avatar_self_delete"
ON storage.objects
FOR DELETE
TO authenticated
USING (
  bucket_id = 'profiles_avatar'
  AND auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "profiles_avatar_admin_insert"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'profiles_avatar'
  AND public.has_any_role(
    auth.uid(),
    ARRAY['admin'::public.app_role, 'manager'::public.app_role]
  )
);

CREATE POLICY "profiles_avatar_admin_update"
ON storage.objects
FOR UPDATE
TO authenticated
USING (
  bucket_id = 'profiles_avatar'
  AND public.has_any_role(
    auth.uid(),
    ARRAY['admin'::public.app_role, 'manager'::public.app_role]
  )
)
WITH CHECK (
  bucket_id = 'profiles_avatar'
  AND public.has_any_role(
    auth.uid(),
    ARRAY['admin'::public.app_role, 'manager'::public.app_role]
  )
);

CREATE POLICY "profiles_avatar_admin_delete"
ON storage.objects
FOR DELETE
TO authenticated
USING (
  bucket_id = 'profiles_avatar'
  AND public.has_any_role(
    auth.uid(),
    ARRAY['admin'::public.app_role, 'manager'::public.app_role]
  )
);

-- Align the tools_logos bucket with the admin tool manager and allow both
-- admins and managers to upload, replace, and delete tool logos.

INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'tools_logos',
  'tools_logos',
  true,
  2097152,
  ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/svg+xml']
)
ON CONFLICT (id) DO UPDATE
SET
  public = EXCLUDED.public,
  file_size_limit = EXCLUDED.file_size_limit,
  allowed_mime_types = EXCLUDED.allowed_mime_types;

DROP POLICY IF EXISTS "Public read access for tool logos" ON storage.objects;
DROP POLICY IF EXISTS "Admins can upload tool logos" ON storage.objects;
DROP POLICY IF EXISTS "Admins can update tool logos" ON storage.objects;
DROP POLICY IF EXISTS "Admins can delete tool logos" ON storage.objects;
DROP POLICY IF EXISTS "tools_logos_public_read" ON storage.objects;
DROP POLICY IF EXISTS "tools_logos_admin_insert" ON storage.objects;
DROP POLICY IF EXISTS "tools_logos_admin_update" ON storage.objects;
DROP POLICY IF EXISTS "tools_logos_admin_delete" ON storage.objects;

CREATE POLICY "tools_logos_public_read"
ON storage.objects
FOR SELECT
TO public
USING (bucket_id = 'tools_logos');

CREATE POLICY "tools_logos_admin_insert"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'tools_logos'
  AND public.has_any_role(
    auth.uid(),
    ARRAY['admin'::public.app_role, 'manager'::public.app_role]
  )
);

CREATE POLICY "tools_logos_admin_update"
ON storage.objects
FOR UPDATE
TO authenticated
USING (
  bucket_id = 'tools_logos'
  AND public.has_any_role(
    auth.uid(),
    ARRAY['admin'::public.app_role, 'manager'::public.app_role]
  )
)
WITH CHECK (
  bucket_id = 'tools_logos'
  AND public.has_any_role(
    auth.uid(),
    ARRAY['admin'::public.app_role, 'manager'::public.app_role]
  )
);

CREATE POLICY "tools_logos_admin_delete"
ON storage.objects
FOR DELETE
TO authenticated
USING (
  bucket_id = 'tools_logos'
  AND public.has_any_role(
    auth.uid(),
    ARRAY['admin'::public.app_role, 'manager'::public.app_role]
  )
);

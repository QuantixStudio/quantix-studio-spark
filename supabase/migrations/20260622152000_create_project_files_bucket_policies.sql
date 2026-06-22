-- Align the project_files bucket with the admin project editor and allow both
-- admins and managers to upload, replace, and delete project delivery files.

INSERT INTO storage.buckets (id, name, public)
VALUES ('project_files', 'project_files', true)
ON CONFLICT (id) DO UPDATE
SET public = EXCLUDED.public;

DROP POLICY IF EXISTS "project_files_public_read" ON storage.objects;
DROP POLICY IF EXISTS "project_files_admin_insert" ON storage.objects;
DROP POLICY IF EXISTS "project_files_admin_update" ON storage.objects;
DROP POLICY IF EXISTS "project_files_admin_delete" ON storage.objects;

CREATE POLICY "project_files_public_read"
ON storage.objects
FOR SELECT
TO public
USING (bucket_id = 'project_files');

CREATE POLICY "project_files_admin_insert"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'project_files'
  AND public.has_any_role(
    auth.uid(),
    ARRAY['admin'::public.app_role, 'manager'::public.app_role]
  )
);

CREATE POLICY "project_files_admin_update"
ON storage.objects
FOR UPDATE
TO authenticated
USING (
  bucket_id = 'project_files'
  AND public.has_any_role(
    auth.uid(),
    ARRAY['admin'::public.app_role, 'manager'::public.app_role]
  )
)
WITH CHECK (
  bucket_id = 'project_files'
  AND public.has_any_role(
    auth.uid(),
    ARRAY['admin'::public.app_role, 'manager'::public.app_role]
  )
);

CREATE POLICY "project_files_admin_delete"
ON storage.objects
FOR DELETE
TO authenticated
USING (
  bucket_id = 'project_files'
  AND public.has_any_role(
    auth.uid(),
    ARRAY['admin'::public.app_role, 'manager'::public.app_role]
  )
);

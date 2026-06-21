-- Align the live `Project_images` bucket with repo-managed storage policies so
-- project media uploads work from the admin UI.

INSERT INTO storage.buckets (id, name, public)
VALUES ('Project_images', 'Project_images', true)
ON CONFLICT (id) DO UPDATE
SET public = EXCLUDED.public;

DROP POLICY IF EXISTS "project_images_public_read" ON storage.objects;
DROP POLICY IF EXISTS "project_images_admin_insert" ON storage.objects;
DROP POLICY IF EXISTS "project_images_admin_update" ON storage.objects;
DROP POLICY IF EXISTS "project_images_admin_delete" ON storage.objects;

CREATE POLICY "project_images_public_read"
ON storage.objects
FOR SELECT
TO public
USING (bucket_id = 'Project_images');

CREATE POLICY "project_images_admin_insert"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'Project_images'
  AND public.has_any_role(
    auth.uid(),
    ARRAY['admin'::public.app_role, 'manager'::public.app_role]
  )
);

CREATE POLICY "project_images_admin_update"
ON storage.objects
FOR UPDATE
TO authenticated
USING (
  bucket_id = 'Project_images'
  AND public.has_any_role(
    auth.uid(),
    ARRAY['admin'::public.app_role, 'manager'::public.app_role]
  )
)
WITH CHECK (
  bucket_id = 'Project_images'
  AND public.has_any_role(
    auth.uid(),
    ARRAY['admin'::public.app_role, 'manager'::public.app_role]
  )
);

CREATE POLICY "project_images_admin_delete"
ON storage.objects
FOR DELETE
TO authenticated
USING (
  bucket_id = 'Project_images'
  AND public.has_any_role(
    auth.uid(),
    ARRAY['admin'::public.app_role, 'manager'::public.app_role]
  )
);

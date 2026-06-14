-- Create tools_logos storage bucket used by the admin tools manager.
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'tools_logos',
  'tools_logos',
  true,
  2097152,
  ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/svg+xml']
)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Public read access for tool logos"
ON storage.objects FOR SELECT
USING (bucket_id = 'tools_logos');

CREATE POLICY "Admins can upload tool logos"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'tools_logos'
  AND public.has_role(auth.uid(), 'admin'::app_role)
);

CREATE POLICY "Admins can update tool logos"
ON storage.objects FOR UPDATE
TO authenticated
USING (
  bucket_id = 'tools_logos'
  AND public.has_role(auth.uid(), 'admin'::app_role)
)
WITH CHECK (
  bucket_id = 'tools_logos'
  AND public.has_role(auth.uid(), 'admin'::app_role)
);

CREATE POLICY "Admins can delete tool logos"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'tools_logos'
  AND public.has_role(auth.uid(), 'admin'::app_role)
);

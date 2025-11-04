-- Create testimonials_avatars storage bucket
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'testimonials_avatars',
  'testimonials_avatars',
  true,
  2097152, -- 2MB
  ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
);

-- RLS Policies for testimonials_avatars bucket

-- Allow public read access to avatars
CREATE POLICY "Public read access for testimonial avatars"
ON storage.objects FOR SELECT
USING (bucket_id = 'testimonials_avatars');

-- Allow authenticated admins to upload avatars
CREATE POLICY "Admins can upload testimonial avatars"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'testimonials_avatars' 
  AND (storage.foldername(name))[1] = 'testimonials'
  AND public.has_role(auth.uid(), 'admin'::app_role)
);

-- Allow authenticated admins to update avatars
CREATE POLICY "Admins can update testimonial avatars"
ON storage.objects FOR UPDATE
TO authenticated
USING (
  bucket_id = 'testimonials_avatars'
  AND public.has_role(auth.uid(), 'admin'::app_role)
)
WITH CHECK (
  bucket_id = 'testimonials_avatars'
  AND public.has_role(auth.uid(), 'admin'::app_role)
);

-- Allow authenticated admins to delete avatars
CREATE POLICY "Admins can delete testimonial avatars"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'testimonials_avatars'
  AND public.has_role(auth.uid(), 'admin'::app_role)
);
-- Add avatar_url and bio columns to profiles table
ALTER TABLE public.profiles 
  ADD COLUMN IF NOT EXISTS avatar_url TEXT,
  ADD COLUMN IF NOT EXISTS bio TEXT;

-- Helper function to check if current user is admin
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT public.has_role(auth.uid(), 'admin'::app_role);
$$;

-- Drop existing policies if they exist and recreate them
DROP POLICY IF EXISTS "Users can upload their own avatar" ON storage.objects;
DROP POLICY IF EXISTS "Users can update their own avatar" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete their own avatar" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can view avatars" ON storage.objects;
DROP POLICY IF EXISTS "Admins can upload to portfolio" ON storage.objects;
DROP POLICY IF EXISTS "Admins can update portfolio" ON storage.objects;
DROP POLICY IF EXISTS "Admins can delete portfolio" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can view portfolio" ON storage.objects;

-- Storage RLS policies for avatars bucket
CREATE POLICY "Users can upload their own avatar"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'avatars' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can update their own avatar"
ON storage.objects FOR UPDATE
TO authenticated
USING (
  bucket_id = 'avatars' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can delete their own avatar"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'avatars' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Anyone can view avatars"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'avatars');

-- Storage RLS policies for portfolio bucket (admin only)
CREATE POLICY "Admins can upload to portfolio"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'portfolio' 
  AND public.is_admin()
);

CREATE POLICY "Admins can update portfolio"
ON storage.objects FOR UPDATE
TO authenticated
USING (
  bucket_id = 'portfolio' 
  AND public.is_admin()
);

CREATE POLICY "Admins can delete portfolio"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'portfolio' 
  AND public.is_admin()
);

CREATE POLICY "Anyone can view portfolio"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'portfolio');
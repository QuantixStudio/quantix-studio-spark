-- Align public.project_files RLS with the current admin experience so
-- admins and managers can insert, update, and delete project file records.

ALTER TABLE public.project_files ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public_read_project_files" ON public.project_files;
DROP POLICY IF EXISTS "admin_manage_project_files" ON public.project_files;
DROP POLICY IF EXISTS "Anyone can view project files" ON public.project_files;
DROP POLICY IF EXISTS "Admins can manage project files" ON public.project_files;

CREATE POLICY "public_read_project_files"
ON public.project_files
FOR SELECT
TO public
USING (true);

CREATE POLICY "admin_manage_project_files"
ON public.project_files
FOR ALL
TO authenticated
USING (
  public.has_any_role(
    auth.uid(),
    ARRAY['admin'::public.app_role, 'manager'::public.app_role]
  )
)
WITH CHECK (
  public.has_any_role(
    auth.uid(),
    ARRAY['admin'::public.app_role, 'manager'::public.app_role]
  )
);

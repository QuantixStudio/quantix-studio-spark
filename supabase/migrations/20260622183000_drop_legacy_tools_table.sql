-- Remove the legacy public.tools table now that the application reads stack data
-- directly from public.technologies and stores logos on technologies.logo_path.
-- CASCADE is intentional here to remove any leftover legacy views or constraints
-- from the old tools-based stack model in one migration.

drop table if exists public.tools cascade;

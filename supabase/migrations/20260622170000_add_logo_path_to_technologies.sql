-- Store technology logos directly on the technologies table so public UI and
-- admin management no longer depend on the legacy tools table.

ALTER TABLE public.technologies
ADD COLUMN IF NOT EXISTS logo_path text;

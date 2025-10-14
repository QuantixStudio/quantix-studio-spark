-- Add multi-image support and featured project columns
ALTER TABLE projects 
  ADD COLUMN IF NOT EXISTS images JSONB DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS show_on_home BOOLEAN DEFAULT false,
  ADD COLUMN IF NOT EXISTS key_metric TEXT;

-- Migrate existing cover_url to images array
UPDATE projects 
SET images = jsonb_build_array(
  jsonb_build_object(
    'url', cover_url,
    'alt', title,
    'is_main', true,
    'order', 0
  )
)
WHERE cover_url IS NOT NULL AND cover_url != '' AND (images IS NULL OR images = '[]'::jsonb);

-- Create index for show_on_home queries
CREATE INDEX IF NOT EXISTS idx_projects_show_on_home ON projects(show_on_home) 
WHERE show_on_home = true;

-- Add comment for images structure
COMMENT ON COLUMN projects.images IS 'JSONB array of image objects: [{"url": "...", "alt": "...", "is_main": true, "order": 0}]';

-- Extend inquiries table with additional fields
ALTER TABLE inquiries 
  ADD COLUMN IF NOT EXISTS company TEXT,
  ADD COLUMN IF NOT EXISTS use_case TEXT,
  ADD COLUMN IF NOT EXISTS timeline TEXT,
  ADD COLUMN IF NOT EXISTS budget_range TEXT,
  ADD COLUMN IF NOT EXISTS utm_params JSONB,
  ADD COLUMN IF NOT EXISTS page_path TEXT;
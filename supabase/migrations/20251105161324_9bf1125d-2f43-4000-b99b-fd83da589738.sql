-- Step 1: Drop the existing primary key constraint
ALTER TABLE project_technologies DROP CONSTRAINT IF EXISTS project_technologies_pkey;

-- Step 2: Add a new UUID primary key column
ALTER TABLE project_technologies ADD COLUMN id uuid DEFAULT gen_random_uuid() PRIMARY KEY;

-- Step 3: Make technology_id nullable and rename it
ALTER TABLE project_technologies ALTER COLUMN technology_id DROP NOT NULL;
ALTER TABLE project_technologies RENAME COLUMN technology_id TO legacy_technology_id;

-- Step 4: Add comments
COMMENT ON COLUMN project_technologies.tools IS 'Array of tool IDs from tools table - this is the new approach';
COMMENT ON COLUMN project_technologies.legacy_technology_id IS 'DEPRECATED: Old reference to technologies table, use tools array instead';
COMMENT ON TABLE project_technologies IS 'Junction table linking projects to tools. Each project should have one row with an array of tool IDs.';

-- Step 5: Add GIN index on tools array for better performance
CREATE INDEX IF NOT EXISTS idx_project_technologies_tools ON project_technologies USING GIN (tools);

-- Step 6: Add unique constraint on project_id (one row per project)
CREATE UNIQUE INDEX IF NOT EXISTS idx_project_technologies_project_id ON project_technologies(project_id);

-- Step 7: Create a view that automatically joins projects with their tools
CREATE OR REPLACE VIEW projects_with_tools AS
SELECT 
  p.*,
  COALESCE(
    (
      SELECT json_agg(
        json_build_object(
          'id', t.id,
          'name', t.name,
          'slug', t.slug,
          'logo_path', t.logo_path,
          'categories', t.categories,
          'description', t.description,
          'website_url', t.website_url
        ) ORDER BY t.name
      )
      FROM project_technologies pt
      CROSS JOIN UNNEST(pt.tools) AS tool_id
      JOIN tools t ON t.id = tool_id
      WHERE pt.project_id = p.id
    ),
    '[]'::json
  ) as project_tools
FROM projects p;

-- Step 8: Grant permissions for the view
GRANT SELECT ON projects_with_tools TO authenticated, anon;

-- Step 9: Update RLS policies for project_technologies to allow admin management
DROP POLICY IF EXISTS "Anyone can view project technologies" ON project_technologies;
DROP POLICY IF EXISTS "Admins can manage project technologies" ON project_technologies;

CREATE POLICY "Anyone can view project technologies"
ON project_technologies FOR SELECT
USING (true);

CREATE POLICY "Admins can manage project technologies"
ON project_technologies FOR ALL
USING (has_role(auth.uid(), 'admin'::app_role));
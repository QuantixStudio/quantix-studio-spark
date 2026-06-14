-- Phase 1.1: Link Services to Service Icons
UPDATE services SET icon_id = (
  SELECT id FROM service_icon WHERE name = 'Smartphone' LIMIT 1
) WHERE title = 'Web & Mobile Apps';

UPDATE services SET icon_id = (
  SELECT id FROM service_icon WHERE name = 'Workflow' LIMIT 1
) WHERE title = 'Business Automation';

UPDATE services SET icon_id = (
  SELECT id FROM service_icon WHERE name = 'Brain' LIMIT 1
) WHERE title = 'AI Integration';

UPDATE services SET icon_id = (
  SELECT id FROM service_icon WHERE name = 'Cloud' LIMIT 1
) WHERE title = 'Cloud Infrastructure';

-- Phase 1.2: Create and link Project Categories
INSERT INTO project_category (name, description, order_index) VALUES
  ('Web App', 'Full-stack web applications', 1),
  ('Automation', 'Business process automation', 2),
  ('AI', 'Artificial intelligence solutions', 3)
ON CONFLICT DO NOTHING;

UPDATE projects SET category_id = (
  SELECT id FROM project_category WHERE name = 'Web App' LIMIT 1
) WHERE slug = 'ecommerce-platform';

UPDATE projects SET category_id = (
  SELECT id FROM project_category WHERE name = 'Automation' LIMIT 1
) WHERE slug = 'task-automation-hub';

UPDATE projects SET category_id = (
  SELECT id FROM project_category WHERE name = 'AI' LIMIT 1
) WHERE slug = 'ai-assistant-dashboard';

-- Phase 1.3: Create Technologies and link to Projects
INSERT INTO technologies (name) VALUES
  ('React'), ('TypeScript'), ('Supabase'), ('Stripe'), ('Tailwind CSS'),
  ('n8n'), ('Node.js'), ('PostgreSQL'), ('OpenAI'), ('Python'), ('Vector DB')
ON CONFLICT DO NOTHING;

-- Link E-Commerce Platform technologies
INSERT INTO project_technologies (project_id, technology_id)
SELECT 
  (SELECT id FROM projects WHERE slug = 'ecommerce-platform'),
  id
FROM technologies 
WHERE name IN ('React', 'TypeScript', 'Supabase', 'Stripe', 'Tailwind CSS')
ON CONFLICT DO NOTHING;

-- Link Task Automation Hub technologies
INSERT INTO project_technologies (project_id, technology_id)
SELECT 
  (SELECT id FROM projects WHERE slug = 'task-automation-hub'),
  id
FROM technologies 
WHERE name IN ('n8n', 'Supabase', 'Node.js', 'PostgreSQL', 'React')
ON CONFLICT DO NOTHING;

-- Link AI Assistant Dashboard technologies
INSERT INTO project_technologies (project_id, technology_id)
SELECT 
  (SELECT id FROM projects WHERE slug = 'ai-assistant-dashboard'),
  id
FROM technologies 
WHERE name IN ('OpenAI', 'Supabase', 'Python', 'React', 'Vector DB')
ON CONFLICT DO NOTHING;

-- Phase 1.4: Remove deprecated column from services
ALTER TABLE services DROP COLUMN IF EXISTS icon_url;

-- Ensure inquiry_status has default 'new' status
INSERT INTO inquiry_status (id, label, color, order_index) VALUES
  ('new', 'New', '#3b82f6', 1),
  ('in_progress', 'In Progress', '#f59e0b', 2),
  ('completed', 'Completed', '#10b981', 3)
ON CONFLICT (id) DO NOTHING;
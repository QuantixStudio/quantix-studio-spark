-- Update services with new Quantix Studio service offerings

-- First, mark all existing services as unpublished
UPDATE services SET published = false;

-- Insert only new service icons that don't exist yet
INSERT INTO service_icon (id, name, icon_url)
VALUES 
  ('a1b2c3d4-e5f6-4a5b-8c9d-0e1f2a3b4c5d', 'LayoutDashboard', NULL),
  ('b2c3d4e5-f6a7-4b5c-9d0e-1f2a3b4c5d6e', 'BrainCircuit', NULL),
  ('c3d4e5f6-a7b8-4c5d-0e1f-2a3b4c5d6e7f', 'Server', NULL)
ON CONFLICT (name) DO NOTHING;

-- Get icon IDs for our services
DO $$
DECLARE
  layout_icon_id uuid;
  brain_icon_id uuid;
  server_icon_id uuid;
  workflow_icon_id uuid;
BEGIN
  -- Get icon IDs
  SELECT id INTO layout_icon_id FROM service_icon WHERE name = 'LayoutDashboard';
  SELECT id INTO brain_icon_id FROM service_icon WHERE name = 'BrainCircuit';
  SELECT id INTO server_icon_id FROM service_icon WHERE name = 'Server';
  SELECT id INTO workflow_icon_id FROM service_icon WHERE name = 'Workflow';

  -- Insert new services with proper descriptions including tools
  INSERT INTO services (id, title, description, icon_id, published, order_index)
  VALUES 
    (
      'e5f6a7b8-c9d0-4e5f-2a3b-4c5d6e7f8a9b',
      'No-Code Product Development',
      E'Tools: Bubble · Webflow · WeWeb · Lovable\nWe design and launch full-scale digital products using modern no-code and low-code platforms — combining speed, scalability, and great design.',
      layout_icon_id,
      true,
      1
    ),
    (
      'f6a7b8c9-d0e1-4f5a-3b4c-5d6e7f8a9b0c',
      'AI-Powered Automation',
      E'Tools: n8n · GPT · Supabase\nWe build AI-driven workflows and automations that save time, cut manual work, and connect your business systems into one intelligent ecosystem.',
      brain_icon_id,
      true,
      2
    ),
    (
      'a7b8c9d0-e1f2-4a5b-4c5d-6e7f8a9b0c1d',
      'Scalable Cloud Backend',
      E'Tools: Supabase\nWe set up secure, serverless backends using Supabase — with real-time data, authentication, storage, and edge functions ready to scale.',
      server_icon_id,
      true,
      3
    ),
    (
      'b8c9d0e1-f2a3-4b5c-5d6e-7f8a9b0c1d2e',
      'Integration & Workflow Orchestration',
      E'Tools: n8n · Notion · Airtable · Slack\nWe integrate your favorite tools into a seamless digital workflow — automating operations and ensuring your data stays perfectly in sync.',
      workflow_icon_id,
      true,
      4
    )
  ON CONFLICT (id) DO UPDATE
  SET 
    title = EXCLUDED.title,
    description = EXCLUDED.description,
    icon_id = EXCLUDED.icon_id,
    published = EXCLUDED.published,
    order_index = EXCLUDED.order_index;
END $$;
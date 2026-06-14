insert into public.services (
  id,
  title,
  description,
  order_index,
  published,
  created_at,
  updated_at,
  icon_id
)
values
  (
    'e5f6a7b8-c9d0-4e5f-2a3b-4c5d6e7f8a9b',
    'Bubble SaaS & Platform Development',
    'Production-ready SaaS apps, marketplaces, dashboards, admin panels, client portals and CRM-style platforms built in Bubble.',
    1,
    true,
    '2025-10-16 15:42:09.89208+00',
    '2025-10-16 15:42:09.89208+00',
    'a1b2c3d4-e5f6-4a5b-8c9d-0e1f2a3b4c5d'
  ),
  (
    'f6a7b8c9-d0e1-4f5a-3b4c-5d6e7f8a9b0c',
    'AI Features & Workflow Automation',
    'OpenAI/Claude-powered workflows, assistants, document processing, content systems, smart imports, reports and automation logic.',
    2,
    true,
    '2025-10-16 15:42:09.89208+00',
    '2025-10-16 15:42:09.89208+00',
    'b2c3d4e5-f6a7-4b5c-9d0e-1f2a3b4c5d6e'
  ),
  (
    'a7b8c9d0-e1f2-4a5b-4c5d-6e7f8a9b0c1d',
    'Custom Backend & API Integrations',
    'Vercel/serverless endpoints, webhooks, custom APIs, file processing, Stripe/Paddle, OAuth, background jobs and external service integrations.',
    3,
    true,
    '2025-10-16 15:42:09.89208+00',
    '2025-10-16 15:42:09.89208+00',
    'c3d4e5f6-a7b8-4c5d-0e1f-2a3b4c5d6e7f'
  ),
  (
    'b8c9d0e1-f2a3-4b5c-5d6e-7f8a9b0c1d2e',
    'Bubble Rescue & Scaling',
    'Fix slow Bubble apps, broken workflows, database issues, privacy rules, API problems and messy architecture.',
    4,
    true,
    '2025-10-16 15:42:09.89208+00',
    '2025-10-16 15:42:09.89208+00',
    '953b4952-6713-47e3-a84a-2d2cbb569ca6'
  )
on conflict (id) do update
set
  title = excluded.title,
  description = excluded.description,
  order_index = excluded.order_index,
  published = excluded.published,
  created_at = excluded.created_at,
  updated_at = excluded.updated_at,
  icon_id = excluded.icon_id;

-- Update public landing services so frontend content is sourced from Supabase
-- and matches the current Bubble/AI positioning.

UPDATE services
SET
  title = 'Bubble SaaS & Platform Development',
  description = 'Production-ready SaaS apps, marketplaces, dashboards, admin panels, client portals and CRM-style platforms built in Bubble.',
  updated_at = now()
WHERE order_index = 1;

UPDATE services
SET
  title = 'AI Features & Workflow Automation',
  description = 'OpenAI/Claude-powered workflows, assistants, document processing, content systems, smart imports, reports and automation logic.',
  updated_at = now()
WHERE order_index = 2;

UPDATE services
SET
  title = 'Custom Backend & API Integrations',
  description = 'Vercel/serverless endpoints, webhooks, custom APIs, file processing, Stripe/Paddle, OAuth, background jobs and external service integrations.',
  updated_at = now()
WHERE order_index = 3;

UPDATE services
SET
  title = 'Bubble Rescue & Scaling',
  description = 'Fix slow Bubble apps, broken workflows, database issues, privacy rules, API problems and messy architecture.',
  updated_at = now()
WHERE order_index = 4;

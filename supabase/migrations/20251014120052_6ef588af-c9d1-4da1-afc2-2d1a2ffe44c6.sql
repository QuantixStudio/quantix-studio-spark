-- Update existing service descriptions
UPDATE services 
SET description = 'Full-stack web and mobile apps built using React, React Native, and no-code tools like Bubble — delivering beautiful, fast, and scalable products.'
WHERE title = 'Web & Mobile Apps';

UPDATE services 
SET description = 'Streamline operations with smart automations built on n8n, Supabase, and custom AI workflows — saving time and eliminating manual work.'
WHERE title = 'Business Automation';

UPDATE services 
SET description = 'We integrate GPT-powered chatbots, auto-documentation, and intelligent workflows into real business processes using cutting-edge AI models.'
WHERE title = 'AI Integration';

UPDATE services 
SET description = 'Scalable serverless backend using Supabase with secure authentication, edge functions, and real-time capabilities.'
WHERE title = 'Cloud Infrastructure';

-- Add new Integration-as-a-Service service
INSERT INTO services (title, description, order_index, published)
VALUES (
  'Integration-as-a-Service',
  'We connect tools like Notion, Airtable, Slack, and CRM systems into a unified digital workflow — with automations tailored to your business needs.',
  5,
  true
);
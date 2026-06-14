-- Create how_we_work table for the landing process cards.
-- This keeps the "How We Work" section content in Supabase instead of hardcoded frontend data.

CREATE TABLE IF NOT EXISTS public.how_we_work (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  subtitle TEXT,
  description TEXT NOT NULL,
  icon_name TEXT NOT NULL,
  order_index INTEGER NOT NULL DEFAULT 0,
  published BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.how_we_work ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'how_we_work'
      AND policyname = 'Anyone can view published how_we_work rows'
  ) THEN
    CREATE POLICY "Anyone can view published how_we_work rows"
      ON public.how_we_work FOR SELECT
      USING (published = true);
  END IF;

  IF NOT EXISTS (
    SELECT 1
    FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'how_we_work'
      AND policyname = 'Admins can manage how_we_work'
  ) THEN
    CREATE POLICY "Admins can manage how_we_work"
      ON public.how_we_work FOR ALL
      TO authenticated
      USING (public.has_role(auth.uid(), 'admin'::app_role));
  END IF;
END $$;

INSERT INTO public.how_we_work (
  id,
  title,
  subtitle,
  description,
  icon_name,
  order_index,
  published
)
VALUES
  (
    '0d8d4d61-7965-4adf-bba2-15b406796001',
    'Discovery & Planning',
    'Research & Scope',
    'We start by understanding your goals, target users, and project scope - setting a solid foundation for success.',
    'Search',
    1,
    true
  ),
  (
    '0d8d4d61-7965-4adf-bba2-15b406796002',
    'Design & Prototype',
    'Figma UI/UX',
    'We create intuitive, beautiful interfaces and interactive prototypes to visualize your product before development.',
    'Palette',
    2,
    true
  ),
  (
    '0d8d4d61-7965-4adf-bba2-15b406796003',
    'Build & Automate',
    'No-code Stack (Bubble, n8n, OpenAI)',
    'We build fast, scalable products using no-code tools and automate workflows with AI.',
    'Workflow',
    3,
    true
  ),
  (
    '0d8d4d61-7965-4adf-bba2-15b406796004',
    'Launch & Scale',
    'Fast iteration & analytics',
    'We launch, test, and refine - ensuring stability, performance, and long-term scalability.',
    'Rocket',
    4,
    true
  )
ON CONFLICT (id) DO UPDATE
SET
  title = EXCLUDED.title,
  subtitle = EXCLUDED.subtitle,
  description = EXCLUDED.description,
  icon_name = EXCLUDED.icon_name,
  order_index = EXCLUDED.order_index,
  published = EXCLUDED.published,
  updated_at = now();

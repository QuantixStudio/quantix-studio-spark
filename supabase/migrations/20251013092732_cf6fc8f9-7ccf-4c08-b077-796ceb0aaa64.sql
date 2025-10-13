-- Create services table
CREATE TABLE public.services (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  icon_url TEXT,
  icon_name TEXT,
  order_index INTEGER DEFAULT 0,
  published BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view published services"
  ON public.services FOR SELECT
  USING (published = true);

CREATE POLICY "Admins can manage services"
  ON public.services FOR ALL
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'::app_role));

-- Create projects table
CREATE TABLE public.projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  short_description TEXT NOT NULL,
  full_description TEXT,
  cover_url TEXT,
  category TEXT,
  technologies JSONB DEFAULT '[]'::jsonb,
  demo_url TEXT,
  github_url TEXT,
  order_index INTEGER DEFAULT 0,
  published BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view published projects"
  ON public.projects FOR SELECT
  USING (published = true);

CREATE POLICY "Admins can manage projects"
  ON public.projects FOR ALL
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'::app_role));

-- Create testimonials table
CREATE TABLE public.testimonials (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  company TEXT,
  position TEXT,
  feedback TEXT NOT NULL,
  avatar_url TEXT,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  order_index INTEGER DEFAULT 0,
  published BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.testimonials ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view published testimonials"
  ON public.testimonials FOR SELECT
  USING (published = true);

CREATE POLICY "Admins can manage testimonials"
  ON public.testimonials FOR ALL
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'::app_role));

-- Create inquiries table
CREATE TABLE public.inquiries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  message TEXT NOT NULL,
  status TEXT DEFAULT 'new' CHECK (status IN ('new', 'in_progress', 'completed')),
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.inquiries ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can submit inquiries"
  ON public.inquiries FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Admins can view all inquiries"
  ON public.inquiries FOR SELECT
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can update inquiries"
  ON public.inquiries FOR UPDATE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'::app_role));

-- Create storage buckets
INSERT INTO storage.buckets (id, name, public)
VALUES ('portfolio', 'portfolio', true)
ON CONFLICT (id) DO NOTHING;

INSERT INTO storage.buckets (id, name, public)
VALUES ('service-icons', 'service-icons', true)
ON CONFLICT (id) DO NOTHING;

INSERT INTO storage.buckets (id, name, public)
VALUES ('avatars', 'avatars', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policies for portfolio bucket
CREATE POLICY "Anyone can view portfolio images"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'portfolio');

CREATE POLICY "Admins can upload portfolio images"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (
    bucket_id = 'portfolio' AND
    public.has_role(auth.uid(), 'admin'::app_role)
  );

CREATE POLICY "Admins can update portfolio images"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (
    bucket_id = 'portfolio' AND
    public.has_role(auth.uid(), 'admin'::app_role)
  );

CREATE POLICY "Admins can delete portfolio images"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (
    bucket_id = 'portfolio' AND
    public.has_role(auth.uid(), 'admin'::app_role)
  );

-- Storage policies for service-icons bucket
CREATE POLICY "Anyone can view service icons"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'service-icons');

CREATE POLICY "Admins can upload service icons"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (
    bucket_id = 'service-icons' AND
    public.has_role(auth.uid(), 'admin'::app_role)
  );

-- Storage policies for avatars bucket
CREATE POLICY "Anyone can view avatars"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'avatars');

CREATE POLICY "Admins can upload avatars"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (
    bucket_id = 'avatars' AND
    public.has_role(auth.uid(), 'admin'::app_role)
  );

-- Insert sample data
INSERT INTO public.services (title, description, icon_name, published, order_index) VALUES
  ('Web & Mobile Apps', 'Full-stack development with React, React Native, and modern frameworks for beautiful, performant applications.', 'Smartphone', true, 1),
  ('Business Automation', 'Streamline workflows with n8n, Supabase, and AI integrations to save time and reduce manual tasks.', 'Workflow', true, 2),
  ('AI Integration', 'Smart chatbots, document analysis, and intelligent automation powered by cutting-edge AI models.', 'Brain', true, 3),
  ('Cloud Infrastructure', 'Scalable serverless architecture on Supabase with edge functions and real-time capabilities.', 'Cloud', true, 4);

INSERT INTO public.projects (title, slug, short_description, full_description, category, technologies, published, order_index) VALUES
  (
    'E-Commerce Platform',
    'ecommerce-platform',
    'Modern shopping experience with AI-powered product recommendations and seamless checkout.',
    'A full-featured e-commerce platform built with React and Supabase. Features include real-time inventory management, AI-powered product recommendations, secure payment processing, and an intuitive admin dashboard for managing products, orders, and customers.',
    'Web App',
    '["React", "TypeScript", "Supabase", "Stripe", "Tailwind CSS"]'::jsonb,
    true,
    1
  ),
  (
    'Task Automation Hub',
    'task-automation-hub',
    'No-code workflow builder powered by n8n for connecting apps and automating business processes.',
    'An intelligent automation platform that connects your favorite apps and services. Built with n8n and Supabase, it allows users to create complex workflows without writing code. Features include visual workflow editor, pre-built templates, webhook support, and extensive API integrations.',
    'Automation',
    '["n8n", "Supabase", "Node.js", "PostgreSQL", "React"]'::jsonb,
    true,
    2
  ),
  (
    'AI Assistant Dashboard',
    'ai-assistant-dashboard',
    'Intelligent chatbot with document Q&A capabilities and natural language understanding.',
    'A powerful AI assistant platform that helps teams get instant answers from their documents and knowledge bases. Built with OpenAI GPT models and Supabase vector storage, it features semantic search, context-aware responses, multi-document analysis, and enterprise-grade security.',
    'AI',
    '["OpenAI", "Supabase", "Python", "React", "Vector DB"]'::jsonb,
    true,
    3
  );
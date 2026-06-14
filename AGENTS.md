# Quantix Studio Agent Guide

Last verified: 2026-06-01

## Project snapshot

Quantix Studio is a marketing site plus lightweight admin CMS built on React, Vite, and Supabase.

- Public experience: home page, portfolio listing, project detail, privacy page, auth page.
- Admin experience: dashboard, profile, settings, project management, tool management, testimonial management.
- Backend pattern: direct browser-to-Supabase access with RLS, plus one external n8n webhook for the contact form.

## Core stack

- React 18
- TypeScript
- Vite 5
- Tailwind CSS + shadcn/ui + Radix UI
- React Router 6
- TanStack React Query
- React Hook Form + Zod
- Supabase JS v2
- Framer Motion

Package manifests present:

- `package.json`
- `package-lock.json`
- `bun.lock`
- `bun.lockb`

In practice, local verification in this repo was done with `npm`.

## Local commands

- Install: `npm install`
- Dev: `npm run dev`
- Build: `npm run build`
- Lint: `npm run lint`

Important:

- `vite.config.ts` sets the dev server to host on `::` and port `8080`.
- `README.md` and `SETUP.md` still mention `5173`, so those docs are stale.

## Repo map

- `src/main.tsx`: app bootstrap
- `src/App.tsx`: route tree and global providers
- `src/pages`: top-level route screens
- `src/components/landing`: public marketing sections
- `src/components/admin`: admin CRUD modals and tables
- `src/components/ui`: shadcn/ui primitives
- `src/contexts/AuthContext.tsx`: Supabase auth/session state
- `src/hooks`: React Query data hooks for projects, tools, services, testimonials, roles
- `src/integrations/supabase/client.ts`: browser Supabase client
- `src/integrations/supabase/types.ts`: generated DB types, do not hand-edit
- `src/lib/testSupabase.ts`: browser console helper for connection and RLS checks
- `supabase/migrations`: authoritative local schema history
- `supabase/config.toml`: Supabase project ref config

## Route map

Public routes:

- `/`
- `/portfolio`
- `/portfolio/:slug`
- `/privacy`
- `/auth`

Protected routes:

- `/admin`
- `/aus` (hidden alias to admin dashboard)
- `/admin/projects`
- `/admin/tools`
- `/admin/testimonials`
- `/admin/profile`
- `/admin/settings`

Routing gotcha:

- `App.tsx` contains `Navigate to="/portfolio/:slug"` for `/project/:slug`. This is a static string redirect, not a param-aware redirect.

## Supabase setup

- Project ref: set per copy in `supabase/config.toml` and `.env`
- Local config: `supabase/config.toml`
- MCP server should be configured with the active Supabase project ref when needed.

Important implementation detail:

- `.env` and `.env.example` define `VITE_SUPABASE_*` values.
- `src/integrations/supabase/client.ts` reads Supabase URL and anon key from `import.meta.env`.
- Do not reintroduce hardcoded Supabase credentials in client-side code.

## Database model

Core auth and access tables:

- `profiles`: user profile record linked to `auth.users`; stores `full_name`, `email`, `avatar_url`, `bio`.
- `user_roles`: role assignment table; current enum is `admin | moderator | user`.
- `has_role(_user_id, _role)`: role-check function used by RLS.
- `is_admin()`: helper used by some storage policies.
- Signup triggers:
  - `handle_new_user()` creates profile rows.
  - `handle_new_user_role()` assigns default `user` role.

Core content tables used by the current frontend:

- `services`: service cards for the landing page.
- `how_we_work`: process cards for the landing page "How We Work" section; remote table currently stores `id`, `created_at`, `title`, `description`, `order`.
- `why_choose_us`: value-prop cards for the landing page "Why Choose Quantix Studio" section; stores `id`, `created_at`, `title`, `description`, `icon_name`, `order`.
- `service_icon`: lookup table for service icon metadata.
- `projects`: portfolio projects; includes `slug`, `short_description`, `full_description`, `cover_url`, `images`, `demo_url`, `github_url`, `published`, `show_on_home`, `order_index`, `category_id`.
- `project_category`: project category lookup.
- `project_technologies`: currently one row per project, with `tools text[]` storing tool IDs.
- `tools`: tool catalog with `slug`, `categories text[]`, `logo_path`, `website_url`, `is_featured`.
- `testimonials`: social proof content with avatar, company, role, rating, publish flag.

Operational and auxiliary tables present in generated types:

- `inquiries`: lead/contact submissions plus metadata like company, use case, budget, timeline, page path, UTM params.
- `inquiry_status`: lookup table for inquiry workflow states.
- `email_templates`
- `email_logs`
- `documents`
- `long_chat_history`
- `n8n_chat_histories`
- `technologies`: legacy lookup table from an older project-to-technology model.

Schema gotchas:

- `project_technologies` has moved away from a normalized `technology_id` model to a single-row-per-project `tools[]` array model.
- A `projects_with_tools` view is created in migrations, but the frontend still performs manual multi-query joins instead of using that view.
- `src/integrations/supabase/types.ts` appears stale in at least two ways:
  - it does not expose the `projects_with_tools` view
  - its `tools_category` enum still contains `Data base`, while a newer migration validates `Database`

## RLS and security summary

- `profiles`: users can update their own profile; users can view their own profile; admins can view all profiles.
- `user_roles`: users can view their own roles; only admins can manage roles.
- `services`, `projects`, `testimonials`: public can read published rows; admins can manage all rows.
- `how_we_work`: public can read published rows; admins can manage all rows.
- `why_choose_us`: public read; admins can manage all rows.
- `inquiries`: public can insert; admins can view and update.
- `project_category`, `service_icon`, `technologies`, `project_technologies`, `inquiry_status`: readable publicly.
- Storage rules:
  - `avatars`: public read, authenticated users manage files inside their own folder
  - `portfolio`: public read, admin write/update/delete
  - `service-icons`: public read, admin write
  - `testimonials_avatars`: public read, admin write/update/delete

Storage gap to verify:

- Client code uses a `tools_logos` bucket.
- Local migrations in this repo do not currently show bucket creation or policies for `tools_logos`.
- Before touching tool logo uploads, verify that the remote Supabase project already has this bucket and correct policies, or add a migration for it.

## External integrations already in the app

- Supabase
- n8n webhook for contact form:
  - `https://n8n.ibs-logistics.store/webhook/fd5bb622-d19d-4052-97df-0b65fc2c1273`
- Calendly booking link:
  - `https://calendly.com/quantixstudio/30min`
- LinkedIn company page:
  - `https://www.linkedin.com/company/quantix-studio`
- Google Analytics tag:
  - `G-BM1YFPM5ZB`
- Facebook Pixel:
  - `1159661549124036`

Note:

- The current contact form does not insert into the `inquiries` table. It POSTs directly to the external n8n webhook.

## Current app behavior and product notes

- Public landing page is section-based and data-backed for services, featured projects, tools, and testimonials.
- Admin CRUD exists for projects, tools, and testimonials.
- Dashboard numbers are currently static placeholder values, not live analytics.
- Profile editing updates `profiles.full_name` and `profiles.email`.

## Working rules for future changes

- Prefer schema truth from `supabase/migrations` first, generated types second.
- If DB schema changes, update migrations and then regenerate `src/integrations/supabase/types.ts`.
- Do not store role data client-side; use `user_roles` and `has_role()`.
- Be careful with project-tool relations: current app expects one `project_technologies` row per project.
- If changing routes, remember there is a hidden admin alias at `/aus`.
- If changing Supabase client setup, decide whether to keep hardcoded credentials or move fully to `import.meta.env`; do not leave both patterns half-active.
- If changing contact flows, account for the fact that `inquiries` exists in DB but is not the live submission path right now.

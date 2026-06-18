# Quantix Studio Agent Guide

Last verified: 2026-06-14

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

Live schema note:

- The connected Supabase project was replaced and its live schema differs from the older repo-local migrations and generated docs.
- Treat `SUPABASE_LIVE_SCHEMA_AUDIT.md` as the current source of truth for the active remote project.

Important implementation detail:

- `.env` and `.env.example` define `VITE_SUPABASE_*` values.
- `src/integrations/supabase/client.ts` reads Supabase URL and anon key from `import.meta.env`.
- Do not reintroduce hardcoded Supabase credentials in client-side code.

## Database model

Core auth and access tables:

- `profiles`: user profile record linked to `auth.users`; stores `full_name`, `email`, `avatar_url`, `bio`, and active `role`.
- Active role enum is `public.app_role = admin | manager | client`.
- `is_admin()`: helper used by some policies.
- Signup triggers:
  - `on_auth_user_created` exists on `auth.users`
  - live `public` functions include `handle_new_user` and `handle_new_user_profile`

Core content tables used by the current frontend:

- `services`: service cards for the landing page.
- `how_we_work`: process cards for the landing page "How We Work" section; remote table currently stores `id`, `created_at`, `title`, `description`, `order`.
- `why_choose_us`: value-prop cards for the landing page "Why Choose Quantix Studio" section; stores `id`, `created_at`, `title`, `description`, `order`.
- `service_icon`: lookup table for service icon metadata.
- `projects`: portfolio projects; includes `slug`, `short_description`, `full_description`, `demo_url`, `github_url`, `published`, `show_on_home`, `order_index`, `category_id`, `client_id`, `status`, `cover_image_id`.
- `project_images`: project image records linked to `projects`.
- `project_files`: project file records linked to `projects`.
- `project_services`: normalized join table between projects and services.
- `project_category`: project category lookup.
- `project_technologies`: normalized join table between projects and `technologies` via `technology_id`.
- `project_tasks`: task records linked to projects and `task_status`.
- `project_status`: project status lookup.
- `task_status`: task status lookup.
- `tools`: tool catalog with `slug`, `logo_path`, `website_url`, `is_featured`.
- `technologies`: technology lookup table used by `project_technologies`.

Operational and auxiliary tables present in generated types:

- `clients`
- `client_status`
- `inquiries`: lead/contact submissions plus metadata like company, use case, budget, timeline, page path, UTM params.
- `inquiry_status`: lookup table for inquiry workflow states.
- `invoices`
- `invoice_status`
- `payments`
- `payment_status`
- `email_templates`
- `email_logs`
- `notes`
- `activity_log`
- `documents`
- `document_sources`

Schema gotchas:

- There is no live `user_roles` table in the connected project.
- There is no live `testimonials` table in the connected project.
- `project_technologies` is normalized and does not contain `tools text[]`.
- `tools` does not contain `categories`.
- `projects` does not contain `cover_url` or `images`; media is split into related tables.
- `why_choose_us` does not contain `icon_name`.
- Several project-related tables contain duplicate FK or unique constraints in the live schema.
- `src/integrations/supabase/types.ts` should be treated as stale until regenerated from the current project.

## RLS and security summary

- `profiles`: users can read and update their own profile; admins/managers can read all; admins have a broader full-access policy.
- `services`: public can read published rows; admins/managers can manage all rows.
- `projects`: public can read published rows; admins/managers can manage all rows.
- `how_we_work`: public can read all rows; admins/managers can manage all rows.
- `why_choose_us`: public can read all rows; admins/managers can manage all rows.
- `inquiries`: public can insert; admins can view and update.
- `project_category`, `service_icon`, `technologies`, `project_technologies`, `project_status`, `task_status`, `client_status`, `inquiry_status`, `invoice_status`, `payment_status`, `tools`: readable publicly.
- `documents` and `document_sources`: blocked from frontend access by deny-all policies.
- Storage rules:
  - current live audit only confirmed one public bucket: `Project_images`

Storage gap to verify:

- Client code and older docs reference buckets such as `tools_logos`, `avatars`, `portfolio`, and `service-icons`.
- The current live storage snapshot did not expose those buckets.
- Before touching uploads, verify the live bucket strategy and reconcile frontend code with the current project.

## External integrations already in the app

- Supabase
- The live DB now contains an `AFTER INSERT` trigger on `public.inquiries` that forwards submissions to an external webhook.
- Calendly booking link:
  - `https://calendly.com/quantixstudio/30min`
- LinkedIn company page:
  - `https://www.linkedin.com/company/quantix-studio`
- Google Analytics tag:
  - `G-BM1YFPM5ZB`
- Facebook Pixel:
  - `1159661549124036`

Note:

- The current live project supports a DB-driven inquiry flow through `public.inquiries` plus a webhook trigger.
- Verify the frontend flow before assuming it still posts directly to the old webhook endpoint.

## Current app behavior and product notes

- Public landing page is section-based and data-backed for services, featured projects, tools, and other marketing sections.
- Any testimonial-related frontend behavior should be treated as schema-mismatch work until the app or DB is reconciled.
- Admin CRUD definitely maps to projects and tools in the live schema.
- In the admin `Projects` section, list/table display should read from live normalized sources: `projects.created_at`, `project_category.name`, `project_status.label`, and `project_images` / `cover_image_id`. Do not reintroduce reads from deprecated `projects.cover_url` or `projects.images` fields that still exist in stale generated types.
- Dashboard numbers are currently static placeholder values, not live analytics.
- Profile editing updates `profiles.full_name` and `profiles.email`.

## Working rules for future changes

- Prefer schema truth from `SUPABASE_LIVE_SCHEMA_AUDIT.md` and live MCP introspection for the currently connected project.
- If DB schema changes, update migrations and then regenerate `src/integrations/supabase/types.ts`.
- Do not store role data client-side; the live project currently resolves access from `profiles.role`.
- Be careful with project-technology relations: the live DB uses normalized `project_technologies` rows with `technology_id`.
- If changing routes, remember there is a hidden admin alias at `/aus`.
- If changing Supabase client setup, decide whether to keep hardcoded credentials or move fully to `import.meta.env`; do not leave both patterns half-active.
- If changing contact flows, account for the live `inquiries` trigger and avoid duplicating webhook delivery paths accidentally.

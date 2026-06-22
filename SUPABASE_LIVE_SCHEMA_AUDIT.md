# Supabase Live Schema Audit

Last verified: 2026-06-14
Project ref: `whsjpjnvhnqhubvuqymg`

## Scope

This document records the current live Supabase schema connected to this repo.

It is based on direct MCP introspection of the active remote project, not on
`supabase/migrations/` or generated local types.

## Repo Update Note (2026-06-22)

- The application code has been migrated away from `public.tools`.
- The homepage stack carousel, project build-stack displays, and admin stack management now read from `public.technologies`.
- Technology logos are now stored on `technologies.logo_path` and resolved from the `tools_logos` storage bucket.
- A local removal migration has been added at `supabase/migrations/20260622183000_drop_legacy_tools_table.sql`.
- This document still reflects the last direct remote audit from 2026-06-14. Treat the `tools` table section below as legacy remote state until that migration is applied to the live project.

## Executive Summary

- The connected Supabase project no longer matches the older repo-local schema docs.
- The app now uses `public.profiles.role` with enum `app_role` (`admin`, `manager`, `client`) as the active access model.
- The older `user_roles`, `testimonials`, `long_chat_history`, and `n8n_chat_histories` tables are not present in the current live `public` schema.
- `projects` now relies on related `project_images`, `project_files`, `project_services`, and `project_technologies` tables instead of the older denormalized media and tools shape.
- `project_technologies` is normalized as `(project_id, technology_id)`, not `tools text[]`.
- `why_choose_us` no longer has an `icon_name` column.
- Remote migration history is currently empty from MCP introspection.
- The only visible storage bucket is `Project_images`; this does not match several bucket names referenced in older project docs.

## Schemas Observed

- `public`
- `auth`
- `storage`
- `extensions`
- `vault`

The rest of this audit focuses on the application-facing objects in `public`,
plus the key `auth` and `storage` touchpoints used by the app.

## Public Schema Inventory

### Identity and Access

#### `profiles`

Purpose:
- user profile record linked to `auth.users`
- stores the active application role

Columns:
- `id uuid` - primary key, FK to `auth.users.id`
- `email text`
- `full_name text`
- `avatar_url text`
- `bio text`
- `role app_role not null default 'client'`
- `created_at timestamptz default now()`
- `updated_at timestamptz default now()`

Row count:
- `1`

Notes:
- This replaces the older documented `user_roles`-based model in practice.

### Marketing and Public Content

#### `services`

Columns:
- `id uuid` - PK, default `gen_random_uuid()`
- `title text`
- `description text`
- `order_index integer`
- `published boolean default false`
- `created_at timestamptz default now()`
- `icon_id uuid` - FK to `service_icon.id`
- `updated_at timestamptz default now()`

Row count:
- `9`

#### `service_icon`

Columns:
- `id uuid` - PK, default `gen_random_uuid()`
- `name text`
- `icon_url text`

Row count:
- `7`

#### `how_we_work`

Columns:
- `id uuid` - PK, default `gen_random_uuid()`
- `created_at timestamptz not null default now()`
- `title text`
- `description text`
- `"order" integer`

Constraints:
- unique on `"order"`

Row count:
- `4`

#### `why_choose_us`

Columns:
- `id uuid` - PK, default `gen_random_uuid()`
- `created_at timestamptz not null default now()`
- `title text`
- `description text`
- `"order" integer`

Row count:
- `4`

Notes:
- No `icon_name` column exists in the live schema.

#### `tools`

Columns:
- `id uuid` - PK
- `name text`
- `slug text` - unique
- `description text`
- `website_url text`
- `logo_path text`
- `is_featured boolean default false`
- `created_at timestamptz default now()`
- `updated_at timestamptz default now()`

Row count:
- `18`

Notes:
- No `categories text[]` column exists in the live schema.

#### `technologies`

Columns:
- `id uuid` - PK, default `gen_random_uuid()`
- `name text` - unique
- `description text`
- `slug text` - unique
- `created_at timestamptz default now()`

Row count:
- `19`

#### `project_category`

Columns:
- `id uuid` - PK, default `gen_random_uuid()`
- `name text`
- `description text`
- `order_index integer`

Row count:
- `18`

### Portfolio and Delivery

#### `projects`

Columns:
- `id uuid` - PK, default `gen_random_uuid()`
- `title text`
- `slug text` - unique
- `short_description text`
- `full_description text`
- `demo_url text`
- `github_url text`
- `key_metric text`
- `order_index integer`
- `published boolean default false`
- `show_on_home boolean default false`
- `created_at timestamptz default now()`
- `updated_at timestamptz default now()`
- `client_id uuid` - FK to `clients.id`
- `category_id uuid` - FK to `project_category.id`
- `status text` - FK to `project_status.id`
- `cover_image_id uuid` - FK to `project_images.id`

Row count:
- `5`

Notes:
- The live schema no longer stores `cover_url` or `images` on `projects`.

#### `project_images`

Columns:
- `id uuid` - PK, default `gen_random_uuid()`
- `project_id uuid` - FK to `projects.id`
- `file_path text`
- `public_url text`
- `alt text`
- `order_index integer default 0`
- `is_main boolean default false`
- `created_at timestamptz default now()`

Row count:
- `11`

Notes:
- `project_id` currently has duplicate foreign key constraints pointing to `projects.id`.

#### `project_files`

Columns:
- `id uuid` - PK, default `gen_random_uuid()`
- `project_id uuid` - FK to `projects.id`
- `file_url text`
- `file_type text`
- `order_index integer`
- `created_at timestamptz default now()`

Row count:
- `0`

#### `project_services`

Columns:
- `id uuid` - PK, default `gen_random_uuid()`
- `project_id uuid` - FK to `projects.id`
- `service_id uuid` - FK to `services.id`

Constraints:
- duplicate unique constraints on `(project_id, service_id)`

Row count:
- `0`

#### `project_technologies`

Columns:
- `id uuid` - PK, default `gen_random_uuid()`
- `project_id uuid` - FK to `projects.id`
- `technology_id uuid` - FK to `technologies.id`

Constraints:
- duplicate unique constraints on `(project_id, technology_id)`

Row count:
- `4`

Notes:
- This is a normalized join table in the live schema.
- It does not contain a `tools text[]` array.

#### `project_tasks`

Columns:
- `id uuid` - PK, default `gen_random_uuid()`
- `project_id uuid` - FK to `projects.id`
- `title text`
- `description text`
- `due_date date`
- `created_at timestamptz default now()`
- `status text` - FK to `task_status.id`

Row count:
- `0`

Notes:
- `project_id` and `status` each currently have duplicate foreign key constraints.

#### `project_status`

Columns:
- `id text` - PK
- `label text`
- `color text`
- `order_index integer`

Row count:
- `6`

#### `task_status`

Columns:
- `id text` - PK, also unique
- `label text` - unique
- `order_index integer`
- `color text`

Row count:
- `4`

### CRM, Inquiries, Billing, and Operations

#### `clients`

Columns:
- `id uuid` - PK, default `gen_random_uuid()`
- `name text`
- `email text`
- `company text`
- `phone text`
- `notes text`
- `created_at timestamptz default now()`
- `status text` - FK to `client_status.id`

Row count:
- `0`

#### `client_status`

Columns:
- `id text` - PK
- `label text`
- `order_index integer`

Row count:
- `4`

#### `inquiries`

Columns:
- `id uuid` - PK, default `gen_random_uuid()`
- `name text`
- `email text`
- `message text`
- `company text`
- `phone text`
- `use_case text`
- `timeline text`
- `budget_range text`
- `utm_params jsonb`
- `page_path text`
- `created_at timestamptz default now()`
- `status text` - FK to `inquiry_status.id`
- `client_id uuid` - FK to `clients.id`

Row count:
- `2`

Notes:
- An `AFTER INSERT` trigger posts inquiry payloads to an external webhook through `supabase_functions.http_request(...)`.

#### `inquiry_status`

Columns:
- `id text` - PK
- `label text`
- `color text`
- `order_index integer`

Row count:
- `7`

#### `invoices`

Columns:
- `id uuid` - PK, default `gen_random_uuid()`
- `project_id uuid` - FK to `projects.id`
- `amount numeric`
- `currency text default 'USD'`
- `issued_at timestamptz default now()`
- `due_date date`
- `created_at timestamptz default now()`
- `status text` - FK to `invoice_status.id`

Row count:
- `0`

#### `invoice_status`

Columns:
- `id text` - PK
- `label text`
- `order_index integer`
- `color text`

Row count:
- `5`

#### `payments`

Columns:
- `id uuid` - PK, default `gen_random_uuid()`
- `invoice_id uuid` - FK to `invoices.id`
- `amount numeric`
- `currency text default 'USD'`
- `paid_at timestamptz`
- `created_at timestamptz default now()`
- `status text` - FK to `payment_status.id`

Row count:
- `0`

#### `payment_status`

Columns:
- `id text` - PK
- `label text`
- `order_index integer`
- `color text`

Row count:
- `4`

#### `notes`

Columns:
- `id uuid` - PK, default `gen_random_uuid()`
- `entity_type text`
- `entity_id uuid`
- `content text`
- `created_at timestamptz default now()`

Row count:
- `0`

#### `activity_log`

Columns:
- `id uuid` - PK, default `gen_random_uuid()`
- `entity_type text`
- `entity_id uuid`
- `action text`
- `metadata jsonb`
- `created_at timestamptz default now()`

Row count:
- `0`

#### `email_templates`

Columns:
- `id uuid` - PK, default `gen_random_uuid()`
- `name text`
- `subject text`
- `html_content text`
- `created_at timestamptz default now()`
- `updated_at timestamptz default now()`

Row count:
- `0`

#### `email_logs`

Columns:
- `id uuid` - PK, default `gen_random_uuid()`
- `resend_id text`
- `to_email text`
- `subject text`
- `html text`
- `sent_at timestamptz`
- `status text`
- `template_id uuid` - FK to `email_templates.id`
- `project_id uuid` - FK to `projects.id`
- `client_id uuid` - FK to `clients.id`

Row count:
- `0`

### Documents and Vector Search

#### `document_sources`

Columns:
- `id uuid` - PK, default `gen_random_uuid()`
- `name text`
- `source_type text`
- `reference text`
- `project_id uuid` - FK to `projects.id`
- `created_at timestamptz default now()`

Row count:
- `0`

#### `documents`

Columns:
- `id bigint` - PK, identity
- `content text`
- `metadata jsonb`
- `embedding vector`
- `source_id uuid` - FK to `document_sources.id`
- `project_id uuid` - FK to `projects.id`
- `created_at timestamptz default now()`

Row count:
- `0`

Notes:
- `vector` extension is installed in `public`.

## Key Relationships

### Auth

- `auth.users.id -> public.profiles.id`
- `auth.users` has an `AFTER INSERT` trigger named `on_auth_user_created`

### Public Content and Catalog

- `services.icon_id -> service_icon.id`
- `projects.category_id -> project_category.id`
- `projects.status -> project_status.id`
- `projects.cover_image_id -> project_images.id`
- `project_images.project_id -> projects.id`
- `project_files.project_id -> projects.id`
- `project_services.project_id -> projects.id`
- `project_services.service_id -> services.id`
- `project_technologies.project_id -> projects.id`
- `project_technologies.technology_id -> technologies.id`
- `project_tasks.project_id -> projects.id`
- `project_tasks.status -> task_status.id`

### CRM and Billing

- `clients.status -> client_status.id`
- `inquiries.status -> inquiry_status.id`
- `inquiries.client_id -> clients.id`
- `invoices.project_id -> projects.id`
- `invoices.status -> invoice_status.id`
- `payments.invoice_id -> invoices.id`
- `payments.status -> payment_status.id`
- `email_logs.template_id -> email_templates.id`
- `email_logs.project_id -> projects.id`
- `email_logs.client_id -> clients.id`

### Documents

- `document_sources.project_id -> projects.id`
- `documents.source_id -> document_sources.id`
- `documents.project_id -> projects.id`

## RLS Snapshot

All observed `public` tables have RLS enabled.

### Publicly readable tables

- `client_status`
- `how_we_work`
- `inquiry_status`
- `invoice_status`
- `payment_status`
- `project_category`
- `project_files`
- `project_images`
- `project_status`
- `project_technologies`
- `projects` with `published = true`
- `service_icon`
- `services` with `published = true`
- `task_status`
- `technologies`
- `tools`
- `why_choose_us`

### Public insert surface

- `inquiries` allows public insert

### Admin/manager managed tables

Most operational tables are protected by policies that check
`profiles.role in ('admin', 'manager')`.

This includes:

- `activity_log`
- `client_status`
- `clients`
- `email_logs`
- `email_templates`
- `how_we_work`
- `inquiries`
- `inquiry_status`
- `invoice_status`
- `invoices`
- `notes`
- `payment_status`
- `payments`
- `project_category`
- `project_files`
- `project_images`
- `project_services`
- `project_status`
- `project_tasks`
- `project_technologies`
- `projects`
- `service_icon`
- `services`
- `task_status`
- `technologies`
- `tools`
- `why_choose_us`

### Tables blocked from frontend access

- `documents`
- `document_sources`

Both currently use `false` policies for all commands.

## Enums

### `public.app_role`

Values:
- `admin`
- `manager`
- `client`

## Storage Snapshot

Observed bucket:

- `Project_images` - public bucket

Notes:
- Older docs mention buckets such as `avatars`, `portfolio`, `service-icons`,
  `testimonials_avatars`, and `tools_logos`.
- Those buckets were not visible in the current live storage snapshot.

## Views, Functions, and Triggers

### Views

- No `public` views were returned by live introspection.

### App-specific functions observed in `public`

- `handle_new_user`
- `handle_new_user_profile`
- `is_admin`

### Triggers

- `auth.users`: `on_auth_user_created` (`AFTER INSERT`)
- `public.inquiries`: `inquiries_insert_to_n8n` (`AFTER INSERT`)

## Divergences From Older Repo Documentation

- `user_roles` is not present in the live schema.
- `testimonials` is not present in the live schema.
- `projects_with_tools` view is not present in the live schema.
- `project_technologies` is normalized; it is not a single row with `tools[]`.
- `tools.categories` does not exist.
- `why_choose_us.icon_name` does not exist.
- `projects.cover_url` and `projects.images` do not exist.
- `profiles.role` is active in the live schema and should be treated as schema truth for authorization.
- The contact flow can now be database-driven through `inquiries` plus the webhook trigger.
- Remote migration history was empty during this audit, so repo-local migrations are not a reliable description of the connected project.

## Risks and Follow-up Recommendations

1. Regenerate `src/integrations/supabase/types.ts` from the current project before shipping schema-dependent frontend work.
2. Audit the app for references to removed tables and columns:
   `user_roles`, `testimonials`, `tools.categories`, `why_choose_us.icon_name`,
   `projects.cover_url`, `projects.images`, `project_technologies.tools`.
3. Reconcile storage usage in the frontend with the live bucket list. The app and docs still reference buckets not seen in the current project.
4. Decide whether duplicate FKs and duplicate unique constraints on project join tables should be cleaned up in the database.
5. Export or recreate migration history for the new Supabase project so the repo can become authoritative again.

# New Supabase Project Setup

This copy is prepared to connect to a different Supabase project through environment variables.

Important:

- The currently connected live project no longer matches the older local migration history in this repo.
- Before using `supabase db push`, compare the target project with [SUPABASE_LIVE_SCHEMA_AUDIT.md](SUPABASE_LIVE_SCHEMA_AUDIT.md).
- Do not assume `supabase/migrations/` is safe to apply unchanged to the new live project.

## 1. Create or choose a Supabase project

Open the Supabase dashboard, create a new project, then copy:

- Project URL
- anon/public publishable key
- project reference

## 2. Configure local env

```bash
cp .env.local.example .env
```

Fill in:

```bash
VITE_SUPABASE_PROJECT_ID=your_new_project_ref
VITE_SUPABASE_URL=https://your-new-project-ref.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=your_new_anon_publishable_key
```

## 3. Link and verify schema

```bash
supabase link --project-ref your_new_project_ref
```

Then verify:

- `VITE_SUPABASE_URL` and publishable key point to the intended project
- the live schema matches the app requirements
- storage buckets required by the frontend actually exist

Only run `supabase db push` after reconciling repo migrations with the target
project.

## 4. Verify required storage buckets

The current live project audit only found one public bucket:

- `Project_images`

If the frontend still expects buckets such as `avatars`, `portfolio`,
`service-icons`, `testimonials_avatars`, or `tools_logos`, create or migrate
them deliberately instead of assuming they already exist.

## 5. Create an admin user

Sign up through the app, then assign the admin role in SQL:

```sql
UPDATE public.profiles
SET role = 'admin'::public.app_role
WHERE id = '<auth-user-id>';
```

## 6. Run locally

```bash
npm install
npm run dev
```

The app runs on `http://localhost:8080`.

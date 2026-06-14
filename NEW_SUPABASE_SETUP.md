# New Supabase Project Setup

This copy is prepared to connect to a different Supabase project through environment variables.

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

## 3. Link and migrate

```bash
supabase link --project-ref your_new_project_ref
supabase db push
```

If you are not using the Supabase CLI, apply every file in `supabase/migrations/` in timestamp order.

## 4. Verify required storage buckets

The migrations create these public buckets:

- `avatars`
- `portfolio`
- `service-icons`
- `testimonials_avatars`
- `tools_logos`

## 5. Create an admin user

Sign up through the app, then assign the admin role in SQL:

```sql
INSERT INTO public.user_roles (user_id, role)
VALUES ('<auth-user-id>', 'admin'::public.app_role)
ON CONFLICT DO NOTHING;
```

## 6. Run locally

```bash
npm install
npm run dev
```

The app runs on `http://localhost:8080`.

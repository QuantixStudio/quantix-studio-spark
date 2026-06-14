create table if not exists public.testimonials (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  company text,
  position text,
  feedback text not null,
  avatar_url text,
  rating integer check (rating between 1 and 5),
  order_index integer default 0,
  published boolean default false,
  created_at timestamptz default now()
);

alter table public.testimonials enable row level security;

drop policy if exists "Anyone can view published testimonials" on public.testimonials;
drop policy if exists "Admins can manage testimonials" on public.testimonials;
drop policy if exists "public_read_testimonials" on public.testimonials;
drop policy if exists "admin_manage_testimonials" on public.testimonials;

create policy "public_read_testimonials"
on public.testimonials
for select
to public
using (published = true);

create policy "admin_manage_testimonials"
on public.testimonials
for all
to authenticated
using (
  public.has_any_role(
    (select auth.uid()),
    array['admin'::public.app_role, 'manager'::public.app_role]
  )
)
with check (
  public.has_any_role(
    (select auth.uid()),
    array['admin'::public.app_role, 'manager'::public.app_role]
  )
);

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'testimonials_avatars',
  'testimonials_avatars',
  true,
  2097152,
  array['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
)
on conflict (id) do update
set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "Public read access for testimonial avatars" on storage.objects;
drop policy if exists "Admins can upload testimonial avatars" on storage.objects;
drop policy if exists "Admins can update testimonial avatars" on storage.objects;
drop policy if exists "Admins can delete testimonial avatars" on storage.objects;
drop policy if exists "testimonial_avatars_public_read" on storage.objects;
drop policy if exists "testimonial_avatars_admin_insert" on storage.objects;
drop policy if exists "testimonial_avatars_admin_update" on storage.objects;
drop policy if exists "testimonial_avatars_admin_delete" on storage.objects;

create policy "testimonial_avatars_public_read"
on storage.objects
for select
to public
using (bucket_id = 'testimonials_avatars');

create policy "testimonial_avatars_admin_insert"
on storage.objects
for insert
to authenticated
with check (
  bucket_id = 'testimonials_avatars'
  and (storage.foldername(name))[1] = 'testimonials'
  and public.has_any_role(
    (select auth.uid()),
    array['admin'::public.app_role, 'manager'::public.app_role]
  )
);

create policy "testimonial_avatars_admin_update"
on storage.objects
for update
to authenticated
using (
  bucket_id = 'testimonials_avatars'
  and public.has_any_role(
    (select auth.uid()),
    array['admin'::public.app_role, 'manager'::public.app_role]
  )
)
with check (
  bucket_id = 'testimonials_avatars'
  and public.has_any_role(
    (select auth.uid()),
    array['admin'::public.app_role, 'manager'::public.app_role]
  )
);

create policy "testimonial_avatars_admin_delete"
on storage.objects
for delete
to authenticated
using (
  bucket_id = 'testimonials_avatars'
  and public.has_any_role(
    (select auth.uid()),
    array['admin'::public.app_role, 'manager'::public.app_role]
  )
);

-- =====================================================================
-- Mentoring Future Nexus - Skema Supabase (PostgreSQL)
-- Jalankan seluruh file ini di Supabase Dashboard -> SQL Editor.
-- Aman dijalankan ulang (idempotent) untuk tabel/policy yang sama.
-- =====================================================================

-- ---------------------------------------------------------------------
-- 1. TABEL
-- ---------------------------------------------------------------------

create table if not exists public.profiles (
  id          uuid primary key references auth.users (id) on delete cascade,
  full_name   text,
  avatar_url  text,
  school      text,
  grade       text,
  interest    text,
  bio         text,
  role        text not null default 'participant' check (role in ('participant', 'admin')),
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

create table if not exists public.mentors (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  photo_url   text,
  campus      text not null,
  major       text not null,
  batch_year  int,
  expertise   text[] not null default '{}',
  bio         text,
  created_at  timestamptz not null default now()
);

create table if not exists public.programs (
  id          uuid primary key default gen_random_uuid(),
  title       text not null,
  description text not null,
  category    text not null,
  mentor_id   uuid references public.mentors (id) on delete set null,
  schedule    text,
  is_active   boolean not null default true,
  created_at  timestamptz not null default now()
);

create table if not exists public.sessions (
  id           uuid primary key default gen_random_uuid(),
  program_id   uuid references public.programs (id) on delete set null,
  mentor_id    uuid references public.mentors (id) on delete set null,
  title        text not null,
  topic        text not null,
  session_date date not null,
  start_time   time not null,
  end_time     time not null,
  location     text,
  capacity     int check (capacity is null or capacity > 0),
  status       text not null default 'upcoming'
               check (status in ('upcoming', 'ongoing', 'completed', 'cancelled')),
  created_at   timestamptz not null default now()
);

create table if not exists public.registrations (
  id          uuid primary key default gen_random_uuid(),
  session_id  uuid not null references public.sessions (id) on delete cascade,
  user_id     uuid not null references public.profiles (id) on delete cascade,
  status      text not null default 'registered'
              check (status in ('registered', 'cancelled', 'attended')),
  created_at  timestamptz not null default now(),
  unique (session_id, user_id)
);

create table if not exists public.announcements (
  id            uuid primary key default gen_random_uuid(),
  title         text not null,
  content       text not null,
  is_published  boolean not null default true,
  created_at    timestamptz not null default now()
);

create table if not exists public.documentation (
  id           uuid primary key default gen_random_uuid(),
  title        text not null,
  description  text,
  image_url    text,
  session_id   uuid references public.sessions (id) on delete set null,
  created_at   timestamptz not null default now()
);

create index if not exists sessions_date_idx on public.sessions (session_date);
create index if not exists registrations_user_idx on public.registrations (user_id);
create index if not exists registrations_session_idx on public.registrations (session_id);

-- ---------------------------------------------------------------------
-- 2. FUNGSI & TRIGGER
-- ---------------------------------------------------------------------

-- Cek apakah user yang sedang login adalah admin.
-- security definer agar tidak memicu rekursi RLS pada tabel profiles.
create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'admin'
  );
$$;

-- Buat baris profil otomatis saat user mendaftar lewat Supabase Auth.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, full_name)
  values (new.id, coalesce(new.raw_user_meta_data ->> 'full_name', ''))
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Perbarui updated_at otomatis.
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists profiles_set_updated_at on public.profiles;
create trigger profiles_set_updated_at
  before update on public.profiles
  for each row execute function public.set_updated_at();

-- Cegah peserta mengubah role-nya sendiri (privilege escalation).
-- auth.uid() bernilai null jika dijalankan dari SQL Editor / service role.
create or replace function public.prevent_role_change()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if new.role is distinct from old.role
     and auth.uid() is not null
     and not public.is_admin() then
    raise exception 'Hanya admin yang dapat mengubah role.';
  end if;
  return new;
end;
$$;

drop trigger if exists profiles_prevent_role_change on public.profiles;
create trigger profiles_prevent_role_change
  before update on public.profiles
  for each row execute function public.prevent_role_change();

-- Validasi pendaftaran: sesi harus 'upcoming' dan belum penuh.
create or replace function public.check_registration()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  s record;
  taken int;
begin
  if tg_op = 'UPDATE' and old.status = 'attended' and not public.is_admin() then
    raise exception 'Status kehadiran hanya dapat diubah oleh admin.';
  end if;

  if new.status = 'registered' and (tg_op = 'INSERT' or old.status is distinct from 'registered') then
    select status, capacity into s from public.sessions where id = new.session_id;
    if not found then
      raise exception 'Sesi tidak ditemukan.';
    end if;
    if s.status <> 'upcoming' then
      raise exception 'Pendaftaran sudah ditutup untuk sesi ini.';
    end if;
    if s.capacity is not null then
      select count(*) into taken
      from public.registrations
      where session_id = new.session_id
        and status <> 'cancelled'
        and id <> new.id;
      if taken >= s.capacity then
        raise exception 'Kuota sesi sudah penuh.';
      end if;
    end if;
  end if;
  return new;
end;
$$;

drop trigger if exists registrations_check on public.registrations;
create trigger registrations_check
  before insert or update on public.registrations
  for each row execute function public.check_registration();

-- Jumlah pendaftar per sesi dapat dilihat publik (tanpa data pribadi).
create or replace view public.session_stats
with (security_invoker = false) as
  select session_id, count(*) filter (where status <> 'cancelled')::int as registered_count
  from public.registrations
  group by session_id;

grant select on public.session_stats to anon, authenticated;

-- ---------------------------------------------------------------------
-- 3. ROW LEVEL SECURITY
-- ---------------------------------------------------------------------

alter table public.profiles       enable row level security;
alter table public.mentors        enable row level security;
alter table public.programs       enable row level security;
alter table public.sessions       enable row level security;
alter table public.registrations  enable row level security;
alter table public.announcements  enable row level security;
alter table public.documentation  enable row level security;

-- profiles
drop policy if exists "profiles_select_own_or_admin" on public.profiles;
create policy "profiles_select_own_or_admin" on public.profiles
  for select to authenticated
  using (id = auth.uid() or public.is_admin());

drop policy if exists "profiles_update_own" on public.profiles;
create policy "profiles_update_own" on public.profiles
  for update to authenticated
  using (id = auth.uid())
  with check (id = auth.uid());

drop policy if exists "profiles_update_admin" on public.profiles;
create policy "profiles_update_admin" on public.profiles
  for update to authenticated
  using (public.is_admin())
  with check (public.is_admin());

-- mentors (publik dibaca, admin mengelola)
drop policy if exists "mentors_select_all" on public.mentors;
create policy "mentors_select_all" on public.mentors
  for select to anon, authenticated using (true);

drop policy if exists "mentors_admin_write" on public.mentors;
create policy "mentors_admin_write" on public.mentors
  for all to authenticated
  using (public.is_admin()) with check (public.is_admin());

-- programs
drop policy if exists "programs_select_all" on public.programs;
create policy "programs_select_all" on public.programs
  for select to anon, authenticated
  using (is_active or public.is_admin());

drop policy if exists "programs_admin_write" on public.programs;
create policy "programs_admin_write" on public.programs
  for all to authenticated
  using (public.is_admin()) with check (public.is_admin());

-- sessions
drop policy if exists "sessions_select_all" on public.sessions;
create policy "sessions_select_all" on public.sessions
  for select to anon, authenticated using (true);

drop policy if exists "sessions_admin_write" on public.sessions;
create policy "sessions_admin_write" on public.sessions
  for all to authenticated
  using (public.is_admin()) with check (public.is_admin());

-- registrations
drop policy if exists "registrations_select_own_or_admin" on public.registrations;
create policy "registrations_select_own_or_admin" on public.registrations
  for select to authenticated
  using (user_id = auth.uid() or public.is_admin());

drop policy if exists "registrations_insert_own" on public.registrations;
create policy "registrations_insert_own" on public.registrations
  for insert to authenticated
  with check (user_id = auth.uid() and status = 'registered');

drop policy if exists "registrations_update_own" on public.registrations;
create policy "registrations_update_own" on public.registrations
  for update to authenticated
  using (user_id = auth.uid())
  with check (user_id = auth.uid() and status in ('registered', 'cancelled'));

drop policy if exists "registrations_admin_write" on public.registrations;
create policy "registrations_admin_write" on public.registrations
  for all to authenticated
  using (public.is_admin()) with check (public.is_admin());

-- announcements
drop policy if exists "announcements_select_published" on public.announcements;
create policy "announcements_select_published" on public.announcements
  for select to anon, authenticated
  using (is_published or public.is_admin());

drop policy if exists "announcements_admin_write" on public.announcements;
create policy "announcements_admin_write" on public.announcements
  for all to authenticated
  using (public.is_admin()) with check (public.is_admin());

-- documentation
drop policy if exists "documentation_select_all" on public.documentation;
create policy "documentation_select_all" on public.documentation
  for select to anon, authenticated using (true);

drop policy if exists "documentation_admin_write" on public.documentation;
create policy "documentation_admin_write" on public.documentation
  for all to authenticated
  using (public.is_admin()) with check (public.is_admin());

-- ---------------------------------------------------------------------
-- 4. STORAGE (bucket + policy)
-- ---------------------------------------------------------------------

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values
  ('avatars',       'avatars',       true, 2097152, array['image/jpeg', 'image/png', 'image/webp']),
  ('mentor-photos', 'mentor-photos', true, 2097152, array['image/jpeg', 'image/png', 'image/webp']),
  ('documentation', 'documentation', true, 2097152, array['image/jpeg', 'image/png', 'image/webp'])
on conflict (id) do update
  set public = excluded.public,
      file_size_limit = excluded.file_size_limit,
      allowed_mime_types = excluded.allowed_mime_types;

-- Baca publik
drop policy if exists "storage_public_read" on storage.objects;
create policy "storage_public_read" on storage.objects
  for select to anon, authenticated
  using (bucket_id in ('avatars', 'mentor-photos', 'documentation'));

-- Foto profil: setiap user hanya boleh mengelola folder miliknya (<user_id>/...)
drop policy if exists "avatars_insert_own" on storage.objects;
create policy "avatars_insert_own" on storage.objects
  for insert to authenticated
  with check (bucket_id = 'avatars' and (storage.foldername(name))[1] = auth.uid()::text);

drop policy if exists "avatars_update_own" on storage.objects;
create policy "avatars_update_own" on storage.objects
  for update to authenticated
  using (bucket_id = 'avatars' and (storage.foldername(name))[1] = auth.uid()::text);

drop policy if exists "avatars_delete_own" on storage.objects;
create policy "avatars_delete_own" on storage.objects
  for delete to authenticated
  using (bucket_id = 'avatars' and (storage.foldername(name))[1] = auth.uid()::text);

-- Foto mentor & dokumentasi: hanya admin
drop policy if exists "admin_storage_insert" on storage.objects;
create policy "admin_storage_insert" on storage.objects
  for insert to authenticated
  with check (bucket_id in ('mentor-photos', 'documentation') and public.is_admin());

drop policy if exists "admin_storage_update" on storage.objects;
create policy "admin_storage_update" on storage.objects
  for update to authenticated
  using (bucket_id in ('mentor-photos', 'documentation') and public.is_admin());

drop policy if exists "admin_storage_delete" on storage.objects;
create policy "admin_storage_delete" on storage.objects
  for delete to authenticated
  using (bucket_id in ('mentor-photos', 'documentation') and public.is_admin());

-- ---------------------------------------------------------------------
-- 5. JADIKAN SEORANG USER MENJADI ADMIN
-- Daftar dulu lewat website, lalu jalankan (ganti emailnya):
--
--   update public.profiles
--   set role = 'admin'
--   where id = (select id from auth.users where email = 'email-admin@contoh.com');
-- ---------------------------------------------------------------------

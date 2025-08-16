-- Core backend schema for HAIB app
-- 1) Extensions
create extension if not exists pgcrypto with schema public;

-- 2) Role system (for admin/moderator capabilities)
create type if not exists public.app_role as enum ('admin','moderator','user');

create table if not exists public.user_roles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  role public.app_role not null,
  created_at timestamptz not null default now(),
  unique(user_id, role)
);

alter table public.user_roles enable row level security;

create or replace function public.has_role(_user_id uuid, _role public.app_role)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.user_roles
    where user_id = _user_id
      and role = _role
  );
$$;

-- RLS for user_roles (users see/manage their own; admins can do all)
create policy if not exists "Users can view their own roles" on public.user_roles
for select to authenticated
using (auth.uid() = user_id or public.has_role(auth.uid(), 'admin'));

create policy if not exists "Users can assign their own user role" on public.user_roles
for insert to authenticated
with check (
  auth.uid() = user_id and role = 'user'
);

create policy if not exists "Admins can manage roles" on public.user_roles
for all to authenticated
using (public.has_role(auth.uid(), 'admin'))
with check (public.has_role(auth.uid(), 'admin'));

-- 3) Ensure profile auto-creation on signup
-- Function public.handle_new_user already exists; add trigger
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- 4) Shared enums
create type if not exists public.appointment_status as enum ('pending','confirmed','cancelled','completed','paid');
create type if not exists public.request_status as enum ('pending','approved','rejected');

-- 5) Salons
create table if not exists public.salons (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null,
  name text not null,
  description text,
  address text,
  city text,
  country text,
  latitude double precision,
  longitude double precision,
  phone text,
  email text,
  image_url text,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.salons enable row level security;

-- Salons policies
create policy if not exists "Salons readable by everyone" on public.salons
for select to anon, authenticated
using (true);

create policy if not exists "Salon owners or admins can insert salons" on public.salons
for insert to authenticated
with check (auth.uid() = owner_id or public.has_role(auth.uid(), 'admin'));

create policy if not exists "Salon owners or admins can update salons" on public.salons
for update to authenticated
using (auth.uid() = owner_id or public.has_role(auth.uid(), 'admin'))
with check (auth.uid() = owner_id or public.has_role(auth.uid(), 'admin'));

create policy if not exists "Salon owners or admins can delete salons" on public.salons
for delete to authenticated
using (auth.uid() = owner_id or public.has_role(auth.uid(), 'admin'));

create index if not exists idx_salons_owner on public.salons(owner_id);

create trigger if not exists update_salons_updated_at
before update on public.salons
for each row execute function public.update_updated_at_column();

-- 6) Service categories
create table if not exists public.service_categories (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.service_categories enable row level security;

create policy if not exists "Service categories readable by everyone" on public.service_categories
for select to anon, authenticated
using (true);

create policy if not exists "Admins manage service categories" on public.service_categories
for all to authenticated
using (public.has_role(auth.uid(), 'admin'))
with check (public.has_role(auth.uid(), 'admin'));

create trigger if not exists update_service_categories_updated_at
before update on public.service_categories
for each row execute function public.update_updated_at_column();

-- 7) Services
create table if not exists public.services (
  id uuid primary key default gen_random_uuid(),
  salon_id uuid not null,
  category_id uuid,
  name text not null,
  description text,
  price numeric(10,2) not null default 0,
  duration_minutes integer not null default 60,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.services enable row level security;

create policy if not exists "Services readable by everyone" on public.services
for select to anon, authenticated
using (true);

create policy if not exists "Salon owners or admins can insert services" on public.services
for insert to authenticated
with check (
  exists (
    select 1 from public.salons s
    where s.id = services.salon_id and (s.owner_id = auth.uid() or public.has_role(auth.uid(), 'admin'))
  )
);

create policy if not exists "Salon owners or admins can update services" on public.services
for update to authenticated
using (
  exists (
    select 1 from public.salons s
    where s.id = services.salon_id and (s.owner_id = auth.uid() or public.has_role(auth.uid(), 'admin'))
  )
)
with check (
  exists (
    select 1 from public.salons s
    where s.id = services.salon_id and (s.owner_id = auth.uid() or public.has_role(auth.uid(), 'admin'))
  )
);

create policy if not exists "Salon owners or admins can delete services" on public.services
for delete to authenticated
using (
  exists (
    select 1 from public.salons s
    where s.id = services.salon_id and (s.owner_id = auth.uid() or public.has_role(auth.uid(), 'admin'))
  )
);

create index if not exists idx_services_salon on public.services(salon_id);
create index if not exists idx_services_category on public.services(category_id);

create trigger if not exists update_services_updated_at
before update on public.services
for each row execute function public.update_updated_at_column();

-- 8) Workers
create table if not exists public.workers (
  id uuid primary key default gen_random_uuid(),
  salon_id uuid not null,
  name text not null,
  avatar_url text,
  skills text[],
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.workers enable row level security;

create policy if not exists "Workers readable by everyone" on public.workers
for select to anon, authenticated
using (true);

create policy if not exists "Salon owners or admins manage workers" on public.workers
for all to authenticated
using (
  exists (
    select 1 from public.salons s
    where s.id = workers.salon_id and (s.owner_id = auth.uid() or public.has_role(auth.uid(), 'admin'))
  )
)
with check (
  exists (
    select 1 from public.salons s
    where s.id = workers.salon_id and (s.owner_id = auth.uid() or public.has_role(auth.uid(), 'admin'))
  )
);

create index if not exists idx_workers_salon on public.workers(salon_id);

create trigger if not exists update_workers_updated_at
before update on public.workers
for each row execute function public.update_updated_at_column();

-- 9) Appointments
create table if not exists public.appointments (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  salon_id uuid not null,
  service_id uuid not null,
  worker_id uuid,
  start_at timestamptz not null,
  end_at timestamptz,
  status public.appointment_status not null default 'pending',
  notes text,
  total_amount numeric(10,2),
  paid boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.appointments enable row level security;

create policy if not exists "Users or owners can view appointments" on public.appointments
for select to authenticated
using (
  auth.uid() = user_id
  or exists (
    select 1 from public.salons s
    where s.id = appointments.salon_id and (s.owner_id = auth.uid() or public.has_role(auth.uid(), 'admin'))
  )
  or public.has_role(auth.uid(), 'admin')
);

create policy if not exists "Users create their own appointments" on public.appointments
for insert to authenticated
with check (auth.uid() = user_id);

create policy if not exists "Users or owners can update appointments" on public.appointments
for update to authenticated
using (
  auth.uid() = user_id
  or exists (
    select 1 from public.salons s
    where s.id = appointments.salon_id and (s.owner_id = auth.uid() or public.has_role(auth.uid(), 'admin'))
  )
  or public.has_role(auth.uid(), 'admin')
)
with check (
  auth.uid() = user_id
  or exists (
    select 1 from public.salons s
    where s.id = appointments.salon_id and (s.owner_id = auth.uid() or public.has_role(auth.uid(), 'admin'))
  )
  or public.has_role(auth.uid(), 'admin')
);

create policy if not exists "Users can delete their own appointments" on public.appointments
for delete to authenticated
using (auth.uid() = user_id or public.has_role(auth.uid(), 'admin'));

create index if not exists idx_appointments_user on public.appointments(user_id);
create index if not exists idx_appointments_salon on public.appointments(salon_id);
create index if not exists idx_appointments_start_at on public.appointments(start_at);

create trigger if not exists update_appointments_updated_at
before update on public.appointments
for each row execute function public.update_updated_at_column();

-- Validation trigger for appointment times
create or replace function public.validate_appointment_time()
returns trigger
language plpgsql
as $$
begin
  if TG_OP = 'INSERT' then
    if NEW.start_at < now() - interval '1 minute' then
      raise exception 'Appointment start time must be in the future';
    end if;
  end if;
  return NEW;
end;
$$;

create trigger if not exists validate_appointment_before_insert
before insert on public.appointments
for each row execute function public.validate_appointment_time();

-- 10) Reviews
create table if not exists public.reviews (
  id uuid primary key default gen_random_uuid(),
  salon_id uuid not null,
  user_id uuid not null,
  rating smallint not null,
  comment text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (salon_id, user_id)
);

alter table public.reviews enable row level security;

create policy if not exists "Reviews readable by everyone" on public.reviews
for select to anon, authenticated
using (true);

create policy if not exists "Users create their own reviews" on public.reviews
for insert to authenticated
with check (auth.uid() = user_id);

create policy if not exists "Users update their own reviews" on public.reviews
for update to authenticated
using (auth.uid() = user_id or public.has_role(auth.uid(), 'admin'))
with check (auth.uid() = user_id or public.has_role(auth.uid(), 'admin'));

create policy if not exists "Users delete their own reviews" on public.reviews
for delete to authenticated
using (auth.uid() = user_id or public.has_role(auth.uid(), 'admin'));

create index if not exists idx_reviews_salon on public.reviews(salon_id);
create index if not exists idx_reviews_user on public.reviews(user_id);

create trigger if not exists update_reviews_updated_at
before update on public.reviews
for each row execute function public.update_updated_at_column();

-- Validation trigger for rating range
create or replace function public.validate_review_rating()
returns trigger
language plpgsql
as $$
begin
  if NEW.rating < 1 or NEW.rating > 5 then
    raise exception 'Rating must be between 1 and 5';
  end if;
  return NEW;
end;
$$;

create trigger if not exists validate_review_before_write
before insert or update on public.reviews
for each row execute function public.validate_review_rating();

-- 11) Promotions
create table if not exists public.promotions (
  id uuid primary key default gen_random_uuid(),
  salon_id uuid not null,
  title text not null,
  description text,
  discount_percent numeric(5,2),
  discount_amount numeric(10,2),
  valid_from timestamptz,
  valid_to timestamptz,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.promotions enable row level security;

create policy if not exists "Promotions readable by everyone" on public.promotions
for select to anon, authenticated
using (true);

create policy if not exists "Owners or admins manage promotions" on public.promotions
for all to authenticated
using (
  exists (
    select 1 from public.salons s
    where s.id = promotions.salon_id and (s.owner_id = auth.uid() or public.has_role(auth.uid(), 'admin'))
  )
)
with check (
  exists (
    select 1 from public.salons s
    where s.id = promotions.salon_id and (s.owner_id = auth.uid() or public.has_role(auth.uid(), 'admin'))
  )
);

create index if not exists idx_promotions_salon on public.promotions(salon_id);

create trigger if not exists update_promotions_updated_at
before update on public.promotions
for each row execute function public.update_updated_at_column();

-- 12) Favorites
create table if not exists public.favorites (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  salon_id uuid not null,
  created_at timestamptz not null default now(),
  unique(user_id, salon_id)
);

alter table public.favorites enable row level security;

create policy if not exists "Users view their own favorites" on public.favorites
for select to authenticated
using (auth.uid() = user_id);

create policy if not exists "Users manage their own favorites" on public.favorites
for all to authenticated
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

create index if not exists idx_favorites_user on public.favorites(user_id);
create index if not exists idx_favorites_salon on public.favorites(salon_id);

-- 13) News
create table if not exists public.news (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  content text,
  image_url text,
  is_published boolean not null default true,
  published_at timestamptz,
  author_id uuid,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.news enable row level security;

create policy if not exists "News readable by public if published" on public.news
for select to anon, authenticated
using (is_published = true or public.has_role(auth.uid(), 'admin'));

create policy if not exists "Admins manage news" on public.news
for all to authenticated
using (public.has_role(auth.uid(), 'admin'))
with check (public.has_role(auth.uid(), 'admin'));

create trigger if not exists update_news_updated_at
before update on public.news
for each row execute function public.update_updated_at_column();

-- 14) Salon Requests (onboarding)
create table if not exists public.salon_requests (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  salon_name text not null,
  contact_name text,
  contact_phone text,
  contact_email text,
  message text,
  status public.request_status not null default 'pending',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.salon_requests enable row level security;

create policy if not exists "Users view their own requests or admins all" on public.salon_requests
for select to authenticated
using (auth.uid() = user_id or public.has_role(auth.uid(), 'admin'));

create policy if not exists "Users create their own requests" on public.salon_requests
for insert to authenticated
with check (auth.uid() = user_id);

create policy if not exists "Admins manage salon requests" on public.salon_requests
for all to authenticated
using (public.has_role(auth.uid(), 'admin'))
with check (public.has_role(auth.uid(), 'admin'));

create index if not exists idx_salon_requests_user on public.salon_requests(user_id);

create trigger if not exists update_salon_requests_updated_at
before update on public.salon_requests
for each row execute function public.update_updated_at_column();

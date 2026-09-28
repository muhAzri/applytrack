-- ApplyTrack schema. Run this once in the Supabase SQL editor for your project
-- (Dashboard -> SQL Editor -> New query -> paste -> Run).

create extension if not exists "pgcrypto";

create table if not exists public.applications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  company text not null,
  position text not null,
  status text not null default 'applied'
    check (status in ('wishlist', 'applied', 'interview', 'offer', 'rejected')),
  location text,
  job_url text,
  salary_range text,
  source text,
  applied_date date not null default current_date,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists applications_user_id_idx on public.applications (user_id);
create index if not exists applications_applied_date_idx on public.applications (applied_date desc);

-- Keep updated_at current on every row change.
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists applications_set_updated_at on public.applications;
create trigger applications_set_updated_at
  before update on public.applications
  for each row
  execute function public.set_updated_at();

-- Row Level Security: each user can only ever see/change their own rows.
alter table public.applications enable row level security;

drop policy if exists "Applications are viewable by owner" on public.applications;
create policy "Applications are viewable by owner"
  on public.applications for select
  using (auth.uid() = user_id);

drop policy if exists "Applications are insertable by owner" on public.applications;
create policy "Applications are insertable by owner"
  on public.applications for insert
  with check (auth.uid() = user_id);

drop policy if exists "Applications are updatable by owner" on public.applications;
create policy "Applications are updatable by owner"
  on public.applications for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

drop policy if exists "Applications are deletable by owner" on public.applications;
create policy "Applications are deletable by owner"
  on public.applications for delete
  using (auth.uid() = user_id);

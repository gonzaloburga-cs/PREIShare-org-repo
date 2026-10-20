-- Implements docs/data-model/property-listings-schema.md.
-- Sponsors own rows through owner_id -> auth.users(id).
-- RLS allows SELECT/INSERT/UPDATE/DELETE only when owner_id = auth.uid().

create extension if not exists "pgcrypto";

create table if not exists public.property_listings (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users (id) on delete restrict,
  title text not null,
  description text,
  address_line1 text not null,
  city text not null,
  region text,
  postal_code text,
  country text not null default 'US',
  price numeric(12, 2) not null check (price >= 0),
  status text not null default 'draft'
    check (status in ('draft', 'published', 'archived')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists property_listings_owner_id_idx
  on public.property_listings (owner_id);

create index if not exists property_listings_status_idx
  on public.property_listings (status);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
set search_path = public
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

revoke all on function public.set_updated_at() from public;
grant execute on function public.set_updated_at() to authenticated;

drop trigger if exists property_listings_set_updated_at on public.property_listings;
create trigger property_listings_set_updated_at
before update on public.property_listings
for each row
execute function public.set_updated_at();

alter table public.property_listings enable row level security;

revoke all on table public.property_listings from public, anon;
grant select, insert, update, delete on table public.property_listings to authenticated;

-- Sponsors only see their own rows. No policy for anon.
create policy "listings_select_own"
  on public.property_listings
  for select
  to authenticated
  using (owner_id = auth.uid());

-- Sponsors may insert only as themselves.
create policy "listings_insert_own"
  on public.property_listings
  for insert
  to authenticated
  with check (owner_id = auth.uid());

-- Sponsors may update only their own rows, and cannot reassign owner_id.
create policy "listings_update_own"
  on public.property_listings
  for update
  to authenticated
  using (owner_id = auth.uid())
  with check (owner_id = auth.uid());

-- Sponsors may delete only their own rows.
create policy "listings_delete_own"
  on public.property_listings
  for delete
  to authenticated
  using (owner_id = auth.uid());

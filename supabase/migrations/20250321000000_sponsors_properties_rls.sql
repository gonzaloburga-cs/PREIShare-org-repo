-- supabase/migrations/20250321000000_sponsors_properties_rls.sql
-- Column names and policy rules match docs/data-model-and-rls-matrix.md.
-- Properties are public.property_listings. This file does not create a second properties table.
-- Profiles have no DELETE policy. Anonymous visitors have no policies on either table.
-- DROP POLICY IF EXISTS lets this file run after 20250321000000_property_listings.sql,
-- which already created the four listing policies.

-- Sponsor profile linked 1:1 with auth.users. id is auth.uid().
CREATE TABLE IF NOT EXISTS public.profiles (
  id uuid PRIMARY KEY REFERENCES auth.users (id) ON DELETE CASCADE,
  display_name text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "profiles_select_own" ON public.profiles;
CREATE POLICY "profiles_select_own"
  ON public.profiles
  FOR SELECT
  TO authenticated
  USING (id = auth.uid());

DROP POLICY IF EXISTS "profiles_insert_own" ON public.profiles;
CREATE POLICY "profiles_insert_own"
  ON public.profiles
  FOR INSERT
  TO authenticated
  WITH CHECK (id = auth.uid());

DROP POLICY IF EXISTS "profiles_update_own" ON public.profiles;
CREATE POLICY "profiles_update_own"
  ON public.profiles
  FOR UPDATE
  TO authenticated
  USING (id = auth.uid())
  WITH CHECK (id = auth.uid());

-- Properties owned by a sponsor. Postgres name is property_listings.
-- owner_id references auth.users so policies can compare it to auth.uid().
CREATE TABLE IF NOT EXISTS public.property_listings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id uuid NOT NULL REFERENCES auth.users (id) ON DELETE RESTRICT,
  title text NOT NULL,
  description text,
  address_line1 text NOT NULL,
  city text NOT NULL,
  region text,
  postal_code text,
  country text NOT NULL DEFAULT 'US',
  price numeric(12, 2) NOT NULL CHECK (price >= 0),
  status text NOT NULL DEFAULT 'draft'
    CHECK (status IN ('draft', 'published', 'archived')),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS property_listings_owner_id_idx
  ON public.property_listings (owner_id);

ALTER TABLE public.property_listings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "listings_select_own" ON public.property_listings;
CREATE POLICY "listings_select_own"
  ON public.property_listings
  FOR SELECT
  TO authenticated
  USING (owner_id = auth.uid());

DROP POLICY IF EXISTS "listings_insert_own" ON public.property_listings;
CREATE POLICY "listings_insert_own"
  ON public.property_listings
  FOR INSERT
  TO authenticated
  WITH CHECK (owner_id = auth.uid());

DROP POLICY IF EXISTS "listings_update_own" ON public.property_listings;
CREATE POLICY "listings_update_own"
  ON public.property_listings
  FOR UPDATE
  TO authenticated
  USING (owner_id = auth.uid())
  WITH CHECK (owner_id = auth.uid());

DROP POLICY IF EXISTS "listings_delete_own" ON public.property_listings;
CREATE POLICY "listings_delete_own"
  ON public.property_listings
  FOR DELETE
  TO authenticated
  USING (owner_id = auth.uid());

-- Review checklist (checked against docs/data-model-and-rls-matrix.md):
-- [x] RLS enabled on profiles and property_listings
-- [x] No open USING (true) on sponsor/property data
-- [x] INSERT/UPDATE policies include WITH CHECK tied to auth.uid()
-- [x] Column list and FKs match docs/data-model-and-rls-matrix.md

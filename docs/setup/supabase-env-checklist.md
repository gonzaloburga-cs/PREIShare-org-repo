# Supabase environment setup checklist (PREIshare Sprint 4)

## Purpose
Configure Supabase URL and keys for the TanStack Start dashboard so sponsors
can authenticate and listings can load from Postgres without shipping
service-role secrets to the browser.

## Source requirements
See `docs/requirements/sponsor-auth-and-listings-brief.md` (auth, listings,
secret-hygiene sections).

## Supabase project
- [ ] Supabase project created (or selected) for PREIshare
- [ ] Project URL copied from Project Settings → API
- [ ] anon/public key copied
- [ ] service_role key copied and stored only in a local untracked env file
- [ ] Database password stored in a password manager (not in the repo)

## Repo files
- [ ] `.env.example` committed with placeholder values only
- [ ] Local `.env` or `.env.local` created from the example and filled with real values
- [ ] `.gitignore` includes `.env`, `.env.local`, and related env patterns
- [ ] `git status` does not list the real env file as untracked-to-add by mistake

## Public vs server-only rules
- [ ] Browser-safe vars use the template’s public prefix (e.g. `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`)
- [ ] `SUPABASE_SERVICE_ROLE_KEY` has NO public/client prefix
- [ ] No file under `src/` that runs in the browser reads `SUPABASE_SERVICE_ROLE_KEY`
- [ ] Checklist and example files contain zero real key material

## Smoke checks before feature work
- [ ] Restart the dev server after creating/editing the local env file
- [ ] App still starts (env typos often surface as empty URL/key errors later)
- [ ] Search the repo for the service_role key string — zero hits in tracked files

## Handoff notes
- Hosting providers need the same split: public vars for the client build,
  service-role only in server/runtime secret storage.
- Next steps (later in this sprint): data model, migrations/RLS, then Supabase
  clients that read these env names.

## Labels used in `.env.example`
- **PUBLIC / BROWSER-SAFE:** `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`. Vite exposes `VITE_` values to the client bundle. They are safe only because Row Level Security must still limit what the anon key can do.
- **SERVER-ONLY:** `SUPABASE_SERVICE_ROLE_KEY` and the optional unprefixed `SUPABASE_URL`. The service-role key bypasses Row Level Security. Read it with `process.env` inside server loaders or server functions only. Never prefix it with `VITE_` and never import it from browser code.

Do not put real key values in this checklist or in `.env.example`. Copy `.env.example` to `.env.local` (or `.env`) on your machine and paste the real values from your private note. Those local files stay gitignored.

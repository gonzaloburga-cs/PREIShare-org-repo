# Environment variable checklist

Source: `docs/sponsor-auth-requirements.md` (section 7).

Names and placeholders only. No real project URL and no real key. `.env.example` already lists these names. Copy it to gitignored `.env.local` (or `.env`) for real values. On a host such as Vercel, set the same names in that host's environment, then redeploy.

**Client-safe** means the value may be in the browser bundle. **Server-only** means read it with `process.env` inside a server function only. Do not import a server-only value from a page, a route component, or a shared React component.

| Name | Mark | Reason |
| --- | --- | --- |
| `VITE_SUPABASE_URL` | Client-safe | Public project URL (`https://your-project-ref.supabase.co`). The `VITE_` prefix puts it in the browser bundle. It is not the Vercel site URL. |
| `VITE_SUPABASE_ANON_KEY` | Client-safe | Public anon or publishable key (`your-anon-key-here`). It is safe in the browser only because row-level security still limits what it can do. |
| `SUPABASE_URL` | Server-only | Same project URL, without a `VITE_` prefix, for server code. Login checks this name first, then `VITE_SUPABASE_URL`. |
| `SUPABASE_SERVICE_ROLE_KEY` | Server-only | Service-role key (`your-service-role-key-here`). It bypasses row-level security. It must not be imported into browser code or shared React components. |

## Before you commit

- [ ] `.env.example` still shows placeholders, not a real URL or key
- [ ] `.env.local` (or `.env`) has the real values and is not listed by `git status`
- [ ] `SUPABASE_SERVICE_ROLE_KEY` has no `VITE_` prefix and is not imported from `src/components` or any other browser module
- [ ] This file and `.env.example` contain no key copied from the Supabase dashboard

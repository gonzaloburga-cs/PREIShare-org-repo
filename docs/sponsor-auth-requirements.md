# PREIshare Sponsor Auth & Property Listings — Security Requirements

## 1. Context

PREIshare sponsors need a dashboard where they can sign in, view the property listings they are allowed to manage, and add new properties. The listings live in Postgres through Supabase. A sponsor should only see and change their own rows.

Secret keys must never ship to the browser. The browser may know the public project URL and the public anon key. The service-role key stays on the server. Hiding a button is not enough. Postgres row-level security has to refuse a request that does not belong to the signed-in sponsor.

## 2. Actors

| Actor | Description | Signed in? |
| --- | --- | --- |
| Anonymous visitor | Anyone who is not logged in. They can open the login and signup pages. They cannot open the dashboard or change listings. | No |
| Sponsor | A partner who manages their own listings. After sign-in, they see only the properties tied to their account. | Yes (sponsor account) |
| Admin | An internal operator who might later review every sponsor's listings. That role is not built in this topic. | N/A this sprint topic |

## 3. User stories (in scope)

1. As a **sponsor**, I can sign in with my email and password so the app knows who I am.
2. As a **sponsor**, I can see a list of **only my** properties after sign-in.
3. As a **sponsor**, I can create a new property that is owned by my account.
4. As an **anonymous visitor**, I can reach the login page, but I cannot open the dashboard or change listings.

## 4. Non-goals (out of scope this topic)

- Public (anonymous) create, update, or delete of properties
- A full admin console, or a screen where one sponsor moderates another sponsor's listings
- Putting the Supabase **service-role** (secret) key in any client or browser bundle
- Password-reset email polish, social login (such as Google), or multi-factor auth, unless the starter already provides them
- Payments, file uploads, a custom domain, or several organizations inside one account

## 5. Success criteria

- [ ] A sponsor can complete login and land on a protected dashboard route
- [ ] A visitor who is not signed in is blocked from dashboard and property routes
- [ ] The property list returns only rows the signed-in sponsor is allowed to see
- [ ] Creating a property attaches the new row to the signed-in sponsor
- [ ] Browser-exposed config uses only public keys; secret keys stay in server environment variables
- [ ] Listing access is enforced with row-level security in Postgres, not only by hiding buttons in the page

## 6. Simple threat list

| Threat | What goes wrong | Requirement to mitigate |
| --- | --- | --- |
| Stolen or reused session | An attacker acts as the sponsor | Check the session on the server before any protected route. Sign-out clears the session. |
| Guessing another sponsor's property id | An attacker reads or edits someone else's listing because they know the id | Row-level security, and the server queries, must deny that access even when the id is known. |
| Leaked service-role key | An attacker skips row-level security with a powerful API key | Never put the service-role key in client code, git commits, docs, or screenshots. Read it from the server environment only. |
| Security by hiding buttons | The page hides edit controls, but the API still allows the write | Enforce the rules in Postgres row-level security and in server functions, not only in React components. |

## 7. Environment & secret hygiene notes (requirements only)

Document names and purpose only. Do not write real key values in this file, in `.env.example`, or in chat.

| Name | Who can see it | Purpose |
| --- | --- | --- |
| `VITE_SUPABASE_URL` | Public. Safe in the browser. | Supabase project URL. It looks like `https://<project-ref>.supabase.co`. It is not the Vercel site URL. |
| `VITE_SUPABASE_ANON_KEY` | Public. Safe in the browser when row-level security is on. | Anon or publishable key. It does not bypass row-level security. |
| `SUPABASE_URL` | Server only. No `VITE_` prefix. | Same project URL, for server code that does not read public `VITE_` names. |
| `SUPABASE_SERVICE_ROLE_KEY` | Server only. No `VITE_` prefix. | Service-role key. It bypasses row-level security. Sponsor login and listing pages must not use it. |

Real values belong in a gitignored `.env` or `.env.local` on a laptop, and in the host's secret storage (for example Vercel environment variables) for a deployed app. `.env.example` keeps placeholders only.

## 8. Open questions for the team

These are the working answers for the stories above. Change them only if the team decides otherwise.

- **Login method.** Sponsors sign in with email and password. Magic links, social login, and multi-factor auth are out of scope.
- **Sponsor profile table.** There is no separate `sponsors` table for this topic. A listing's `owner_id` points at `auth.users`. The signed-in user's id is the owner. A profile table can be added later if the team needs extra sponsor fields.

## 9. How later steps use this brief

This file is the contract for the work that follows:

- Which environment variables are public and which stay on the server
- Row-level security so each sponsor can touch only their own listings
- Login, signup, and a dashboard that redirects visitors who are not signed in
- List and create flows that stamp ownership from the session, not from a field the browser sends
- The end-to-end security check that a second sponsor cannot see the first sponsor's rows

# Supabase backend

## One-time setup

1. Create a project at https://app.supabase.com (region close to your users).
2. In **Settings → API**, copy:
   - Project URL → `NEXT_PUBLIC_SUPABASE_URL`
   - `anon` `public` key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `service_role` key → `SUPABASE_SERVICE_ROLE_KEY` (server only)
   Put them in `.env.local` (see `.env.example`).
3. Link the CLI and push the schema:
   ```bash
   npx supabase login
   npx supabase link --project-ref <your-project-ref>
   npx supabase db push          # applies migrations/
   npx supabase db execute --file supabase/seed.sql   # or run seed.sql in the SQL editor
   ```
4. In **Authentication → URL Configuration**, set:
   - Site URL: `http://localhost:3000` (and your production URL later)
   - Redirect URLs: add `http://localhost:3000/auth/callback`
5. Enable providers you want under **Authentication → Providers** (Email is on by
   default; add Google / Apple with their client IDs to make those buttons work).
6. (Optional) Regenerate the TypeScript types from the live schema:
   ```bash
   npx supabase gen types typescript --linked > src/lib/supabase/types.ts
   ```

## What's in the schema (`migrations/20260909120000_init.sql`)

| Table | Purpose |
| --- | --- |
| `profiles` | 1:1 with `auth.users`; created automatically on signup. Holds the whole member profile, `status` (draft→active), `plan`, `category` (standard/widowed), guardian fields. |
| `independent_walis` | The appointed-wali register. Seeded from `seed.sql`. |
| `wali_requests` | A sister requests a listed wali to represent her; the wali accepts/declines. |
| `interest_requests` | One member expresses interest in another. |
| `matches` | Created (via `accept_interest_request` RPC) when a request is accepted. |
| `messages` | Chat within a match. Added to the `supabase_realtime` publication. |
| `profile_views` | "See who viewed your profile" (paid feature). |
| `nudges` | Light "still interested?" ping. |

RLS is enabled on every table. Realtime is enabled for `messages`, `matches`
and `interest_requests`.

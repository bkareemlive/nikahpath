# Going live

Where things stand as of 2026-09-13, and what's left before real members
can use NikahPathway. Ordered roughly by what blocks what.

## 1. Finish what's in flight

- [ ] `feature/shortlist` branch is open, waiting on `supabase/apply-5.sql`
      to be run in the SQL Editor, then needs a live verify + merge.
- [ ] Decide who the real admin(s) should be (`profiles.role = 'admin'`)
      — currently only the seed test account `seed.yusuf@nikahpath.dev`.

## 2. Database

- [ ] Confirm every `supabase/apply-*.sql` has actually run against
      production — several have silently failed to run this project before
      (wrong tab, pasted the filename instead of the SQL, etc.). Quick check
      per file: does the table/column/policy it creates exist?
- [ ] Supabase plan: check the project's current tier. The Free tier has
      limited point-in-time recovery and pauses after a week of no API
      requests — not suitable for a live product holding real members'
      personal data. Upgrade to Pro (or higher) before opening signups.
- [ ] Decide a backup policy (Supabase's automatic backups, or your own
      periodic `pg_dump`) — this holds people's real names, guardian
      contact details, etc.
- [ ] Consider deleting/relabeling the `seed.*@nikahpath.dev` sample
      members before launch, or clearly marking them as demo accounts —
      right now they're indistinguishable from real members in Browse.

## 3. Payments (Stripe) — currently fully unconfigured

Checked `.env.local` directly: **every `STRIPE_*` variable is empty.**
Checkout is inert — membership buttons currently do nothing. Full setup
steps are in [PAYMENTS.md](PAYMENTS.md); summary:

- [ ] Create/verify a Stripe account. For live payments (not test mode)
      Stripe requires business verification (legal entity, bank account) —
      this can take a few days, start it early.
- [ ] Run `node scripts/stripe-setup.mjs` against the **live** secret key
      to create live-mode prices (test-mode and live-mode price IDs are
      different — don't reuse the test ones).
- [ ] Add a production webhook endpoint at
      `https://<your-domain>/api/stripe/webhook` for
      `checkout.session.completed` and the `customer.subscription.*`
      events; copy its signing secret into `STRIPE_WEBHOOK_SECRET`.
- [ ] As a US 501(c)(3) reselling internationally, get a read from someone
      on tax handling (Stripe Tax, or a merchant-of-record) before taking
      live payments — noted already in PAYMENTS.md.

## 4. Hosting (Vercel)

- [ ] Create the Vercel project from the `bkareemlive/nikahpathway` GitHub
      repo (main branch = production deployment).
- [ ] Set every env var from `.env.local` in the Vercel project settings —
      `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`,
      `SUPABASE_SERVICE_ROLE_KEY` (server-only, never expose client-side),
      `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, the six
      `STRIPE_PRICE_*` ids, and `NEXT_PUBLIC_SITE_URL` set to the real
      production URL (currently `http://localhost:...` locally).
- [ ] Set the project's Node.js version to 22 — `@supabase/supabase-js`
      is dropping support for Node 20 and below.
- [ ] Point your custom domain (`site.url` in `src/data/site.ts` is
      `https://nikahpathway.com`) at the Vercel project and wait
      for DNS + SSL to settle.
- [ ] In Supabase Auth settings, add the production domain to the
      allowed **Redirect URLs** (used by password reset / email-change
      links) — currently probably only `localhost` is allowed.

## 5. Auth email deliverability

Supabase's built-in email sender (for password reset, email change
confirmation) is low-volume, rate-limited, and sends from a generic
Supabase address — not something to rely on for a live product.

- [ ] Configure custom SMTP in Supabase Auth settings (Resend, Postmark,
      SES, etc.) under the organization's own domain, so these emails
      actually land in inboxes and look legitimate.

## 6. Legal

- [ ] `/terms` and `/privacy` are explicitly marked as placeholder copy
      in `PROJECT-NOTES.md` — have someone (ideally with legal review,
      given this handles sensitive personal and religious data) write
      real terms and a real privacy policy before real members sign up.

## 7. Security

- [ ] Set up GitHub branch protection on `main` (require PRs, no direct
      pushes/force-pushes) — noted as a standing to-do in
      `CONTRIBUTING.md`.
- [ ] Consider a CAPTCHA or similar on `/register` — nothing currently
      stops automated signups.
- [ ] Double-check the service role key is never referenced from any
      client component or `NEXT_PUBLIC_*` var (it currently isn't, but
      worth a final grep before launch).

## 8. QA pass

- [ ] Full manual walkthrough as a **real, non-seed** account: register,
      onboarding, browse, send/accept interest, chat, nudge, upgrade to a
      paid plan (once Stripe is live), report/block, and — as an admin —
      triage a report and suspend/reactivate a member.
- [ ] Test on an actual phone, not just the emulated viewport.

## 9. Nice-to-haves (not blocking)

- [ ] Bump local dev off Node 20 (deprecation warnings throughout builds).
- [ ] Error tracking (Sentry or similar) — nothing currently catches
      production runtime errors beyond Vercel's own logs.
- [ ] `sitemap.xml` / `robots.txt` for SEO.
- [ ] `gh auth login` so PR status/checks show up without manual copies.
# verify branch protection is active

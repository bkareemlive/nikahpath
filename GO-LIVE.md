# Going live

Where things stand as of 2026-09-16. NikahPathway is live in production at
[nikahpathway.com](https://nikahpathway.com). Only item 8 remains.

## 1. Finish what's in flight ✅

- [x] Shortlist feature merged and verified live.
- [x] Real admins set: `bkareem2010@gmail.com` and the seed test account
      `seed.yusuf@nikahpath.dev`.

## 2. Database ✅

- [x] Every `supabase/apply-*.sql` confirmed applied against production.
- [x] Supabase is on the Pro plan — backups/auto-pause aren't a concern.
- [x] Seed accounts kept (for a populated-looking Browse at launch) but
      flagged: `profiles.is_demo = true`, shown as "Demo profile" in the UI.

## 3. Payments (Stripe) ✅ — live mode

- [x] Stripe account activated for live payments.
- [x] Live-mode products/prices created (renamed to match the NikahPathway
      rebrand) via `scripts/stripe-setup.mjs`.
- [x] Production webhook at `https://nikahpathway.com/api/stripe/webhook`,
      verified responding correctly to signed requests.
- [ ] Tax handling (Stripe Tax vs. a merchant-of-record) for a US 501(c)(3)
      reselling internationally — still an open question, not a technical
      blocker. See `PAYMENTS.md`.

## 4. Hosting (Vercel) ✅

- [x] Vercel project `bkareemlive/nikahpathway`, connected to the
      `bkareemlive/nikahpathway` GitHub repo (renamed from `nikahpath`
      partway through — see `CONTRIBUTING.md`).
- [x] All env vars set in Vercel (Supabase, Stripe, Turnstile).
- [x] Node.js version: 24.x.
- [x] `nikahpathway.com` registered (via Vercel), DNS + SSL live, attached
      to the project. (`nikahpath.net` was tried first, then detached and
      kept unused once the real `.com` was secured.)
- [x] Supabase Auth allowed Redirect URLs include `nikahpathway.com`.

## 5. Auth email deliverability ✅

- [x] Custom SMTP via Resend, sending from `noreply@nikahpathway.com`
      (DKIM/SPF/DMARC all verified). Confirmed via a real password-reset
      email — arrived promptly, correct sender, no rate-limit issue.

## 6. Legal ✅

- [x] `/terms` and `/privacy` rewritten to describe what the app actually
      does and collects. **Not legally reviewed** — recommend an actual
      attorney look at it, especially the governing-law clause (currently
      just "United States", no specific state) and international-user
      data rights.

## 7. Security ✅

- [x] GitHub branch protection on `main`: PR required (0 approvals needed),
      `enforce_admins: true`, no force-pushes, no deletion. Direct
      `git push` to `main` is now rejected — merge via
      `gh pr create` + `gh pr merge --squash --delete-branch`.
- [x] Cloudflare Turnstile CAPTCHA on `/register` (not login, to avoid
      friction for returning members), verified server-side. Confirmed
      working with a real signup.
- [x] Service role key confirmed server-only (webhook route + the
      `closeAccount` server action) — never client-side or `NEXT_PUBLIC_*`.

## 8. QA pass — not started

- [ ] Full manual walkthrough as a **real, non-seed** account: register,
      onboarding, browse, send/accept interest, chat, nudge, upgrade to a
      paid plan (careful — Stripe is in **live mode**, this charges a real
      card), report/block, and — as an admin — triage a report and
      suspend/reactivate a member.
- [ ] Test on an actual phone, not just the emulated viewport.

## 9. Nice-to-haves (not blocking)

- [ ] Bump local dev off Node 20 (deprecation warnings throughout builds).
- [ ] Error tracking (Sentry or similar) — nothing currently catches
      production runtime errors beyond Vercel's own logs.
- [ ] `sitemap.xml` / `robots.txt` for SEO.

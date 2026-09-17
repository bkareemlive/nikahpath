# Going live

All 8 items are done as of 2026-09-16. NikahPathway is live in production at
[nikahpathway.com](https://nikahpathway.com), fully wired end to end.

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

## 8. QA pass ✅

- [x] Full manual walkthrough with two fresh, real (non-seed) test accounts:
      register (CAPTCHA verified separately with a real signup), onboarding
      (both brother and sister flows, incl. guardian setup), browse,
      send/accept interest → match, chat both directions, nudge, unread
      badges, report a member, admin triage ("Suspend member & close"),
      reactivate. Paid-plan gates (interest requests, nudges) confirmed by
      toggling `profiles.plan` directly rather than a real Stripe purchase —
      Stripe is in **live mode**, so an actual checkout was skipped
      deliberately.
- [x] Found and fixed a real bug in the process: `/dashboard` and `/wali`
      fetched the profile manually and never checked for
      `status === 'suspended'`, so a suspended member could still land on
      their dashboard instead of being locked out to `/suspended` like
      every other page. Fixed, shipped through the normal branch-protected
      PR flow, re-verified live with the still-suspended test account.
- [x] Mobile layout spot-checked at an emulated 375px viewport (marketing
      page, dashboard with the admin nav) — held up cleanly. This is an
      emulation, not an actual device; worth a real-phone check when
      convenient.

## 9. Nice-to-haves (not blocking)

- [ ] Bump local dev off Node 20 (deprecation warnings throughout builds).
- [ ] Error tracking (Sentry or similar) — nothing currently catches
      production runtime errors beyond Vercel's own logs.
- [ ] `sitemap.xml` / `robots.txt` for SEO.

## 10. Marketing collateral ✅

- [x] Print flyer + matching social-media graphic, built as a design canvas:
      [claude.ai/artifact/BqXTYmZWxxzj6JedgFzxWu](https://claude.ai/artifact/BqXTYmZWxxzj6JedgFzxWu).
      Two artboards — a US Letter print flyer (notice-board ready) and a
      1080×1080 square post — both carrying the real logo/palette/type,
      the headline "For marriage-minded Muslims.", a real scannable QR
      code to `nikahpathway.com`, and the "A product of: Al-Fur'qan
      International Missionary" credit. Export to PDF (print) or PNG
      (social) from the canvas's own toolbar.

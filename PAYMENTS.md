# Payments (Stripe)

Plan gating is live and works without Stripe. Checkout stays inert until the
keys below are set — the buttons then start real Stripe Checkout.

## Plans

| Plan | Type | Regular | Launch promo |
| --- | --- | --- | --- |
| Full Access — monthly | subscription | $24.99/mo | $15/mo |
| Full Access — 6 months | subscription (every 6 mo) | $99.99 | $90 |
| Lifetime | one-time | $229.99 | $150 |

Amounts live in `src/data/pricing.ts`. The promo is toggled by `promo.active`
in that file; while active, checkout uses the `*_PROMO` price ids.

## What gating enforces (`src/lib/plan.ts`)

| Capability | Free | Full Access | Lifetime |
| --- | --- | --- | --- |
| Interest requests / month | 0 | 10 | unlimited |
| Advanced browse filters + recent-active sort | – | ✓ | ✓ |
| See who viewed you (`/viewed`) | count only | ✓ | ✓ |
| Visibility boost in Browse | – | – | ✓ |

## Setup

1. Create a Stripe account (test mode is fine to start).
2. Put the **secret key** in `.env.local` as `STRIPE_SECRET_KEY` (test: `sk_test_…`).
3. Create the products/prices:
   ```bash
   node scripts/stripe-setup.mjs
   ```
   Paste the six `STRIPE_PRICE_*` lines it prints into `.env.local`.
4. Apply the DB migration (adds `profiles.stripe_customer_id` + two RLS
   policies): run `supabase/apply-2.sql` in the Supabase SQL Editor, or
   `npx supabase db push` if the CLI is linked.
5. Set up the webhook:
   - **Local:** `stripe listen --forward-to localhost:3000/api/stripe/webhook`
     and copy the `whsec_…` it prints into `STRIPE_WEBHOOK_SECRET`.
   - **Production:** add an endpoint at `https://<domain>/api/stripe/webhook`
     for events `checkout.session.completed`,
     `customer.subscription.created/updated/deleted`; copy its signing secret.
6. Restart the dev server. The membership buttons now open Stripe Checkout;
   on success the webhook sets `profiles.plan` / `plan_since`.

## Flow

- `startCheckout` (server action) creates/reuses a Stripe customer, opens a
  Checkout Session (`success_url` → `/dashboard?upgraded=1`), redirects.
- `/api/stripe/webhook` verifies the signature and updates the profile:
  Lifetime → `plan = lifetime`; an active subscription → `plan = full_access`;
  a cancelled/deleted subscription → `plan = free`.
- `openBillingPortal` sends subscribers to the Stripe customer portal.

## Note for a US 501(c)(3)

Stripe does not remit sales tax/VAT for you. Selling digital memberships
internationally may create tax obligations. Consider Stripe Tax, or a
merchant-of-record (Lemon Squeezy / Paddle), before taking live payments
outside the US.

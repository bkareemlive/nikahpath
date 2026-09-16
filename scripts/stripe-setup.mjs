// Creates the Stripe products + prices for NikahPathway and prints the env lines
// to paste into .env.local. Idempotent-ish: it always creates new prices, so
// run it once. Amounts mirror src/data/pricing.ts — keep them in sync.
//
//   node scripts/stripe-setup.mjs
//
// Needs STRIPE_SECRET_KEY in .env.local.

import { readFileSync } from "node:fs";
import Stripe from "stripe";

const env = Object.fromEntries(
  readFileSync(new URL("../.env.local", import.meta.url), "utf8")
    .split("\n")
    .filter((l) => l && !l.startsWith("#") && l.includes("="))
    .map((l) => {
      const i = l.indexOf("=");
      return [l.slice(0, i).trim(), l.slice(i + 1).trim()];
    }),
);

const key = env.STRIPE_SECRET_KEY;
if (!key) {
  console.error("Set STRIPE_SECRET_KEY in .env.local first.");
  process.exit(1);
}
const stripe = new Stripe(key);

const dollars = (n) => Math.round(n * 100);

async function main() {
  const fullAccess = await stripe.products.create({
    name: "NikahPathway Full Access",
    description: "Subscription — send requests, match, chat, reach a guardian.",
  });
  const lifetime = await stripe.products.create({
    name: "NikahPathway Lifetime",
    description: "One-time — permanent access, no monthly fee.",
  });

  const mk = (product, unit_amount, recurring) =>
    stripe.prices.create({ product, currency: "usd", unit_amount, ...(recurring ? { recurring } : {}) });

  const out = {
    STRIPE_PRICE_FULL_MONTHLY: (await mk(fullAccess.id, dollars(24.99), { interval: "month" })).id,
    STRIPE_PRICE_FULL_6MO: (await mk(fullAccess.id, dollars(99.99), { interval: "month", interval_count: 6 })).id,
    STRIPE_PRICE_LIFETIME: (await mk(lifetime.id, dollars(229.99))).id,
    STRIPE_PRICE_FULL_MONTHLY_PROMO: (await mk(fullAccess.id, dollars(14.99), { interval: "month" })).id,
    STRIPE_PRICE_FULL_6MO_PROMO: (await mk(fullAccess.id, dollars(90), { interval: "month", interval_count: 6 })).id,
    STRIPE_PRICE_LIFETIME_PROMO: (await mk(lifetime.id, dollars(149.99))).id,
  };

  console.log("\nAdd these to .env.local:\n");
  for (const [k, v] of Object.entries(out)) console.log(`${k}=${v}`);
  console.log(
    "\nThen set up a webhook to /api/stripe/webhook and put its signing secret in STRIPE_WEBHOOK_SECRET.",
  );
}

main().catch((e) => {
  console.error(e.message);
  process.exit(1);
});

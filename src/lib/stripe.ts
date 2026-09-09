import "server-only";
import Stripe from "stripe";

let _stripe: Stripe | null = null;

/** Lazily constructed so the app builds/runs without Stripe keys set. */
export function getStripe(): Stripe {
  if (!_stripe) {
    const key = process.env.STRIPE_SECRET_KEY;
    if (!key) throw new Error("STRIPE_SECRET_KEY is not set");
    _stripe = new Stripe(key);
  }
  return _stripe;
}

export function stripeConfigured(): boolean {
  return Boolean(process.env.STRIPE_SECRET_KEY);
}

export type CheckoutPlan = "full_access" | "lifetime";
export type CheckoutCycle = "monthly" | "sixMonth";

/**
 * Resolve the Stripe price id for a plan/cycle, honouring the launch promo.
 * Returns `{ priceId, mode }` or null when the relevant price env var is missing.
 */
export function resolvePrice(
  plan: CheckoutPlan,
  cycle: CheckoutCycle,
  promoActive: boolean,
): { priceId: string; mode: "subscription" | "payment" } | null {
  const e = process.env;
  const pick = (base: string) =>
    (promoActive ? e[`${base}_PROMO`] : undefined) ?? e[base];

  if (plan === "lifetime") {
    const priceId = pick("STRIPE_PRICE_LIFETIME");
    return priceId ? { priceId, mode: "payment" } : null;
  }
  const base = cycle === "sixMonth" ? "STRIPE_PRICE_FULL_6MO" : "STRIPE_PRICE_FULL_MONTHLY";
  const priceId = pick(base);
  return priceId ? { priceId, mode: "subscription" } : null;
}

"use client";

import { useState } from "react";
import { Button } from "./Button";
import { plans, promo } from "@/data/pricing";
import { site } from "@/data/site";

const check = (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="text-primary">
    <path d="M20 6 9 17l-5-5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export function PricingPlans() {
  const [cycle, setCycle] = useState<"monthly" | "sixMonth">("monthly");

  const regularFullAccess =
    cycle === "monthly"
      ? plans.fullAccessMonthly
      : plans.fullAccessSixMonth / 6;

  const fullAccessPrice = promo.active
    ? cycle === "monthly"
      ? promo.fullAccessMonthly
      : promo.fullAccessSixMonth / 6
    : regularFullAccess;

  const sixMonthTotal = promo.active
    ? promo.fullAccessSixMonth
    : plans.fullAccessSixMonth;

  const fullAccessSub =
    cycle === "monthly"
      ? "Billed each month. Stop whenever you like."
      : `$${sixMonthTotal.toFixed(2)} charged once, covering 6 months.`;

  const lifetimePrice = promo.active ? promo.lifetime : plans.lifetime;

  return (
    <div>
      {promo.active && (
        <div className="mx-auto mb-8 flex max-w-2xl items-center justify-center gap-2 rounded-xl border border-primary/30 bg-primary-tint px-4 py-3 text-center text-sm font-medium text-primary-dark">
          <span aria-hidden>🎉</span>
          <span>
            {promo.name}: Full Access ${promo.fullAccessMonthly}/mo and Lifetime
            ${promo.lifetime} one-time — for the {promo.durationLabel}.
          </span>
        </div>
      )}

      <div className="mx-auto mb-10 flex w-fit items-center gap-1 rounded-full border border-line bg-white p-1">
        <button
          type="button"
          onClick={() => setCycle("monthly")}
          className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
            cycle === "monthly" ? "bg-primary text-white" : "text-muted hover:text-ink"
          }`}
        >
          Monthly
        </button>
        <button
          type="button"
          onClick={() => setCycle("sixMonth")}
          className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
            cycle === "sixMonth" ? "bg-primary text-white" : "text-muted hover:text-ink"
          }`}
        >
          6 Months
          {!promo.active && (
            <span className="ml-1.5 rounded-full bg-gold-light px-1.5 py-0.5 text-[11px] font-semibold text-gold">
              Save $50
            </span>
          )}
        </button>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Free */}
        <div className="flex flex-col rounded-2xl border border-line bg-white p-7">
          <h3 className="font-display text-xl font-semibold text-ink">Free</h3>
          <p className="mt-1 text-sm text-muted">Enough to join and see who is here.</p>
          <p className="mt-6">
            <span className="font-display text-4xl font-semibold text-ink">$0</span>
            <span className="text-sm text-muted"> / forever</span>
          </p>
          <ul className="mt-6 space-y-3 text-sm text-body">
            {[
              "Write a detailed profile",
              "Look through every member",
              "Reply to requests you receive",
              "Age, location and background filters",
            ].map((f) => (
              <li key={f} className="flex gap-2.5">
                {check}
                <span>{f}</span>
              </li>
            ))}
          </ul>
          <div className="mt-8">
            <Button href={site.registerUrl} variant="secondary" className="w-full">
              Create free profile
            </Button>
          </div>
        </div>

        {/* Full Access */}
        <div className="relative flex flex-col rounded-2xl border-2 border-primary bg-white p-7 shadow-lift">
          <span className="absolute -top-3 left-7 rounded-full bg-primary px-3 py-1 text-xs font-semibold text-white">
            Most chosen
          </span>
          <h3 className="font-display text-xl font-semibold text-ink">Full Access</h3>
          <p className="mt-1 text-sm text-muted">Everything needed to match and talk.</p>
          <p className="mt-6 flex flex-wrap items-baseline gap-x-2">
            <span className="font-display text-4xl font-semibold text-ink">
              ${fullAccessPrice.toFixed(2)}
            </span>
            {promo.active && (
              <span className="font-display text-xl font-semibold text-muted line-through">
                ${regularFullAccess.toFixed(2)}
              </span>
            )}
            <span className="text-sm text-muted"> / month</span>
          </p>
          {promo.active && (
            <p className="mt-1 text-xs font-semibold text-primary">
              {promo.name} · {promo.durationLabel}
            </p>
          )}
          <p className="mt-1 text-xs text-muted">{fullAccessSub}</p>
          <ul className="mt-6 space-y-3 text-sm text-body">
            {[
              "10 interest requests each month",
              "Match, and withdraw requests",
              "See who has opened your profile",
              "Message matches and send reminders",
              "Finer filters and recent-activity sort",
              "Access guardian contact details",
              "No adverts, plus faster support",
            ].map((f) => (
              <li key={f} className="flex gap-2.5">
                {check}
                <span>{f}</span>
              </li>
            ))}
          </ul>
          <div className="mt-8">
            <Button href={site.registerUrl} className="w-full">
              Choose Full Access
            </Button>
          </div>
        </div>

        {/* Lifetime */}
        <div className="relative flex flex-col rounded-2xl border-2 border-primary bg-primary-tint p-7 shadow-lift">
          <span className="absolute -top-3 left-7 rounded-full bg-primary px-3 py-1 text-xs font-semibold text-white">
            Best value
          </span>
          <h3 className="font-display text-xl font-semibold text-ink">Lifetime</h3>
          <p className="mt-1 text-sm text-muted">Pay once. Keep it for good.</p>
          <p className="mt-6 flex flex-wrap items-baseline gap-x-2">
            <span className="font-display text-4xl font-semibold text-ink">
              ${lifetimePrice.toFixed(2)}
            </span>
            {promo.active && (
              <span className="font-display text-xl font-semibold text-muted line-through">
                ${plans.lifetime.toFixed(2)}
              </span>
            )}
            <span className="text-sm text-muted"> one-time</span>
          </p>
          {promo.active && (
            <p className="mt-1 text-xs font-semibold text-primary">
              {promo.name} · {promo.durationLabel}
            </p>
          )}
          <p className="mt-1 text-xs text-muted">No renewals and no monthly charge.</p>
          <ul className="mt-6 space-y-3 text-sm text-body">
            {[
              "Everything in Full Access",
              "No monthly cap on requests or matches",
              "No cap on profile views",
              "Extra visibility in search",
              "First access to new features",
              "Access that does not expire",
            ].map((f) => (
              <li key={f} className="flex gap-2.5">
                {check}
                <span>{f}</span>
              </li>
            ))}
          </ul>
          <div className="mt-8">
            <Button href={site.registerUrl} className="w-full">
              Choose Lifetime
            </Button>
          </div>
          <p className="mt-3 text-center text-xs text-muted">
            Cheaper than a year of Full Access
          </p>
        </div>
      </div>
    </div>
  );
}

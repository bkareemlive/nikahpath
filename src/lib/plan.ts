export type Plan = "free" | "full_access" | "lifetime";

export type PlanLimits = {
  label: string;
  interestRequestsPerMonth: number | null; // null = unlimited
  advancedFilters: boolean;
  recentActivitySort: boolean;
  seeWhoViewedYou: boolean;
  visibilityBoost: boolean;
  adFree: boolean;
};

export const PLAN_LIMITS: Record<Plan, PlanLimits> = {
  free: {
    label: "Free",
    interestRequestsPerMonth: 0,
    advancedFilters: false,
    recentActivitySort: false,
    seeWhoViewedYou: false,
    visibilityBoost: false,
    adFree: false,
  },
  full_access: {
    label: "Full Access",
    interestRequestsPerMonth: 10,
    advancedFilters: true,
    recentActivitySort: true,
    seeWhoViewedYou: true,
    visibilityBoost: false,
    adFree: true,
  },
  lifetime: {
    label: "Lifetime",
    interestRequestsPerMonth: null,
    advancedFilters: true,
    recentActivitySort: true,
    seeWhoViewedYou: true,
    visibilityBoost: true,
    adFree: true,
  },
};

export function limitsFor(plan: string | null | undefined): PlanLimits {
  return PLAN_LIMITS[(plan as Plan) ?? "free"] ?? PLAN_LIMITS.free;
}

export function planLabel(plan: string | null | undefined): string {
  return limitsFor(plan).label;
}

export function isPaid(plan: string | null | undefined): boolean {
  return plan === "full_access" || plan === "lifetime";
}

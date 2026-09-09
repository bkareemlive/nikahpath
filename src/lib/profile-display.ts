import {
  PRACTICE_PRAYER_OPTIONS,
  SECT_OPTIONS,
  MARITAL_OPTIONS,
  TIMELINE_OPTIONS,
  RELOCATE_OPTIONS,
  WANTS_CHILDREN_OPTIONS,
} from "./profile-options";

export function isOnline(lastActiveAt: string | null): boolean {
  if (!lastActiveAt) return false;
  return Date.now() - new Date(lastActiveAt).getTime() < 10 * 60 * 1000;
}

export function ageFromDob(dob: string | null): number | null {
  if (!dob) return null;
  const d = new Date(dob + "T00:00:00Z");
  if (Number.isNaN(d.getTime())) return null;
  const now = new Date();
  let age = now.getUTCFullYear() - d.getUTCFullYear();
  const m = now.getUTCMonth() - d.getUTCMonth();
  if (m < 0 || (m === 0 && now.getUTCDate() < d.getUTCDate())) age--;
  return age;
}

/** ISO dates (YYYY-MM-DD) bounding a requested age range. */
export function dobRangeForAges(min?: number, max?: number) {
  const now = new Date();
  const iso = (d: Date) => d.toISOString().slice(0, 10);
  const shiftYears = (years: number) => {
    const d = new Date(now);
    d.setUTCFullYear(d.getUTCFullYear() - years);
    return d;
  };
  return {
    // oldest acceptable birth date (people at least `min` years old)
    maxDob: min != null ? iso(shiftYears(min)) : null,
    // youngest acceptable birth date (people at most `max` years old)
    minDob: max != null ? iso(shiftYears(max + 1)) : null,
  };
}

const dict = (opts: readonly { value: string; label: string }[]) =>
  Object.fromEntries(opts.map((o) => [o.value, o.label]));

export const PRAYER_LABELS = dict(PRACTICE_PRAYER_OPTIONS);
export const SECT_LABELS = dict(SECT_OPTIONS);
export const MARITAL_LABELS = dict(MARITAL_OPTIONS);
export const TIMELINE_LABELS = dict(TIMELINE_OPTIONS);
export const RELOCATE_LABELS = dict(RELOCATE_OPTIONS);
export const WANTS_CHILDREN_LABELS = dict(WANTS_CHILDREN_OPTIONS);

export function label(map: Record<string, string>, v: string | null): string {
  if (!v) return "—";
  return map[v] ?? v;
}

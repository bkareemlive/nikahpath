import type { SupabaseClient } from "@supabase/supabase-js";

export const REPORT_REASONS = [
  { value: "inappropriate", label: "Inappropriate content or photos" },
  { value: "fake", label: "Fake or misrepresented profile" },
  { value: "harassment", label: "Harassment or abuse" },
  { value: "not_serious", label: "Not serious about marriage" },
  { value: "off_platform", label: "Pushing to move off-platform too quickly" },
  { value: "other", label: "Something else" },
] as const;

/** Every profile id the user has blocked, or that has blocked the user. */
export async function blockedIdSet(
  supabase: SupabaseClient,
  me: string,
): Promise<Set<string>> {
  const { data } = await supabase
    .from("blocks")
    .select("blocker_id, blocked_id")
    .or(`blocker_id.eq.${me},blocked_id.eq.${me}`);
  const set = new Set<string>();
  for (const b of (data ?? []) as { blocker_id: string; blocked_id: string }[]) {
    set.add(b.blocker_id === me ? b.blocked_id : b.blocker_id);
  }
  return set;
}

/** True if either person has blocked the other. */
export async function isBlockedBetween(
  supabase: SupabaseClient,
  a: string,
  b: string,
): Promise<boolean> {
  const { count } = await supabase
    .from("blocks")
    .select("blocker_id", { count: "exact", head: true })
    .or(
      `and(blocker_id.eq.${a},blocked_id.eq.${b}),and(blocker_id.eq.${b},blocked_id.eq.${a})`,
    );
  return (count ?? 0) > 0;
}

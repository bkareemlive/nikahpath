import "server-only";

import { redirect } from "next/navigation";
import { createClient } from "./server";
import type { ProfileRow } from "./types";

/** Session + own profile, redirecting to /login when signed out. */
export async function getSessionAndProfile() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .maybeSingle<ProfileRow>();

  return { supabase, user, profile };
}

/** Same, but also sends unfinished profiles to /onboarding. */
export async function requireActiveProfile() {
  const ctx = await getSessionAndProfile();
  if (!ctx.profile || ctx.profile.status === "draft") redirect("/onboarding");
  if (ctx.profile.status === "suspended") redirect("/suspended");
  return ctx as {
    supabase: Awaited<ReturnType<typeof createClient>>;
    user: NonNullable<Awaited<ReturnType<typeof getSessionAndProfile>>["user"]>;
    profile: ProfileRow;
  };
}

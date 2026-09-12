import "server-only";

import { redirect } from "next/navigation";
import { createClient } from "./supabase/server";

/** Session + admin check, redirecting non-admins (and suspended admins) away. */
export async function requireAdmin() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login?next=/admin");

  const { data: isAdmin } = await supabase.rpc("is_admin");
  if (!isAdmin) redirect("/dashboard");

  const { data: profile } = await supabase
    .from("profiles")
    .select("status")
    .eq("id", user.id)
    .maybeSingle<{ status: string }>();
  if (profile?.status === "suspended") redirect("/suspended");

  return { supabase, user };
}

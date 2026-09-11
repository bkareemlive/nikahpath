import "server-only";

import { redirect } from "next/navigation";
import { createClient } from "./supabase/server";

/** Session + admin check, redirecting non-admins away. */
export async function requireAdmin() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login?next=/admin");

  const { data: isAdmin } = await supabase.rpc("is_admin");
  if (!isAdmin) redirect("/dashboard");

  return { supabase, user };
}

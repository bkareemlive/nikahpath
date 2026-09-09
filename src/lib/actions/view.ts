"use server";

import { createClient } from "@/lib/supabase/server";

/** Records that the current user looked at `viewedId`'s profile. Idempotent. */
export async function recordProfileView(viewedId: string): Promise<void> {
  if (!/^[0-9a-fA-F-]{36}$/.test(viewedId)) return;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user || user.id === viewedId) return;

  await supabase.from("profile_views").upsert(
    {
      viewer_id: user.id,
      viewed_id: viewedId,
      viewed_at: new Date().toISOString(),
    },
    { onConflict: "viewer_id,viewed_id" },
  );
}

"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";

export type InterestState = { error?: string; ok?: boolean };

const MONTHLY_LIMIT = 10;

export async function sendInterest(
  _prev: InterestState,
  formData: FormData,
): Promise<InterestState> {
  const recipient = z.string().uuid().safeParse(formData.get("recipient_id"));
  if (!recipient.success) return { error: "Something went wrong. Try again." };
  const message = z
    .string()
    .trim()
    .max(500)
    .optional()
    .parse((formData.get("message") as string) || undefined);

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Please sign in again." };
  if (user.id === recipient.data) return { error: "That is your own profile." };

  const { data: me } = await supabase
    .from("profiles")
    .select("plan")
    .eq("id", user.id)
    .maybeSingle<{ plan: string }>();
  const plan = me?.plan ?? "free";

  if (plan === "free") {
    return { error: "Upgrade to Full Access or Lifetime to send interest requests." };
  }
  if (plan === "full_access") {
    const since = new Date();
    since.setDate(since.getDate() - 30);
    const { count } = await supabase
      .from("interest_requests")
      .select("id", { count: "exact", head: true })
      .eq("sender_id", user.id)
      .gte("created_at", since.toISOString());
    if ((count ?? 0) >= MONTHLY_LIMIT) {
      return { error: `You have used all ${MONTHLY_LIMIT} requests for this month.` };
    }
  }

  const { error } = await supabase.from("interest_requests").insert({
    sender_id: user.id,
    recipient_id: recipient.data,
    message: message || null,
  });

  if (error) {
    if (error.code === "23505") return { error: "You have already expressed interest." };
    return { error: error.message };
  }

  revalidatePath(`/browse/${recipient.data}`);
  return { ok: true };
}

"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { limitsFor } from "@/lib/plan";

export type InterestState = { error?: string; ok?: boolean };
export type RespondState = { error?: string; ok?: boolean; matched?: boolean };

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
  const limits = limitsFor(me?.plan);

  if (limits.interestRequestsPerMonth === 0) {
    return { error: "Upgrade to Full Access or Lifetime to send interest requests." };
  }
  if (limits.interestRequestsPerMonth !== null) {
    const since = new Date();
    since.setDate(since.getDate() - 30);
    const { count } = await supabase
      .from("interest_requests")
      .select("id", { count: "exact", head: true })
      .eq("sender_id", user.id)
      .gte("created_at", since.toISOString());
    if ((count ?? 0) >= limits.interestRequestsPerMonth) {
      return {
        error: `You have used all ${limits.interestRequestsPerMonth} requests for this month.`,
      };
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

const idSchema = z.string().uuid();

/** Recipient accepts or declines an incoming interest request. */
export async function respondToRequest(
  _prev: RespondState,
  formData: FormData,
): Promise<RespondState> {
  const requestId = idSchema.safeParse(formData.get("request_id"));
  const decision = formData.get("decision");
  if (!requestId.success || (decision !== "accept" && decision !== "decline")) {
    return { error: "Something went wrong. Try again." };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Please sign in again." };

  if (decision === "accept") {
    const { error } = await supabase.rpc("accept_interest_request", {
      request_id: requestId.data,
    });
    if (error) return { error: error.message };
    revalidatePath("/requests");
    revalidatePath("/matches");
    return { ok: true, matched: true };
  }

  const { error } = await supabase
    .from("interest_requests")
    .update({ status: "declined", responded_at: new Date().toISOString() })
    .eq("id", requestId.data)
    .eq("recipient_id", user.id)
    .eq("status", "pending");
  if (error) return { error: error.message };
  revalidatePath("/requests");
  return { ok: true };
}

/** Sender withdraws a pending request they made. */
export async function withdrawRequest(
  _prev: RespondState,
  formData: FormData,
): Promise<RespondState> {
  const requestId = idSchema.safeParse(formData.get("request_id"));
  if (!requestId.success) return { error: "Something went wrong. Try again." };

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Please sign in again." };

  const { error } = await supabase
    .from("interest_requests")
    .update({ status: "withdrawn", responded_at: new Date().toISOString() })
    .eq("id", requestId.data)
    .eq("sender_id", user.id)
    .eq("status", "pending");
  if (error) return { error: error.message };
  revalidatePath("/requests");
  return { ok: true };
}

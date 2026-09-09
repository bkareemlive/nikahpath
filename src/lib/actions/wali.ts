"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";

export type WaliRespondState = { error?: string; ok?: boolean };

const schema = z
  .object({
    request_id: z.string().uuid(),
    decision: z.enum(["accept", "decline"]),
    scope: z.string().trim().max(600).optional().or(z.literal("")),
    duration: z.string().trim().max(200).optional().or(z.literal("")),
    fee: z.string().trim().max(200).optional().or(z.literal("")),
    agree: z.string().optional(),
  })
  .superRefine((v, ctx) => {
    if (v.decision === "accept") {
      if (v.agree !== "on")
        ctx.addIssue({ code: "custom", path: ["agree"], message: "Confirm you will act under the guided rules." });
      if (!v.scope || v.scope.trim().length < 10)
        ctx.addIssue({ code: "custom", path: ["scope"], message: "State the scope of your representation." });
    }
  });

export async function respondToWaliRequest(
  _prev: WaliRespondState,
  formData: FormData,
): Promise<WaliRespondState> {
  const parsed = schema.safeParse({
    request_id: formData.get("request_id"),
    decision: formData.get("decision"),
    scope: formData.get("scope"),
    duration: formData.get("duration"),
    fee: formData.get("fee"),
    agree: formData.get("agree"),
  });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Please check the form." };
  }
  const v = parsed.data;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Please sign in again." };

  // Confirm the caller is the listed Wali for this request.
  const { data: reqRow } = await supabase
    .from("wali_requests")
    .select("id, status, wali:independent_walis(user_id)")
    .eq("id", v.request_id)
    .maybeSingle<{
      id: string;
      status: string;
      wali: { user_id: string | null } | { user_id: string | null }[] | null;
    }>();

  const wali = Array.isArray(reqRow?.wali) ? reqRow?.wali[0] : reqRow?.wali;
  if (!reqRow || wali?.user_id !== user.id) return { error: "Not authorised." };
  if (reqRow.status !== "pending") return { error: "This request has already been answered." };

  const patch =
    v.decision === "accept"
      ? {
          status: "accepted" as const,
          responded_at: new Date().toISOString(),
          scope_agreed: v.scope || null,
          duration_agreed: v.duration || null,
          fee_agreed: v.fee || null,
        }
      : { status: "declined" as const, responded_at: new Date().toISOString() };

  const { error } = await supabase
    .from("wali_requests")
    .update(patch)
    .eq("id", v.request_id)
    .eq("status", "pending");
  if (error) return { error: error.message };

  revalidatePath("/wali");
  revalidatePath("/requests");
  return { ok: true };
}

/** End an accepted engagement (either the wali stepping aside). */
export async function endWaliEngagement(
  _prev: WaliRespondState,
  formData: FormData,
): Promise<WaliRespondState> {
  const requestId = z.string().uuid().safeParse(formData.get("request_id"));
  if (!requestId.success) return { error: "Something went wrong." };

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Please sign in again." };

  const { data: reqRow } = await supabase
    .from("wali_requests")
    .select("id, wali:independent_walis(user_id)")
    .eq("id", requestId.data)
    .maybeSingle<{
      id: string;
      wali: { user_id: string | null } | { user_id: string | null }[] | null;
    }>();
  const wali = Array.isArray(reqRow?.wali) ? reqRow?.wali[0] : reqRow?.wali;
  if (!reqRow || wali?.user_id !== user.id) return { error: "Not authorised." };

  const { error } = await supabase
    .from("wali_requests")
    .update({ status: "ended", responded_at: new Date().toISOString() })
    .eq("id", requestId.data)
    .eq("status", "accepted");
  if (error) return { error: error.message };

  revalidatePath("/wali");
  revalidatePath("/requests");
  return { ok: true };
}

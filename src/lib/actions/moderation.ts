"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { REPORT_REASONS } from "@/lib/moderation";

export type ModState = { error?: string; ok?: boolean };

const reasonValues = REPORT_REASONS.map((r) => r.value) as [string, ...string[]];

function revalidateAround(targetId?: string) {
  revalidatePath("/browse");
  revalidatePath("/matches");
  revalidatePath("/requests");
  revalidatePath("/account");
  if (targetId) {
    revalidatePath(`/browse/${targetId}`);
  }
}

export async function blockMember(
  _prev: ModState,
  formData: FormData,
): Promise<ModState> {
  const target = z.string().uuid().safeParse(formData.get("target_id"));
  if (!target.success) return { error: "Something went wrong." };

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Please sign in again." };
  if (user.id === target.data) return { error: "That is your own profile." };

  const { error } = await supabase
    .from("blocks")
    .upsert(
      { blocker_id: user.id, blocked_id: target.data },
      { onConflict: "blocker_id,blocked_id" },
    );
  if (error) return { error: error.message };

  revalidateAround(target.data);
  return { ok: true };
}

export async function unblockMember(
  _prev: ModState,
  formData: FormData,
): Promise<ModState> {
  const target = z.string().uuid().safeParse(formData.get("target_id"));
  if (!target.success) return { error: "Something went wrong." };

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Please sign in again." };

  const { error } = await supabase
    .from("blocks")
    .delete()
    .eq("blocker_id", user.id)
    .eq("blocked_id", target.data);
  if (error) return { error: error.message };

  revalidateAround(target.data);
  return { ok: true };
}

export async function reportMember(
  _prev: ModState,
  formData: FormData,
): Promise<ModState> {
  const parsed = z
    .object({
      target_id: z.string().uuid(),
      reason: z.enum(reasonValues),
      detail: z.string().trim().max(1000).optional().or(z.literal("")),
      also_block: z.string().optional(),
    })
    .safeParse({
      target_id: formData.get("target_id"),
      reason: formData.get("reason"),
      detail: formData.get("detail") ?? undefined,
      also_block: formData.get("also_block") ?? undefined,
    });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Choose a reason." };
  }
  const v = parsed.data;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Please sign in again." };
  if (user.id === v.target_id) return { error: "That is your own profile." };

  const { error } = await supabase.from("reports").insert({
    reporter_id: user.id,
    reported_id: v.target_id,
    reason: v.reason,
    detail: v.detail || null,
  });
  if (error) return { error: error.message };

  if (v.also_block === "on") {
    await supabase
      .from("blocks")
      .upsert(
        { blocker_id: user.id, blocked_id: v.target_id },
        { onConflict: "blocker_id,blocked_id" },
      );
  }

  revalidateAround(v.target_id);
  return { ok: true };
}

"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";

export type SavedState = { error?: string; ok?: boolean };

function revalidateAround(targetId: string) {
  revalidatePath("/shortlist");
  revalidatePath(`/browse/${targetId}`);
  revalidatePath("/browse");
}

export async function saveProfile(
  _prev: SavedState,
  formData: FormData,
): Promise<SavedState> {
  const target = z.string().uuid().safeParse(formData.get("target_id"));
  if (!target.success) return { error: "Something went wrong." };

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Please sign in again." };
  if (user.id === target.data) return { error: "That is your own profile." };

  const { error } = await supabase
    .from("saved_profiles")
    .upsert(
      { user_id: user.id, saved_id: target.data },
      { onConflict: "user_id,saved_id" },
    );
  if (error) return { error: error.message };

  revalidateAround(target.data);
  return { ok: true };
}

export async function unsaveProfile(
  _prev: SavedState,
  formData: FormData,
): Promise<SavedState> {
  const target = z.string().uuid().safeParse(formData.get("target_id"));
  if (!target.success) return { error: "Something went wrong." };

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Please sign in again." };

  const { error } = await supabase
    .from("saved_profiles")
    .delete()
    .eq("user_id", user.id)
    .eq("saved_id", target.data);
  if (error) return { error: error.message };

  revalidateAround(target.data);
  return { ok: true };
}

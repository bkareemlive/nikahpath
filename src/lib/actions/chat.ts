"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { isBlockedBetween } from "@/lib/moderation";
import type { MessageRow } from "@/lib/supabase/types";

export type SendState = { error?: string; message?: MessageRow };

const uuid = z.string().uuid();

/** Marks every unread message the other side sent in this match as read. */
export async function markMatchRead(matchId: string): Promise<void> {
  if (!uuid.safeParse(matchId).success) return;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return;

  const { error } = await supabase
    .from("messages")
    .update({ read_at: new Date().toISOString() })
    .eq("match_id", matchId)
    .neq("sender_id", user.id)
    .is("read_at", null);
  if (error) return;

  revalidatePath("/matches");
}

const schema = z.object({
  match_id: z.string().uuid(),
  body: z.string().trim().min(1, "Write a message.").max(4000),
});

export async function sendMessage(
  _prev: SendState,
  formData: FormData,
): Promise<SendState> {
  const parsed = schema.safeParse({
    match_id: formData.get("match_id"),
    body: formData.get("body"),
  });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Could not send." };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Please sign in again." };

  const { data: match } = await supabase
    .from("matches")
    .select("a_id, b_id")
    .eq("id", parsed.data.match_id)
    .maybeSingle<{ a_id: string; b_id: string }>();
  if (match) {
    const otherId = match.a_id === user.id ? match.b_id : match.a_id;
    if (await isBlockedBetween(supabase, user.id, otherId)) {
      return { error: "This conversation is closed." };
    }
  }

  const { data, error } = await supabase
    .from("messages")
    .insert({
      match_id: parsed.data.match_id,
      sender_id: user.id,
      body: parsed.data.body,
    })
    .select("*")
    .single<MessageRow>();

  if (error) return { error: error.message };
  return { message: data };
}

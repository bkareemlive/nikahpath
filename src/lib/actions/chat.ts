"use server";

import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import type { MessageRow } from "@/lib/supabase/types";

export type SendState = { error?: string; message?: MessageRow };

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

"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";

export type AccountState = { error?: string; message?: string };

async function siteOrigin() {
  const fromEnv = process.env.NEXT_PUBLIC_SITE_URL;
  if (fromEnv) return fromEnv.replace(/\/$/, "");
  const h = await headers();
  const host = h.get("x-forwarded-host") ?? h.get("host");
  const proto = h.get("x-forwarded-proto") ?? "http";
  return `${proto}://${host}`;
}

export async function changePassword(
  _prev: AccountState,
  formData: FormData,
): Promise<AccountState> {
  const parsed = z
    .object({
      password: z.string().min(8, "Use at least 8 characters.").max(72),
      confirm: z.string(),
    })
    .refine((v) => v.password === v.confirm, {
      message: "The two passwords do not match.",
      path: ["confirm"],
    })
    .safeParse({
      password: formData.get("password"),
      confirm: formData.get("confirm"),
    });
  if (!parsed.success) return { error: parsed.error.issues[0].message };

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { error } = await supabase.auth.updateUser({ password: parsed.data.password });
  if (error) return { error: error.message };
  return { message: "Password updated." };
}

export async function changeEmail(
  _prev: AccountState,
  formData: FormData,
): Promise<AccountState> {
  const parsed = z
    .string()
    .trim()
    .toLowerCase()
    .email("Enter a valid email address.")
    .safeParse(formData.get("email"));
  if (!parsed.success) return { error: parsed.error.issues[0].message };

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");
  if (parsed.data === user.email) return { error: "That is already your email address." };

  const origin = await siteOrigin();
  const { error } = await supabase.auth.updateUser(
    { email: parsed.data },
    { emailRedirectTo: `${origin}/auth/callback?next=/account` },
  );
  if (error) return { error: error.message };
  return {
    message:
      "Confirmation links have been sent. Open the link in your new inbox to finish the change.",
  };
}

export async function closeAccount(
  _prev: AccountState,
  formData: FormData,
): Promise<AccountState> {
  if (formData.get("confirm") !== "DELETE") {
    return { error: 'Type DELETE to confirm.' };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_SUPABASE_URL}/auth/v1/admin/users/${user.id}`,
    {
      method: "DELETE",
      headers: {
        apikey: process.env.SUPABASE_SERVICE_ROLE_KEY!,
        Authorization: `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY}`,
      },
    },
  );
  if (!res.ok) {
    return { error: "Could not close the account. Please contact support." };
  }

  await supabase.auth.signOut();
  redirect("/");
}

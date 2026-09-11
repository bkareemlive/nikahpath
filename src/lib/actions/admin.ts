"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";

export type AdminState = { error?: string; ok?: boolean };

const reportStatusValues = ["open", "reviewing", "actioned", "dismissed"] as const;

async function assertAdmin() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { supabase, isAdmin: false as const };
  const { data: isAdmin } = await supabase.rpc("is_admin");
  return { supabase, isAdmin: Boolean(isAdmin) };
}

function revalidateAdmin(memberId?: string) {
  revalidatePath("/admin");
  revalidatePath("/admin/reports");
  if (memberId) revalidatePath(`/admin/members/${memberId}`);
}

/** Change a report's triage status (open / reviewing / actioned / dismissed). */
export async function setReportStatus(
  _prev: AdminState,
  formData: FormData,
): Promise<AdminState> {
  const parsed = z
    .object({
      report_id: z.string().uuid(),
      status: z.enum(reportStatusValues),
      reported_id: z.string().uuid().optional(),
    })
    .safeParse({
      report_id: formData.get("report_id"),
      status: formData.get("status"),
      reported_id: formData.get("reported_id") || undefined,
    });
  if (!parsed.success) return { error: "Something went wrong." };

  const { supabase, isAdmin } = await assertAdmin();
  if (!isAdmin) return { error: "Admins only." };

  const { error } = await supabase
    .from("reports")
    .update({ status: parsed.data.status })
    .eq("id", parsed.data.report_id);
  if (error) return { error: error.message };

  revalidateAdmin(parsed.data.reported_id);
  return { ok: true };
}

/** Suspend a member: hides them from the app and locks them out. */
export async function suspendMember(
  _prev: AdminState,
  formData: FormData,
): Promise<AdminState> {
  const target = z.string().uuid().safeParse(formData.get("member_id"));
  if (!target.success) return { error: "Something went wrong." };

  const { supabase, isAdmin } = await assertAdmin();
  if (!isAdmin) return { error: "Admins only." };

  const { error } = await supabase
    .from("profiles")
    .update({ status: "suspended" })
    .eq("id", target.data);
  if (error) return { error: error.message };

  // If suspending directly from a report row, also mark it actioned.
  const reportId = formData.get("report_id");
  if (typeof reportId === "string" && reportId) {
    await supabase.from("reports").update({ status: "actioned" }).eq("id", reportId);
  }

  revalidateAdmin(target.data);
  return { ok: true };
}

/** Lift a suspension, returning the member to active. */
export async function reactivateMember(
  _prev: AdminState,
  formData: FormData,
): Promise<AdminState> {
  const target = z.string().uuid().safeParse(formData.get("member_id"));
  if (!target.success) return { error: "Something went wrong." };

  const { supabase, isAdmin } = await assertAdmin();
  if (!isAdmin) return { error: "Admins only." };

  const { error } = await supabase
    .from("profiles")
    .update({ status: "active" })
    .eq("id", target.data);
  if (error) return { error: error.message };

  revalidateAdmin(target.data);
  return { ok: true };
}

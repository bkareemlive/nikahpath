"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import {
  COUNTRIES,
  PRACTICE_PRAYER_OPTIONS,
  SECT_OPTIONS,
  MARITAL_OPTIONS,
  BUILD_OPTIONS,
  TIMELINE_OPTIONS,
  RELOCATE_OPTIONS,
  WANTS_CHILDREN_OPTIONS,
  WALI_TYPE_OPTIONS,
} from "@/lib/profile-options";

export type ProfileFormState = { error?: string; ok?: boolean };

const values = <T extends readonly { value: string }[]>(opts: T) =>
  opts.map((o) => o.value) as [string, ...string[]];

const trimmed = (max: number) => z.string().trim().max(max);

function ageFrom(dob: string): number | null {
  const d = new Date(dob + "T00:00:00Z");
  if (Number.isNaN(d.getTime())) return null;
  const now = new Date();
  let age = now.getUTCFullYear() - d.getUTCFullYear();
  const m = now.getUTCMonth() - d.getUTCMonth();
  if (m < 0 || (m === 0 && now.getUTCDate() < d.getUTCDate())) age--;
  return age;
}

// Fields shared by onboarding and profile editing (everything except gender).
const commonShape = {
  alias: trimmed(40).optional().or(z.literal("")),
  date_of_birth: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Enter your date of birth."),
  ethnicity: trimmed(60).min(2, "Tell us your ethnic background."),
  location_country: z.enum(COUNTRIES as unknown as [string, ...string[]]),
  location_city: trimmed(80).min(2, "Which city or area?"),
  marital_status: z.enum(values(MARITAL_OPTIONS)),
  has_children: z.enum(["yes", "no"]),
  children_note: trimmed(300).optional().or(z.literal("")),
  timeline: z.enum(values(TIMELINE_OPTIONS)),
  relocate: z.enum(values(RELOCATE_OPTIONS)),
  wants_children: z.enum(values(WANTS_CHILDREN_OPTIONS)),
  practice_prayer: z.enum(values(PRACTICE_PRAYER_OPTIONS)),
  sect: z.enum(values(SECT_OPTIONS)),
  height_cm: z
    .string()
    .optional()
    .transform((v) => (v && v.trim() !== "" ? Number(v) : null))
    .refine(
      (v) => v === null || (Number.isFinite(v) && v >= 120 && v <= 230),
      "Height should be between 120 and 230 cm.",
    ),
  build: z.enum(BUILD_OPTIONS as unknown as [string, ...string[]]).optional().or(z.literal("")),
  about: trimmed(4000).min(120, "Please write at least a short paragraph (120+ characters)."),
  looking_for: trimmed(2000).min(60, "A sentence or two about what you're looking for."),
  wali_type: z.enum(values(WALI_TYPE_OPTIONS)).optional().or(z.literal("")),
  wali_name: trimmed(80).optional().or(z.literal("")),
  wali_relationship: trimmed(40).optional().or(z.literal("")),
  independent_wali_id: z
    .string()
    .optional()
    .transform((v) => (v && v.trim() !== "" ? v.trim() : ""))
    .refine(
      (v) => v === "" || /^[0-9a-fA-F-]{36}$/.test(v),
      "Pick a Wali from the register.",
    ),
};

type Common = z.infer<z.ZodObject<typeof commonShape>>;

function checkAge(v: { date_of_birth: string }, ctx: z.RefinementCtx) {
  const age = ageFrom(v.date_of_birth);
  if (age === null || age < 18)
    ctx.addIssue({ code: "custom", path: ["date_of_birth"], message: "You must be at least 18." });
  else if (age > 100)
    ctx.addIssue({ code: "custom", path: ["date_of_birth"], message: "Please check your date of birth." });
}

function sisterGuardianError(v: Common): string | null {
  if (!v.wali_type) return "Choose how your guardian is arranged.";
  if (v.wali_type === "family" && (!v.wali_name || !v.wali_relationship))
    return "Add your guardian's name and relationship.";
  if (v.wali_type === "independent" && !v.independent_wali_id)
    return "Pick a Wali from the register.";
  return null;
}

function mapProfile(v: Common, isSister: boolean) {
  return {
    last_active_at: new Date().toISOString(),
    alias: v.alias || null,
    date_of_birth: v.date_of_birth,
    ethnicity: v.ethnicity,
    location_country: v.location_country,
    location_city: v.location_city,
    marital_status: v.marital_status as "never_married" | "divorced" | "widowed",
    category: (v.marital_status === "widowed" ? "widowed" : "standard") as "standard" | "widowed",
    has_children: v.has_children === "yes",
    children_note: v.children_note || null,
    timeline: v.timeline,
    relocate: v.relocate,
    wants_children: v.wants_children,
    practice_prayer: v.practice_prayer,
    sect: v.sect,
    height_cm: v.height_cm,
    build: v.build || null,
    about: v.about,
    looking_for: v.looking_for,
    wali_type: (isSister ? v.wali_type || "none_yet" : "family") as
      | "family"
      | "independent"
      | "none_yet",
    wali_name: isSister && v.wali_type === "family" ? v.wali_name || null : null,
    wali_relationship:
      isSister && v.wali_type === "family" ? v.wali_relationship || null : null,
    independent_wali_id:
      isSister && v.wali_type === "independent" ? v.independent_wali_id || null : null,
  };
}

// ---------------------------------------------------------------------------
// Onboarding — creates the profile, sets it active, then goes to the dashboard.
// ---------------------------------------------------------------------------
const onboardingSchema = z
  .object({ gender: z.enum(["sister", "brother"]), ...commonShape })
  .superRefine((v, ctx) => {
    checkAge(v, ctx);
    if (v.gender === "sister") {
      const err = sisterGuardianError(v);
      if (err) ctx.addIssue({ code: "custom", path: ["wali_type"], message: err });
    }
  });

export async function completeOnboarding(
  _prev: ProfileFormState,
  formData: FormData,
): Promise<ProfileFormState> {
  const parsed = onboardingSchema.safeParse(Object.fromEntries(formData.entries()));
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Please check the form." };
  }
  const v = parsed.data;
  const isSister = v.gender === "sister";

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { error } = await supabase
    .from("profiles")
    .update({ ...mapProfile(v, isSister), gender: v.gender, status: "active" })
    .eq("id", user.id);
  if (error) return { error: error.message };

  if (isSister && v.wali_type === "independent" && v.independent_wali_id) {
    await supabase
      .from("wali_requests")
      .upsert(
        { sister_id: user.id, wali_id: v.independent_wali_id, status: "pending" },
        { onConflict: "sister_id,wali_id" },
      );
  }

  redirect("/dashboard");
}

// ---------------------------------------------------------------------------
// Profile editing — updates fields in place, keeps you on the page.
// ---------------------------------------------------------------------------
const editSchema = z
  .object({
    ...commonShape,
    status: z.enum(["active", "paused"]).optional().or(z.literal("")),
  })
  .superRefine((v, ctx) => checkAge(v, ctx));

export async function saveProfile(
  _prev: ProfileFormState,
  formData: FormData,
): Promise<ProfileFormState> {
  const parsed = editSchema.safeParse(Object.fromEntries(formData.entries()));
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Please check the form." };
  }
  const v = parsed.data;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: existing } = await supabase
    .from("profiles")
    .select("gender, independent_wali_id")
    .eq("id", user.id)
    .maybeSingle<{ gender: "sister" | "brother" | null; independent_wali_id: string | null }>();

  const isSister = existing?.gender === "sister";
  if (isSister) {
    const err = sisterGuardianError(v);
    if (err) return { error: err };
  }

  const nextStatus =
    v.status === "active" || v.status === "paused" ? v.status : undefined;

  const { error } = await supabase
    .from("profiles")
    .update({ ...mapProfile(v, isSister), ...(nextStatus ? { status: nextStatus } : {}) })
    .eq("id", user.id);
  if (error) return { error: error.message };

  if (
    isSister &&
    v.wali_type === "independent" &&
    v.independent_wali_id &&
    v.independent_wali_id !== existing?.independent_wali_id
  ) {
    await supabase
      .from("wali_requests")
      .upsert(
        { sister_id: user.id, wali_id: v.independent_wali_id, status: "pending" },
        { onConflict: "sister_id,wali_id" },
      );
  }

  revalidatePath("/profile");
  revalidatePath("/dashboard");
  return { ok: true };
}

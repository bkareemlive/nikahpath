import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type { ProfileRow, IndependentWaliRow } from "@/lib/supabase/types";
import { OnboardingWizard } from "@/components/onboarding/Wizard";

export const metadata: Metadata = { title: "Set up your profile" };

export default async function OnboardingPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .maybeSingle<ProfileRow>();

  if (profile?.status && profile.status !== "draft") {
    redirect("/dashboard");
  }

  const { data: walis } = await supabase
    .from("independent_walis")
    .select("id, name, role, location, availability")
    .eq("active", true)
    .order("name")
    .returns<
      Pick<IndependentWaliRow, "id" | "name" | "role" | "location" | "availability">[]
    >();

  return (
    <div className="mx-auto max-w-xl">
      <h1 className="font-display text-3xl font-semibold text-ink">
        Set up your profile
      </h1>
      <p className="mt-2 text-sm leading-relaxed text-muted">
        A short set of questions about your practice, your family situation, and
        what you are looking for. It is what other members read before deciding to
        reach out. You can edit any of it later.
      </p>

      <div className="mt-8">
        <OnboardingWizard walis={walis ?? []} />
      </div>
    </div>
  );
}

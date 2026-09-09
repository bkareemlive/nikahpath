import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type { ProfileRow } from "@/lib/supabase/types";

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

  return (
    <div className="rounded-2xl border border-line bg-white p-8 shadow-card">
      <h1 className="font-display text-2xl font-semibold text-ink">
        Let&apos;s set up your profile
      </h1>
      <p className="mt-2 text-sm leading-relaxed text-muted">
        Next you&apos;ll answer a short set of questions about your practice, your
        family situation, and what you are looking for in a spouse — the guided
        profile form. It is what other members read before deciding to reach out.
      </p>
      <p className="mt-4 rounded-md bg-cream px-3 py-2 text-xs text-muted">
        The onboarding wizard is being built. Your account is ready and signed
        in.
      </p>
    </div>
  );
}

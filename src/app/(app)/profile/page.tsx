import type { Metadata } from "next";
import Link from "next/link";
import { requireActiveProfile } from "@/lib/supabase/queries";
import type { IndependentWaliRow } from "@/lib/supabase/types";
import { ProfileForm } from "@/components/profile/ProfileForm";

export const metadata: Metadata = { title: "My profile" };

export default async function ProfilePage() {
  const { supabase, profile } = await requireActiveProfile();

  const { data: walis } = await supabase
    .from("independent_walis")
    .select("id, name, role, location, availability")
    .eq("active", true)
    .order("name")
    .returns<
      Pick<IndependentWaliRow, "id" | "name" | "role" | "location" | "availability">[]
    >();

  return (
    <div>
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h1 className="font-display text-3xl font-semibold text-ink">My profile</h1>
        {profile.status === "paused" && (
          <span className="rounded-full bg-cream-deep px-2.5 py-1 text-xs font-medium text-body">
            Paused, hidden from Browse
          </span>
        )}
      </div>
      <p className="mt-1 text-sm text-muted">
        Everything here is what other members read. Keep it accurate; you can
        change it any time.{" "}
        <Link href="/dashboard" className="font-medium text-primary hover:underline">
          Back to dashboard
        </Link>
      </p>

      <div className="mt-8">
        <ProfileForm profile={profile} walis={walis ?? []} />
      </div>
    </div>
  );
}

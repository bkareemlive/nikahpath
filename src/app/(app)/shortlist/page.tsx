import type { Metadata } from "next";
import Link from "next/link";
import { requireActiveProfile } from "@/lib/supabase/queries";
import type { ProfileRow } from "@/lib/supabase/types";
import { blockedIdSet } from "@/lib/moderation";
import { MemberCard } from "@/components/app/MemberCard";
import { SaveToggle } from "@/components/app/SaveToggle";

export const metadata: Metadata = { title: "Shortlist" };

type SavedJoined = {
  saved_id: string;
  created_at: string;
  profile: ProfileRow | ProfileRow[] | null;
};

const one = <T,>(v: T | T[] | null): T | null =>
  v == null ? null : Array.isArray(v) ? (v[0] ?? null) : v;

export default async function ShortlistPage() {
  const { supabase, user } = await requireActiveProfile();

  const { data: rows } = await supabase
    .from("saved_profiles")
    .select("saved_id, created_at, profile:saved_id(*)")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .returns<SavedJoined[]>();

  const blocked = await blockedIdSet(supabase, user.id);
  const profiles = (rows ?? [])
    .map((r) => one(r.profile))
    .filter(
      (p): p is ProfileRow =>
        p !== null && p.status === "active" && !blocked.has(p.id),
    );

  return (
    <div>
      <h1 className="font-display text-3xl font-semibold text-ink">Shortlist</h1>
      <p className="mt-1 text-sm text-muted">
        Profiles you saved from Browse to revisit later.
      </p>

      {profiles.length === 0 ? (
        <div className="mt-8 rounded-xl border border-line bg-white p-8 text-center text-sm text-muted">
          Nothing saved yet.{" "}
          <Link href="/browse" className="font-medium text-primary hover:underline">
            Browse members →
          </Link>
        </div>
      ) : (
        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          {profiles.map((p) => (
            <div key={p.id} className="flex flex-col gap-2">
              <MemberCard p={p} />
              <div className="flex justify-end">
                <SaveToggle targetId={p.id} saved />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

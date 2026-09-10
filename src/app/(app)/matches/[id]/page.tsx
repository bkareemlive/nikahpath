import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { requireActiveProfile } from "@/lib/supabase/queries";
import { ageFromDob } from "@/lib/profile-display";
import { limitsFor, NUDGE_COOLDOWN_HOURS } from "@/lib/plan";
import { isoDaysAgo } from "@/lib/time";
import type { MessageRow, ProfileRow } from "@/lib/supabase/types";
import { ChatThread } from "@/components/app/ChatThread";
import { NudgeButton } from "@/components/app/NudgeButton";
import { ReportBlockMenu } from "@/components/app/ReportBlockMenu";

export const metadata: Metadata = { title: "Conversation" };

type MatchRow = { id: string; a_id: string; b_id: string; status: string };

export default async function ConversationPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const { supabase, user, profile } = await requireActiveProfile();

  const { data: match } = await supabase
    .from("matches")
    .select("id, a_id, b_id, status")
    .eq("id", id)
    .maybeSingle<MatchRow>();

  if (!match || (match.a_id !== user.id && match.b_id !== user.id)) notFound();

  const otherId = match.a_id === user.id ? match.b_id : match.a_id;

  const [{ data: other }, { data: initial }] = await Promise.all([
    supabase
      .from("profiles")
      .select(
        "id, alias, public_ref, gender, date_of_birth, location_city, location_country, wali_type, wali_name, wali_relationship, wali_contact",
      )
      .eq("id", otherId)
      .maybeSingle<
        Pick<
          ProfileRow,
          | "id"
          | "alias"
          | "public_ref"
          | "gender"
          | "date_of_birth"
          | "location_city"
          | "location_country"
          | "wali_type"
          | "wali_name"
          | "wali_relationship"
          | "wali_contact"
        >
      >(),
    supabase
      .from("messages")
      .select("id, match_id, sender_id, body, created_at, read_at")
      .eq("match_id", id)
      .order("created_at", { ascending: true })
      .limit(200)
      .returns<MessageRow[]>(),
  ]);

  if (!other) notFound();

  const { data: blockRows } = await supabase
    .from("blocks")
    .select("blocker_id, blocked_id")
    .or(
      `and(blocker_id.eq.${user.id},blocked_id.eq.${otherId}),and(blocker_id.eq.${otherId},blocked_id.eq.${user.id})`,
    )
    .returns<{ blocker_id: string; blocked_id: string }[]>();
  const iBlockedThem = (blockRows ?? []).some((b) => b.blocker_id === user.id);
  const blockedEitherWay = (blockRows ?? []).length > 0;

  const { count: nudgedYou } = await supabase
    .from("nudges")
    .select("id", { count: "exact", head: true })
    .eq("sender_id", otherId)
    .eq("recipient_id", user.id)
    .gte("created_at", isoDaysAgo(7));

  const canNudge = limitsFor(profile.plan).sendNudges;
  const age = ageFromDob(other.date_of_birth);
  const showWali =
    other.gender === "sister" && other.wali_type === "family" && (other.wali_name || other.wali_contact);

  return (
    <div>
      <Link href="/matches" className="text-sm font-medium text-primary hover:underline">
        ← All matches
      </Link>

      <div className="mt-4 flex flex-wrap items-baseline justify-between gap-2">
        <h1 className="font-display text-2xl font-semibold text-ink">
          {other.alias ? `${other.alias} · ${other.public_ref}` : other.public_ref}
        </h1>
        <div className="flex items-center gap-3">
          {canNudge && !blockedEitherWay && (
            <NudgeButton
              recipientId={other.id}
              redirectPath={`/matches/${id}`}
            />
          )}
          <Link href={`/browse/${other.id}`} className="text-sm font-medium text-primary hover:underline">
            View full profile →
          </Link>
          <ReportBlockMenu targetId={other.id} blocked={iBlockedThem} />
        </div>
      </div>
      <p className="mt-0.5 text-sm text-muted">
        {[age, [other.location_city, other.location_country].filter(Boolean).join(", ")]
          .filter(Boolean)
          .join(" · ")}
      </p>

      {(nudgedYou ?? 0) > 0 && (
        <p className="mt-3 rounded-lg border border-primary/25 bg-primary-light px-4 py-2.5 text-sm text-primary-dark">
          👋 They nudged you — a gentle reminder they&apos;re still keen. (Nudges
          can be sent once every {NUDGE_COOLDOWN_HOURS}h.)
        </p>
      )}

      {showWali && (
        <div className="mt-3 rounded-lg border border-line bg-cream px-4 py-3 text-sm">
          <span className="font-medium text-ink">Guardian:</span>{" "}
          {other.wali_name}
          {other.wali_relationship ? ` (${other.wali_relationship})` : ""}
          {other.wali_contact ? ` — ${other.wali_contact}` : ""}
        </div>
      )}

      {blockedEitherWay ? (
        <div className="mt-5 rounded-xl border border-line bg-white p-6 text-center text-sm text-muted">
          {iBlockedThem
            ? "You have blocked this member. Unblock to reopen the conversation."
            : "This conversation is closed."}
        </div>
      ) : (
        <div className="mt-5">
          <ChatThread matchId={id} meId={user.id} initial={initial ?? []} />
        </div>
      )}
    </div>
  );
}

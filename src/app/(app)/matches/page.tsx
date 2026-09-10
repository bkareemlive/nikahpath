import type { Metadata } from "next";
import Link from "next/link";
import { requireActiveProfile } from "@/lib/supabase/queries";
import { ageFromDob } from "@/lib/profile-display";
import { blockedIdSet } from "@/lib/moderation";
import type { MessageRow } from "@/lib/supabase/types";

export const metadata: Metadata = { title: "Matches" };

type Mini = {
  id: string;
  alias: string | null;
  public_ref: string | null;
  date_of_birth: string | null;
  location_city: string | null;
  location_country: string | null;
};
type MatchRowJoined = {
  id: string;
  created_at: string;
  status: string;
  a_id: string;
  b_id: string;
  a: Mini | Mini[] | null;
  b: Mini | Mini[] | null;
};

const one = <T,>(v: T | T[] | null): T | null =>
  v == null ? null : Array.isArray(v) ? (v[0] ?? null) : v;

function relTime(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const m = Math.round(diff / 60000);
  if (m < 1) return "just now";
  if (m < 60) return `${m}m ago`;
  const h = Math.round(m / 60);
  if (h < 24) return `${h}h ago`;
  return new Date(iso).toLocaleDateString([], { day: "numeric", month: "short" });
}

export default async function MatchesPage() {
  const { supabase, user } = await requireActiveProfile();
  const cols = "id, alias, public_ref, date_of_birth, location_city, location_country";

  const { data: rows } = await supabase
    .from("matches")
    .select(`id, created_at, status, a_id, b_id, a:a_id(${cols}), b:b_id(${cols})`)
    .or(`a_id.eq.${user.id},b_id.eq.${user.id}`)
    .eq("status", "active")
    .order("created_at", { ascending: false })
    .returns<MatchRowJoined[]>();

  const blocked = await blockedIdSet(supabase, user.id);
  const matches = (rows ?? []).filter((m) => {
    const otherId = m.a_id === user.id ? m.b_id : m.a_id;
    return !blocked.has(otherId);
  });

  const lastByMatch = new Map<string, MessageRow>();
  if (matches.length) {
    const { data: msgs } = await supabase
      .from("messages")
      .select("id, match_id, sender_id, body, created_at")
      .in(
        "match_id",
        matches.map((m) => m.id),
      )
      .order("created_at", { ascending: false })
      .returns<MessageRow[]>();
    for (const msg of msgs ?? []) {
      if (!lastByMatch.has(msg.match_id)) lastByMatch.set(msg.match_id, msg);
    }
  }

  return (
    <div>
      <h1 className="font-display text-3xl font-semibold text-ink">Matches</h1>
      <p className="mt-1 text-sm text-muted">
        Both of you expressed interest. Keep the conversation purposeful and
        involve the guardian as it gets serious.
      </p>

      {matches.length === 0 ? (
        <p className="mt-8 rounded-xl border border-line bg-white p-6 text-sm text-muted">
          No matches yet. When someone accepts your interest — or you accept
          theirs — the conversation opens here.
        </p>
      ) : (
        <ul className="mt-8 space-y-3">
          {matches.map((m) => {
            const other = one(m.a_id === user.id ? m.b : m.a);
            if (!other) return null;
            const last = lastByMatch.get(m.id);
            const age = ageFromDob(other.date_of_birth);
            return (
              <li key={m.id}>
                <Link
                  href={`/matches/${m.id}`}
                  className="flex items-center justify-between gap-4 rounded-xl border border-line bg-white p-4 shadow-card transition-colors hover:border-primary"
                >
                  <div className="min-w-0">
                    <p className="font-display text-lg font-semibold text-ink">
                      {other.alias ? `${other.alias} · ${other.public_ref}` : other.public_ref}
                    </p>
                    <p className="truncate text-sm text-muted">
                      {last
                        ? `${last.sender_id === user.id ? "You: " : ""}${last.body}`
                        : [
                            age,
                            [other.location_city, other.location_country]
                              .filter(Boolean)
                              .join(", "),
                          ]
                            .filter(Boolean)
                            .join(" · ")}
                    </p>
                  </div>
                  <span className="shrink-0 text-xs text-muted">
                    {relTime(last?.created_at ?? m.created_at)}
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

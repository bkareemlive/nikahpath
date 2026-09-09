import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getSessionAndProfile } from "@/lib/supabase/queries";
import { ageFromDob, label, MARITAL_LABELS } from "@/lib/profile-display";
import { independentWaliRules } from "@/data/walis";
import {
  WaliRequestActions,
  EndEngagementButton,
} from "@/components/app/WaliRequestActions";

export const metadata: Metadata = { title: "Guardian inbox" };

type SisterMini = {
  id: string;
  alias: string | null;
  public_ref: string | null;
  date_of_birth: string | null;
  ethnicity: string | null;
  location_city: string | null;
  location_country: string | null;
  marital_status: string | null;
  category: string;
  about: string | null;
  looking_for: string | null;
};
type WaliReqRow = {
  id: string;
  status: string;
  message: string | null;
  scope_agreed: string | null;
  duration_agreed: string | null;
  fee_agreed: string | null;
  created_at: string;
  sister: SisterMini | SisterMini[] | null;
};

const one = <T,>(v: T | T[] | null): T | null =>
  v == null ? null : Array.isArray(v) ? (v[0] ?? null) : v;

function SisterBlock({ s }: { s: SisterMini | null }) {
  if (!s) {
    return <p className="text-sm text-muted">This member&apos;s profile is not visible.</p>;
  }
  const age = ageFromDob(s.date_of_birth);
  return (
    <div>
      <Link
        href={`/browse/${s.id}`}
        className="font-display text-lg font-semibold text-ink hover:text-primary"
      >
        {s.alias ? `${s.alias} · ${s.public_ref}` : s.public_ref}
      </Link>
      <p className="mt-0.5 text-sm text-muted">
        {[
          age,
          s.ethnicity,
          [s.location_city, s.location_country].filter(Boolean).join(", "),
          label(MARITAL_LABELS, s.marital_status),
          s.category === "widowed" ? "Widowed" : null,
        ]
          .filter(Boolean)
          .join(" · ")}
      </p>
    </div>
  );
}

export default async function WaliInboxPage() {
  const { supabase, user } = await getSessionAndProfile();

  const { data: waliRows } = await supabase
    .from("independent_walis")
    .select("id, name")
    .eq("user_id", user.id)
    .returns<{ id: string; name: string }[]>();

  if (!waliRows || waliRows.length === 0) redirect("/dashboard");
  const waliIds = waliRows.map((w) => w.id);

  const { data: reqs } = await supabase
    .from("wali_requests")
    .select(
      `id, status, message, scope_agreed, duration_agreed, fee_agreed, created_at,
       sister:sister_id(id, alias, public_ref, date_of_birth, ethnicity, location_city, location_country, marital_status, category, about, looking_for)`,
    )
    .in("wali_id", waliIds)
    .order("created_at", { ascending: false })
    .returns<WaliReqRow[]>();

  const all = reqs ?? [];
  const pending = all.filter((r) => r.status === "pending");
  const accepted = all.filter((r) => r.status === "accepted");
  const past = all.filter((r) => ["declined", "withdrawn", "ended"].includes(r.status));

  return (
    <div>
      <h1 className="font-display text-3xl font-semibold text-ink">Guardian inbox</h1>
      <p className="mt-1 text-sm text-muted">
        Listed as{" "}
        <span className="font-medium text-ink">
          {waliRows.map((w) => w.name).join(", ")}
        </span>
        . Requests from sisters who have no family Wali available.
      </p>

      {/* Pending */}
      <section className="mt-8">
        <h2 className="font-display text-xl font-semibold text-ink">
          To review{pending.length ? ` (${pending.length})` : ""}
        </h2>
        {pending.length === 0 ? (
          <p className="mt-3 rounded-xl border border-line bg-white p-6 text-sm text-muted">
            No requests waiting.
          </p>
        ) : (
          <div className="mt-4 space-y-4">
            {pending.map((r) => {
              const s = one(r.sister);
              return (
                <div key={r.id} className="rounded-xl border border-line bg-white p-5 shadow-card">
                  <SisterBlock s={s} />
                  {r.message && (
                    <p className="mt-3 rounded-md bg-cream px-3 py-2 text-sm text-body">
                      “{r.message}”
                    </p>
                  )}
                  {s?.about && (
                    <p className="mt-3 line-clamp-3 text-sm text-muted">{s.about}</p>
                  )}
                  <div className="mt-4">
                    <WaliRequestActions requestId={r.id} />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* Accepted */}
      {accepted.length > 0 && (
        <section className="mt-10">
          <h2 className="font-display text-xl font-semibold text-ink">
            Active engagements
          </h2>
          <div className="mt-4 space-y-4">
            {accepted.map((r) => {
              const s = one(r.sister);
              return (
                <div key={r.id} className="rounded-xl border border-line bg-white p-5 shadow-card">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <SisterBlock s={s} />
                    <EndEngagementButton requestId={r.id} />
                  </div>
                  <dl className="mt-3 grid gap-2 text-sm sm:grid-cols-3">
                    <div>
                      <dt className="text-xs font-semibold uppercase tracking-wider text-muted">Scope</dt>
                      <dd className="text-ink">{r.scope_agreed ?? "—"}</dd>
                    </div>
                    <div>
                      <dt className="text-xs font-semibold uppercase tracking-wider text-muted">Duration</dt>
                      <dd className="text-ink">{r.duration_agreed ?? "—"}</dd>
                    </div>
                    <div>
                      <dt className="text-xs font-semibold uppercase tracking-wider text-muted">Fee</dt>
                      <dd className="text-ink">{r.fee_agreed ?? "—"}</dd>
                    </div>
                  </dl>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* History */}
      {past.length > 0 && (
        <section className="mt-10">
          <h2 className="font-display text-xl font-semibold text-ink">Past</h2>
          <div className="mt-4 space-y-2">
            {past.map((r) => {
              const s = one(r.sister);
              return (
                <div
                  key={r.id}
                  className="flex items-center justify-between rounded-lg border border-line bg-white px-4 py-3 text-sm"
                >
                  <span className="text-ink">
                    {s ? (s.alias ? `${s.alias} · ${s.public_ref}` : s.public_ref) : "A member"}
                  </span>
                  <span className="text-xs capitalize text-muted">{r.status}</span>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* Guided rules */}
      <section className="mt-12 rounded-2xl border border-line bg-cream p-6">
        <h2 className="font-display text-lg font-semibold text-ink">
          The rules you act under
        </h2>
        <dl className="mt-4 divide-y divide-line">
          {independentWaliRules.map((rule) => (
            <div key={rule.title} className="py-3">
              <dt className="font-display font-semibold text-ink">{rule.title}</dt>
              <dd className="mt-1 text-sm leading-relaxed text-muted">{rule.body}</dd>
            </div>
          ))}
        </dl>
      </section>
    </div>
  );
}

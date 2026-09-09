import type { Metadata } from "next";
import Link from "next/link";
import { requireActiveProfile } from "@/lib/supabase/queries";
import { ageFromDob } from "@/lib/profile-display";
import { ReceivedActions, WithdrawAction } from "@/components/app/RequestActions";

export const metadata: Metadata = { title: "Requests" };

type Mini = {
  id: string;
  alias: string | null;
  public_ref: string | null;
  date_of_birth: string | null;
  ethnicity: string | null;
  location_city: string | null;
  location_country: string | null;
  about: string | null;
  category: string;
};
type ReqRow = {
  id: string;
  message: string | null;
  status: string;
  created_at: string;
  other: Mini | Mini[] | null;
};
type WaliReq = {
  id: string;
  status: string;
  created_at: string;
  wali: { name: string; role: string; location: string } | { name: string; role: string; location: string }[] | null;
};

const one = <T,>(v: T | T[] | null): T | null =>
  v == null ? null : Array.isArray(v) ? (v[0] ?? null) : v;

function PersonLine({ p }: { p: Mini }) {
  const age = ageFromDob(p.date_of_birth);
  return (
    <div>
      <Link href={`/browse/${p.id}`} className="font-display text-lg font-semibold text-ink hover:text-primary">
        {p.alias ? `${p.alias} · ${p.public_ref}` : (p.public_ref ?? "Member")}
      </Link>
      <p className="mt-0.5 text-sm text-muted">
        {[age, p.ethnicity, [p.location_city, p.location_country].filter(Boolean).join(", ")]
          .filter(Boolean)
          .join(" · ")}
        {p.category === "widowed" ? " · Widowed" : ""}
      </p>
    </div>
  );
}

export default async function RequestsPage() {
  const { supabase, user, profile } = await requireActiveProfile();
  const miniCols =
    "id, alias, public_ref, date_of_birth, ethnicity, location_city, location_country, about, category";

  const [{ data: recvRaw }, { data: sentRaw }, { data: waliRaw }] = await Promise.all([
    supabase
      .from("interest_requests")
      .select(`id, message, status, created_at, other:sender_id(${miniCols})`)
      .eq("recipient_id", user.id)
      .order("created_at", { ascending: false })
      .returns<ReqRow[]>(),
    supabase
      .from("interest_requests")
      .select(`id, message, status, created_at, other:recipient_id(${miniCols})`)
      .eq("sender_id", user.id)
      .order("created_at", { ascending: false })
      .returns<ReqRow[]>(),
    profile.gender === "sister"
      ? supabase
          .from("wali_requests")
          .select("id, status, created_at, wali:independent_walis(name, role, location)")
          .eq("sister_id", user.id)
          .order("created_at", { ascending: false })
          .returns<WaliReq[]>()
      : Promise.resolve({ data: [] as WaliReq[] }),
  ]);

  const received = recvRaw ?? [];
  const sent = sentRaw ?? [];
  const waliReqs = waliRaw ?? [];

  const receivedPending = received.filter((r) => r.status === "pending");
  const receivedResolved = received.filter((r) => r.status === "accepted");
  const sentVisible = sent.filter((r) => r.status !== "withdrawn");

  const statusBadge: Record<string, string> = {
    pending: "bg-cream-deep text-body",
    accepted: "bg-primary-light text-primary",
    declined: "bg-red-50 text-red-700",
  };

  return (
    <div>
      <h1 className="font-display text-3xl font-semibold text-ink">Requests</h1>
      <p className="mt-1 text-sm text-muted">
        Interest you have received and sent. Accepting a request opens a
        conversation in Matches.
      </p>

      {/* Received */}
      <section className="mt-8">
        <h2 className="font-display text-xl font-semibold text-ink">
          Received{receivedPending.length ? ` (${receivedPending.length})` : ""}
        </h2>

        {receivedPending.length === 0 ? (
          <p className="mt-3 rounded-xl border border-line bg-white p-6 text-sm text-muted">
            No new requests right now.
          </p>
        ) : (
          <div className="mt-4 space-y-4">
            {receivedPending.map((r) => {
              const p = one(r.other);
              if (!p) return null;
              return (
                <div key={r.id} className="rounded-xl border border-line bg-white p-5 shadow-card">
                  <PersonLine p={p} />
                  {r.message && (
                    <p className="mt-3 rounded-md bg-cream px-3 py-2 text-sm text-body">
                      “{r.message}”
                    </p>
                  )}
                  {p.about && (
                    <p className="mt-3 line-clamp-2 text-sm text-muted">{p.about}</p>
                  )}
                  <div className="mt-4">
                    <ReceivedActions requestId={r.id} />
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {receivedResolved.length > 0 && (
          <div className="mt-4 space-y-2">
            {receivedResolved.map((r) => {
              const p = one(r.other);
              if (!p) return null;
              return (
                <div
                  key={r.id}
                  className="flex items-center justify-between rounded-lg border border-line bg-white px-4 py-3 text-sm"
                >
                  <span className="text-ink">
                    {p.alias ? `${p.alias} · ${p.public_ref}` : p.public_ref}
                  </span>
                  <Link href="/matches" className="font-medium text-primary hover:underline">
                    Matched — open →
                  </Link>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* Sent */}
      <section className="mt-10">
        <h2 className="font-display text-xl font-semibold text-ink">Sent</h2>

        {sentVisible.length === 0 ? (
          <p className="mt-3 rounded-xl border border-line bg-white p-6 text-sm text-muted">
            You have not sent any requests.{" "}
            <Link href="/browse" className="font-medium text-primary hover:underline">
              Browse members →
            </Link>
          </p>
        ) : (
          <div className="mt-4 space-y-3">
            {sentVisible.map((r) => {
              const p = one(r.other);
              if (!p) return null;
              return (
                <div
                  key={r.id}
                  className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-line bg-white p-4 shadow-card"
                >
                  <PersonLine p={p} />
                  <div className="flex items-center gap-3">
                    <span
                      className={`rounded-full px-2.5 py-1 text-xs font-medium capitalize ${
                        statusBadge[r.status] ?? "bg-cream-deep text-body"
                      }`}
                    >
                      {r.status}
                    </span>
                    {r.status === "pending" && <WithdrawAction requestId={r.id} />}
                    {r.status === "accepted" && (
                      <Link href="/matches" className="text-xs font-medium text-primary hover:underline">
                        Open in Matches →
                      </Link>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* Wali request (sisters who chose an appointed Wali) */}
      {waliReqs.length > 0 && (
        <section className="mt-10">
          <h2 className="font-display text-xl font-semibold text-ink">Your guardian request</h2>
          <div className="mt-4 space-y-3">
            {waliReqs.map((w) => {
              const wl = one(w.wali);
              return (
                <div
                  key={w.id}
                  className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-line bg-white p-4 shadow-card"
                >
                  <div>
                    <p className="font-medium text-ink">{wl?.name ?? "Appointed Wali"}</p>
                    <p className="text-sm text-muted">
                      {[wl?.role, wl?.location].filter(Boolean).join(" · ")}
                    </p>
                  </div>
                  <span
                    className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                      w.status === "pending" ? "" : "capitalize"
                    } ${statusBadge[w.status] ?? "bg-cream-deep text-body"}`}
                  >
                    {w.status === "pending" ? "Awaiting the Wali" : w.status}
                  </span>
                </div>
              );
            })}
          </div>
        </section>
      )}
    </div>
  );
}

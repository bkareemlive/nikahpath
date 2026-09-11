import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { requireAdmin } from "@/lib/admin";
import { REPORT_REASONS } from "@/lib/moderation";
import { ageFromDob } from "@/lib/profile-display";
import type { ProfileRow } from "@/lib/supabase/types";
import { SuspendToggle } from "@/components/admin/SuspendToggle";

export const metadata: Metadata = { title: "Member" };

type ReportMini = {
  id: string;
  reason: string;
  detail: string | null;
  status: string;
  created_at: string;
};

export default async function AdminMemberPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const { supabase } = await requireAdmin();

  const { data: member } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", id)
    .maybeSingle<ProfileRow>();
  if (!member) notFound();

  const [{ data: against }, { data: filedByThem }] = await Promise.all([
    supabase
      .from("reports")
      .select("id, reason, detail, status, created_at")
      .eq("reported_id", id)
      .order("created_at", { ascending: false })
      .returns<ReportMini[]>(),
    supabase
      .from("reports")
      .select("id, reason, detail, status, created_at")
      .eq("reporter_id", id)
      .order("created_at", { ascending: false })
      .returns<ReportMini[]>(),
  ]);

  const age = ageFromDob(member.date_of_birth);

  return (
    <div>
      <Link href="/admin/reports" className="text-sm font-medium text-primary hover:underline">
        ← Back to reports
      </Link>

      <div className="mt-4 rounded-2xl border border-line bg-white p-6 shadow-card">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="font-display text-2xl font-semibold text-ink">
              {member.alias ?? member.public_ref ?? "Member"}
              {member.alias && (
                <span className="ml-2 text-base font-normal text-muted">
                  · {member.public_ref}
                </span>
              )}
            </h1>
            <p className="mt-1 text-sm text-muted">
              {[
                age,
                member.gender,
                [member.location_city, member.location_country].filter(Boolean).join(", "),
              ]
                .filter(Boolean)
                .join(" · ")}
            </p>
          </div>
          <SuspendToggle memberId={member.id} status={member.status} />
        </div>

        <dl className="mt-6 grid grid-cols-2 gap-x-6 gap-y-3 sm:grid-cols-3">
          <div>
            <dt className="text-xs font-semibold uppercase tracking-wider text-muted">
              Status
            </dt>
            <dd className="mt-0.5 text-sm capitalize text-ink">{member.status}</dd>
          </div>
          <div>
            <dt className="text-xs font-semibold uppercase tracking-wider text-muted">
              Plan
            </dt>
            <dd className="mt-0.5 text-sm capitalize text-ink">{member.plan}</dd>
          </div>
          <div>
            <dt className="text-xs font-semibold uppercase tracking-wider text-muted">
              Joined
            </dt>
            <dd className="mt-0.5 text-sm text-ink">
              {new Date(member.created_at).toLocaleDateString([], {
                day: "numeric",
                month: "short",
                year: "numeric",
              })}
            </dd>
          </div>
        </dl>

        {member.about && (
          <div className="mt-6">
            <h2 className="font-display text-lg font-semibold text-ink">About</h2>
            <p className="mt-2 whitespace-pre-line text-sm leading-relaxed text-body">
              {member.about}
            </p>
          </div>
        )}
      </div>

      <div className="mt-6 grid gap-6 sm:grid-cols-2">
        <section>
          <h2 className="font-display text-lg font-semibold text-ink">
            Reports against this member
          </h2>
          {(against ?? []).length === 0 ? (
            <p className="mt-3 rounded-xl border border-line bg-white p-4 text-sm text-muted">
              None.
            </p>
          ) : (
            <ul className="mt-3 space-y-2">
              {(against ?? []).map((r) => (
                <li
                  key={r.id}
                  className="rounded-xl border border-line bg-white p-4 text-sm"
                >
                  <p className="font-medium text-ink">
                    {REPORT_REASONS.find((x) => x.value === r.reason)?.label ?? r.reason}{" "}
                    <span className="font-normal capitalize text-muted">
                      · {r.status}
                    </span>
                  </p>
                  {r.detail && <p className="mt-1 text-muted">{r.detail}</p>}
                </li>
              ))}
            </ul>
          )}
        </section>

        <section>
          <h2 className="font-display text-lg font-semibold text-ink">
            Reports filed by this member
          </h2>
          {(filedByThem ?? []).length === 0 ? (
            <p className="mt-3 rounded-xl border border-line bg-white p-4 text-sm text-muted">
              None.
            </p>
          ) : (
            <ul className="mt-3 space-y-2">
              {(filedByThem ?? []).map((r) => (
                <li
                  key={r.id}
                  className="rounded-xl border border-line bg-white p-4 text-sm"
                >
                  <p className="font-medium text-ink">
                    {REPORT_REASONS.find((x) => x.value === r.reason)?.label ?? r.reason}{" "}
                    <span className="font-normal capitalize text-muted">
                      · {r.status}
                    </span>
                  </p>
                  {r.detail && <p className="mt-1 text-muted">{r.detail}</p>}
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </div>
  );
}

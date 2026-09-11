import type { Metadata } from "next";
import Link from "next/link";
import { requireAdmin } from "@/lib/admin";
import { isoDaysAgo } from "@/lib/time";
import { ReportRow, type ReportRowData } from "@/components/admin/ReportRow";

export const metadata: Metadata = { title: "Admin overview" };

function StatCard({ label, value }: { label: string; value: number | string }) {
  return (
    <div className="rounded-xl border border-line bg-white p-5">
      <p className="text-xs font-semibold uppercase tracking-wider text-muted">{label}</p>
      <p className="mt-1 font-display text-3xl font-semibold text-ink">{value}</p>
    </div>
  );
}

export default async function AdminOverviewPage() {
  const { supabase } = await requireAdmin();

  const [
    { count: openReports },
    { count: totalMembers },
    { count: newThisWeek },
    { count: suspended },
    { data: latest },
  ] = await Promise.all([
    supabase.from("reports").select("id", { count: "exact", head: true }).eq("status", "open"),
    supabase
      .from("profiles")
      .select("id", { count: "exact", head: true })
      .neq("status", "draft"),
    supabase
      .from("profiles")
      .select("id", { count: "exact", head: true })
      .gte("created_at", isoDaysAgo(7)),
    supabase
      .from("profiles")
      .select("id", { count: "exact", head: true })
      .eq("status", "suspended"),
    supabase
      .from("reports")
      .select(
        "id, reason, detail, status, created_at, reporter:reporter_id(id, alias, public_ref), reported:reported_id(id, alias, public_ref)",
      )
      .eq("status", "open")
      .order("created_at", { ascending: false })
      .limit(5)
      .returns<ReportRowData[]>(),
  ]);

  return (
    <div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Open reports" value={openReports ?? 0} />
        <StatCard label="Members" value={totalMembers ?? 0} />
        <StatCard label="Joined this week" value={newThisWeek ?? 0} />
        <StatCard label="Suspended" value={suspended ?? 0} />
      </div>

      <div className="mt-8 flex items-center justify-between">
        <h2 className="font-display text-lg font-semibold text-ink">
          Newest open reports
        </h2>
        <Link href="/admin/reports" className="text-sm font-medium text-primary hover:underline">
          View all →
        </Link>
      </div>

      {(latest ?? []).length === 0 ? (
        <p className="mt-4 rounded-xl border border-line bg-white p-6 text-sm text-muted">
          Nothing open right now.
        </p>
      ) : (
        <div className="mt-4 space-y-4">
          {(latest ?? []).map((r) => (
            <ReportRow key={r.id} report={r} />
          ))}
        </div>
      )}
    </div>
  );
}

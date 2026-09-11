import type { Metadata } from "next";
import Link from "next/link";
import { requireAdmin } from "@/lib/admin";
import { REPORT_STATUSES } from "@/lib/moderation";
import { ReportRow, type ReportRowData } from "@/components/admin/ReportRow";

export const metadata: Metadata = { title: "Reports" };

type Filter = "open" | "reviewing" | "actioned" | "dismissed" | "all";

export default async function AdminReportsPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const { supabase } = await requireAdmin();
  const sp = await searchParams;
  const filter: Filter = (
    ["open", "reviewing", "actioned", "dismissed", "all"] as const
  ).includes(sp.status as Filter)
    ? (sp.status as Filter)
    : "open";

  let q = supabase
    .from("reports")
    .select(
      "id, reason, detail, status, created_at, reporter:reporter_id(id, alias, public_ref), reported:reported_id(id, alias, public_ref)",
    )
    .order("created_at", { ascending: false });
  if (filter !== "all") q = q.eq("status", filter);

  const { data } = await q.limit(100).returns<ReportRowData[]>();
  const reports = data ?? [];

  const tabs: { value: Filter; label: string }[] = [
    { value: "open", label: "Open" },
    ...REPORT_STATUSES.filter((s) => s.value !== "open").map((s) => ({
      value: s.value as Filter,
      label: s.label,
    })),
    { value: "all", label: "All" },
  ];

  return (
    <div>
      <div className="flex flex-wrap gap-1 rounded-lg border border-line bg-white p-1 text-sm">
        {tabs.map((t) => (
          <Link
            key={t.value}
            href={t.value === "open" ? "/admin/reports" : `/admin/reports?status=${t.value}`}
            className={`rounded-md px-3 py-1.5 font-medium ${
              filter === t.value
                ? "bg-primary-light text-primary"
                : "text-body hover:bg-cream hover:text-primary"
            }`}
          >
            {t.label}
          </Link>
        ))}
      </div>

      {reports.length === 0 ? (
        <p className="mt-6 rounded-xl border border-line bg-white p-6 text-sm text-muted">
          No reports in this view.
        </p>
      ) : (
        <div className="mt-6 space-y-4">
          {reports.map((r) => (
            <ReportRow key={r.id} report={r} />
          ))}
        </div>
      )}
    </div>
  );
}

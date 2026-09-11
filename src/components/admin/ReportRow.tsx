"use client";

import { useActionState } from "react";
import Link from "next/link";
import {
  setReportStatus,
  suspendMember,
  type AdminState,
} from "@/lib/actions/admin";
import { REPORT_REASONS, REPORT_STATUSES } from "@/lib/moderation";

type Mini = { id: string; alias: string | null; public_ref: string | null } | null;

export type ReportRowData = {
  id: string;
  reason: string;
  detail: string | null;
  status: string;
  created_at: string;
  reporter: Mini | Mini[];
  reported: Mini | Mini[];
};

const one = (v: Mini | Mini[]): Mini => (Array.isArray(v) ? (v[0] ?? null) : v);

const statusStyle: Record<string, string> = {
  open: "bg-gold-light text-gold",
  reviewing: "bg-cream-deep text-body",
  actioned: "bg-red-50 text-red-700",
  dismissed: "bg-cream-deep text-muted",
};

function name(p: Mini) {
  if (!p) return "Deleted member";
  return p.alias ? `${p.alias} · ${p.public_ref}` : (p.public_ref ?? "Member");
}

export function ReportRow({ report }: { report: ReportRowData }) {
  const reporter = one(report.reporter);
  const reported = one(report.reported);
  const reasonLabel =
    REPORT_REASONS.find((r) => r.value === report.reason)?.label ?? report.reason;

  const [statusState, statusAction, statusPending] = useActionState<AdminState, FormData>(
    setReportStatus,
    {},
  );
  const [suspendState, suspendAction, suspending] = useActionState<AdminState, FormData>(
    suspendMember,
    {},
  );

  return (
    <div className="rounded-xl border border-line bg-white p-5 shadow-card">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-sm text-muted">
            <span className="font-medium text-ink">{name(reporter)}</span> reported{" "}
            {reported ? (
              <Link
                href={`/admin/members/${reported.id}`}
                className="font-medium text-primary hover:underline"
              >
                {name(reported)}
              </Link>
            ) : (
              <span className="font-medium text-ink">{name(reported)}</span>
            )}
          </p>
          <p className="mt-1 text-xs text-muted">
            {new Date(report.created_at).toLocaleString([], {
              day: "numeric",
              month: "short",
              hour: "2-digit",
              minute: "2-digit",
            })}
          </p>
        </div>
        <span
          className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-medium capitalize ${
            statusStyle[report.status] ?? "bg-cream-deep text-body"
          }`}
        >
          {report.status}
        </span>
      </div>

      <p className="mt-3 text-sm font-medium text-ink">{reasonLabel}</p>
      {report.detail && (
        <p className="mt-1 whitespace-pre-line text-sm text-body">{report.detail}</p>
      )}

      <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-line pt-4">
        <form action={statusAction} className="flex items-center gap-2">
          <input type="hidden" name="report_id" value={report.id} />
          <input type="hidden" name="reported_id" value={reported?.id ?? ""} />
          <select
            name="status"
            defaultValue={report.status}
            className="rounded-md border border-line bg-white px-2.5 py-1.5 text-xs font-medium text-ink outline-none focus:border-primary"
          >
            {REPORT_STATUSES.map((s) => (
              <option key={s.value} value={s.value}>
                {s.label}
              </option>
            ))}
          </select>
          <button
            type="submit"
            disabled={statusPending}
            className="rounded-md border border-line px-3 py-1.5 text-xs font-medium text-body hover:border-primary disabled:opacity-60"
          >
            {statusPending ? "Saving…" : "Update"}
          </button>
        </form>

        {reported && (
          <form action={suspendAction}>
            <input type="hidden" name="member_id" value={reported.id} />
            <input type="hidden" name="report_id" value={report.id} />
            <button
              type="submit"
              disabled={suspending}
              className="rounded-md border border-red-200 px-3 py-1.5 text-xs font-medium text-red-700 hover:bg-red-50 disabled:opacity-60"
            >
              {suspending ? "Suspending…" : "Suspend member & close"}
            </button>
          </form>
        )}

        {reported && (
          <Link
            href={`/admin/members/${reported.id}`}
            className="text-xs font-medium text-primary hover:underline"
          >
            View member →
          </Link>
        )}
      </div>
      {(statusState.error || suspendState.error) && (
        <p className="mt-2 text-xs text-red-700">
          {statusState.error || suspendState.error}
        </p>
      )}
    </div>
  );
}

"use client";

import { useState } from "react";
import { useActionState } from "react";
import {
  blockMember,
  unblockMember,
  reportMember,
  type ModState,
} from "@/lib/actions/moderation";
import { REPORT_REASONS } from "@/lib/moderation";

const linkBtn = "text-xs font-medium text-muted hover:text-primary disabled:opacity-60";

export function ReportBlockMenu({
  targetId,
  blocked,
}: {
  targetId: string;
  blocked: boolean;
}) {
  const [open, setOpen] = useState(false);
  const [showReport, setShowReport] = useState(false);

  const [blockState, blockAction, blocking] = useActionState<ModState, FormData>(
    blockMember,
    {},
  );
  const [unblockState, unblockAction, unblocking] = useActionState<
    ModState,
    FormData
  >(unblockMember, {});
  const [reportState, reportAction, reporting] = useActionState<
    ModState,
    FormData
  >(reportMember, {});

  if (blocked) {
    return (
      <form action={unblockAction} className="inline">
        <input type="hidden" name="target_id" value={targetId} />
        <button type="submit" disabled={unblocking} className={linkBtn}>
          {unblocking ? "…" : "Unblock"}
        </button>
        {unblockState.error && (
          <span className="ml-2 text-xs text-red-700">{unblockState.error}</span>
        )}
      </form>
    );
  }

  if (blockState.ok) {
    return <span className="text-xs text-muted">Blocked.</span>;
  }
  if (reportState.ok) {
    return <span className="text-xs text-muted">Reported. Our team will review it.</span>;
  }

  return (
    <div className="relative inline-block text-left">
      <button type="button" onClick={() => setOpen((v) => !v)} className={linkBtn}>
        Report or block
      </button>

      {open && (
        <div className="absolute right-0 z-10 mt-2 w-72 rounded-xl border border-line bg-white p-4 text-left shadow-lift">
          {!showReport ? (
            <div className="grid gap-2">
              <button
                type="button"
                onClick={() => setShowReport(true)}
                className="rounded-md border border-line px-3 py-2 text-left text-sm font-medium text-ink hover:border-primary"
              >
                Report this member
              </button>
              <form action={blockAction}>
                <input type="hidden" name="target_id" value={targetId} />
                <button
                  type="submit"
                  disabled={blocking}
                  className="w-full rounded-md border border-red-200 px-3 py-2 text-left text-sm font-medium text-red-700 hover:bg-red-50 disabled:opacity-60"
                >
                  {blocking ? "Blocking…" : "Block this member"}
                </button>
              </form>
              <p className="text-xs text-muted">
                Blocking hides you both from each other and stops all contact.
              </p>
              {blockState.error && (
                <p className="text-xs text-red-700">{blockState.error}</p>
              )}
            </div>
          ) : (
            <form action={reportAction} className="grid gap-2.5">
              <input type="hidden" name="target_id" value={targetId} />
              <label className="grid gap-1 text-xs font-medium text-ink">
                Reason
                <select
                  name="reason"
                  required
                  defaultValue=""
                  className="rounded-md border border-line bg-white px-2.5 py-2 text-sm text-ink outline-none focus:border-primary"
                >
                  <option value="" disabled>
                    Choose…
                  </option>
                  {REPORT_REASONS.map((r) => (
                    <option key={r.value} value={r.value}>
                      {r.label}
                    </option>
                  ))}
                </select>
              </label>
              <label className="grid gap-1 text-xs font-medium text-ink">
                Details (optional)
                <textarea
                  name="detail"
                  rows={3}
                  maxLength={1000}
                  className="rounded-md border border-line bg-white px-2.5 py-2 text-sm text-ink outline-none focus:border-primary"
                />
              </label>
              <label className="flex items-center gap-2 text-xs text-body">
                <input type="checkbox" name="also_block" defaultChecked />
                Also block this member
              </label>
              {reportState.error && (
                <p className="text-xs text-red-700">{reportState.error}</p>
              )}
              <div className="flex gap-2">
                <button
                  type="submit"
                  disabled={reporting}
                  className="h-8 rounded-md bg-primary px-3 text-xs font-semibold text-white hover:bg-primary-dark disabled:opacity-60"
                >
                  {reporting ? "Sending…" : "Submit report"}
                </button>
                <button
                  type="button"
                  onClick={() => setShowReport(false)}
                  className="h-8 rounded-md border border-line px-3 text-xs font-medium text-body"
                >
                  Back
                </button>
              </div>
            </form>
          )}
        </div>
      )}
    </div>
  );
}

"use client";

import { useState } from "react";
import { useActionState } from "react";
import {
  respondToWaliRequest,
  endWaliEngagement,
  type WaliRespondState,
} from "@/lib/actions/wali";

const input =
  "w-full rounded-md border border-line bg-white px-3 py-2 text-sm text-ink outline-none focus:border-primary focus:ring-2 focus:ring-primary/20";
const btnPrimary =
  "h-9 rounded-md bg-primary px-4 text-sm font-semibold text-white hover:bg-primary-dark disabled:opacity-60";
const btnGhost =
  "h-9 rounded-md border border-line px-4 text-sm font-medium text-body hover:border-primary hover:text-primary disabled:opacity-60";

export function WaliRequestActions({ requestId }: { requestId: string }) {
  const [state, action, pending] = useActionState<WaliRespondState, FormData>(
    respondToWaliRequest,
    {},
  );
  const [open, setOpen] = useState(false);

  if (state.ok) {
    return <p className="text-sm text-muted">Answered. It has moved below.</p>;
  }

  return (
    <div>
      {!open ? (
        <div className="flex flex-wrap items-center gap-2">
          <button type="button" onClick={() => setOpen(true)} className={btnPrimary}>
            Accept under agreement
          </button>
          <form action={action}>
            <input type="hidden" name="request_id" value={requestId} />
            <input type="hidden" name="decision" value="decline" />
            <button type="submit" disabled={pending} className={btnGhost}>
              Decline
            </button>
          </form>
        </div>
      ) : (
        <form action={action} className="grid gap-3 rounded-lg border border-line bg-cream p-4">
          <input type="hidden" name="request_id" value={requestId} />
          <input type="hidden" name="decision" value="accept" />
          <label className="grid gap-1 text-sm font-medium text-ink">
            Scope of your representation
            <textarea
              name="scope"
              rows={3}
              maxLength={600}
              placeholder="e.g. Vet the suitor, agree the mahr and conditions, give or withhold consent, attend or be represented at the nikah."
              className={input}
            />
          </label>
          <div className="grid gap-3 sm:grid-cols-2">
            <label className="grid gap-1 text-sm font-medium text-ink">
              Duration
              <input name="duration" maxLength={200} placeholder="e.g. Until the nikah or either side ends it" className={input} />
            </label>
            <label className="grid gap-1 text-sm font-medium text-ink">
              Fee
              <input name="fee" maxLength={200} placeholder="e.g. None / a set amount" className={input} />
            </label>
          </div>
          <label className="flex items-start gap-2 text-sm text-body">
            <input type="checkbox" name="agree" className="mt-0.5" />
            <span>
              I will act only within this scope, keep all contact recorded or
              third-party, decline if I have any personal interest, and follow the
              Shariah and the Sunnah of the Prophet Muhammad ﷺ.
            </span>
          </label>
          <div className="flex items-center gap-2">
            <button type="submit" disabled={pending} className={btnPrimary}>
              {pending ? "…" : "Confirm acceptance"}
            </button>
            <button type="button" onClick={() => setOpen(false)} className={btnGhost}>
              Cancel
            </button>
          </div>
          {state.error && <p className="text-xs text-red-700">{state.error}</p>}
        </form>
      )}
      {!open && state.error && <p className="mt-2 text-xs text-red-700">{state.error}</p>}
    </div>
  );
}

export function EndEngagementButton({ requestId }: { requestId: string }) {
  const [state, action, pending] = useActionState<WaliRespondState, FormData>(
    endWaliEngagement,
    {},
  );
  if (state.ok) return <p className="text-xs text-muted">Engagement ended.</p>;
  return (
    <form action={action}>
      <input type="hidden" name="request_id" value={requestId} />
      <button
        type="submit"
        disabled={pending}
        className="text-xs font-medium text-muted hover:text-primary disabled:opacity-60"
      >
        {pending ? "…" : "Step aside / end"}
      </button>
      {state.error && <span className="ml-2 text-xs text-red-700">{state.error}</span>}
    </form>
  );
}

"use client";

import Link from "next/link";
import { useActionState } from "react";
import {
  respondToRequest,
  withdrawRequest,
  type RespondState,
} from "@/lib/actions/interest";

const btnPrimary =
  "h-9 rounded-md bg-primary px-4 text-sm font-semibold text-white hover:bg-primary-dark disabled:opacity-60";
const btnGhost =
  "h-9 rounded-md border border-line px-4 text-sm font-medium text-body hover:border-primary hover:text-primary disabled:opacity-60";

export function ReceivedActions({ requestId }: { requestId: string }) {
  const [state, action, pending] = useActionState<RespondState, FormData>(
    respondToRequest,
    {},
  );

  if (state.matched) {
    return (
      <Link
        href="/matches"
        className="inline-flex h-9 items-center rounded-md bg-primary px-4 text-sm font-semibold text-white hover:bg-primary-dark"
      >
        Matched — open in Matches →
      </Link>
    );
  }
  if (state.ok) {
    return <p className="text-sm text-muted">Request declined.</p>;
  }

  return (
    <form action={action} className="flex flex-wrap items-center gap-2">
      <input type="hidden" name="request_id" value={requestId} />
      <button type="submit" name="decision" value="accept" disabled={pending} className={btnPrimary}>
        {pending ? "…" : "Accept"}
      </button>
      <button type="submit" name="decision" value="decline" disabled={pending} className={btnGhost}>
        Decline
      </button>
      {state.error && <span className="text-xs text-red-700">{state.error}</span>}
    </form>
  );
}

export function WithdrawAction({ requestId }: { requestId: string }) {
  const [state, action, pending] = useActionState<RespondState, FormData>(
    withdrawRequest,
    {},
  );
  if (state.ok) return <p className="text-xs text-muted">Withdrawn.</p>;
  return (
    <form action={action}>
      <input type="hidden" name="request_id" value={requestId} />
      <button
        type="submit"
        disabled={pending}
        className="text-xs font-medium text-muted hover:text-primary disabled:opacity-60"
      >
        {pending ? "Withdrawing…" : "Withdraw"}
      </button>
      {state.error && <span className="ml-2 text-xs text-red-700">{state.error}</span>}
    </form>
  );
}

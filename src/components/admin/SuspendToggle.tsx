"use client";

import { useActionState } from "react";
import {
  suspendMember,
  reactivateMember,
  type AdminState,
} from "@/lib/actions/admin";

export function SuspendToggle({
  memberId,
  status,
}: {
  memberId: string;
  status: string;
}) {
  const [suspendState, suspendAction, suspending] = useActionState<AdminState, FormData>(
    suspendMember,
    {},
  );
  const [reactivateState, reactivateAction, reactivating] = useActionState<
    AdminState,
    FormData
  >(reactivateMember, {});

  if (status === "suspended") {
    return (
      <form action={reactivateAction} className="shrink-0">
        <input type="hidden" name="member_id" value={memberId} />
        <button
          type="submit"
          disabled={reactivating}
          className="rounded-lg border border-line px-4 py-2 text-sm font-medium text-body hover:border-primary disabled:opacity-60"
        >
          {reactivating ? "Reactivating…" : "Reactivate member"}
        </button>
        {reactivateState.error && (
          <p className="mt-1 text-xs text-red-700">{reactivateState.error}</p>
        )}
      </form>
    );
  }

  return (
    <form action={suspendAction} className="shrink-0">
      <input type="hidden" name="member_id" value={memberId} />
      <button
        type="submit"
        disabled={suspending}
        className="rounded-lg border border-red-200 px-4 py-2 text-sm font-medium text-red-700 hover:bg-red-50 disabled:opacity-60"
      >
        {suspending ? "Suspending…" : "Suspend member"}
      </button>
      {suspendState.error && (
        <p className="mt-1 text-xs text-red-700">{suspendState.error}</p>
      )}
    </form>
  );
}

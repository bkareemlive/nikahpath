"use client";

import { useActionState } from "react";
import { sendNudge, type NudgeState } from "@/lib/actions/nudge";

export function NudgeButton({
  recipientId,
  redirectPath,
  size = "sm",
}: {
  recipientId: string;
  redirectPath?: string;
  size?: "sm" | "md";
}) {
  const [state, action, pending] = useActionState<NudgeState, FormData>(
    sendNudge,
    {},
  );

  if (state.ok) {
    return <span className="text-xs font-medium text-primary">Nudge sent 👋</span>;
  }

  const cls =
    size === "md"
      ? "h-10 rounded-md border border-line px-4 text-sm font-medium text-body hover:border-primary hover:text-primary disabled:opacity-60"
      : "rounded-md border border-line px-3 py-1.5 text-xs font-medium text-body hover:border-primary hover:text-primary disabled:opacity-60";

  return (
    <form action={action} className="inline-flex flex-col items-start gap-1">
      <input type="hidden" name="recipient_id" value={recipientId} />
      {redirectPath && <input type="hidden" name="redirect_path" value={redirectPath} />}
      <button type="submit" disabled={pending} className={cls}>
        {pending ? "…" : "👋 Nudge"}
      </button>
      {state.error && <span className="text-xs text-red-700">{state.error}</span>}
    </form>
  );
}

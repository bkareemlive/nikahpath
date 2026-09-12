"use client";

import { useActionState } from "react";
import { saveProfile, unsaveProfile, type SavedState } from "@/lib/actions/saved";

export function SaveToggle({
  targetId,
  saved,
}: {
  targetId: string;
  saved: boolean;
}) {
  const [saveState, saveAction, saving] = useActionState<SavedState, FormData>(
    saveProfile,
    {},
  );
  const [unsaveState, unsaveAction, unsaving] = useActionState<
    SavedState,
    FormData
  >(unsaveProfile, {});

  const isSaved = saved || saveState.ok;
  const busy = saving || unsaving;
  const error = saveState.error || unsaveState.error;

  return (
    <div className="inline-flex flex-col items-end">
      <form action={isSaved ? unsaveAction : saveAction}>
        <input type="hidden" name="target_id" value={targetId} />
        <button
          type="submit"
          disabled={busy}
          className={`inline-flex items-center gap-1.5 rounded-md border px-3 py-1.5 text-sm font-medium transition-colors disabled:opacity-60 ${
            isSaved
              ? "border-gold/50 bg-gold-light text-ink hover:border-gold"
              : "border-line text-body hover:border-primary hover:text-primary"
          }`}
        >
          <span aria-hidden="true">{isSaved ? "★" : "☆"}</span>
          {busy ? "…" : isSaved ? "Saved" : "Save"}
        </button>
      </form>
      {error && <p className="mt-1 text-xs text-red-700">{error}</p>}
    </div>
  );
}

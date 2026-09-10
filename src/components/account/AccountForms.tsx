"use client";

import { useActionState } from "react";
import {
  changePassword,
  changeEmail,
  closeAccount,
  type AccountState,
} from "@/lib/actions/account";

const field =
  "w-full rounded-md border border-line bg-white px-3 py-2.5 text-sm text-ink outline-none focus:border-primary focus:ring-2 focus:ring-primary/20";
const label = "grid gap-1 text-sm font-medium text-ink";
const primary =
  "h-10 rounded-md bg-primary px-5 text-sm font-semibold text-white hover:bg-primary-dark disabled:opacity-60";
const section = "rounded-2xl border border-line bg-white p-6 shadow-card";

function Notice({ state }: { state: AccountState }) {
  if (state.error)
    return (
      <p className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
        {state.error}
      </p>
    );
  if (state.message)
    return (
      <p className="rounded-md border border-primary/25 bg-primary-light px-3 py-2 text-sm text-primary-dark">
        {state.message}
      </p>
    );
  return null;
}

export function EmailForm({ current }: { current: string }) {
  const [state, action, pending] = useActionState<AccountState, FormData>(changeEmail, {});
  return (
    <section className={section}>
      <h2 className="font-display text-lg font-semibold text-ink">Email address</h2>
      <p className="mt-1 text-sm text-muted">
        Currently <span className="font-medium text-ink">{current}</span>. Changing
        it needs confirmation from both the old and new address.
      </p>
      <form action={action} className="mt-4 grid gap-3">
        <label className={label}>
          New email
          <input name="email" type="email" required className={field} />
        </label>
        <Notice state={state} />
        <div>
          <button type="submit" disabled={pending} className={primary}>
            {pending ? "Sending…" : "Send confirmation"}
          </button>
        </div>
      </form>
    </section>
  );
}

export function PasswordForm() {
  const [state, action, pending] = useActionState<AccountState, FormData>(
    changePassword,
    {},
  );
  return (
    <section className={section}>
      <h2 className="font-display text-lg font-semibold text-ink">Password</h2>
      <p className="mt-1 text-sm text-muted">Set a new password for your account.</p>
      <form action={action} className="mt-4 grid gap-3">
        <label className={label}>
          New password
          <input
            name="password"
            type="password"
            autoComplete="new-password"
            required
            minLength={8}
            className={field}
          />
        </label>
        <label className={label}>
          Confirm new password
          <input
            name="confirm"
            type="password"
            autoComplete="new-password"
            required
            minLength={8}
            className={field}
          />
        </label>
        <Notice state={state} />
        <div>
          <button type="submit" disabled={pending} className={primary}>
            {pending ? "Saving…" : "Update password"}
          </button>
        </div>
      </form>
    </section>
  );
}

export function CloseAccountForm() {
  const [state, action, pending] = useActionState<AccountState, FormData>(
    closeAccount,
    {},
  );
  return (
    <section className="rounded-2xl border border-red-200 bg-white p-6 shadow-card">
      <h2 className="font-display text-lg font-semibold text-red-700">Close account</h2>
      <p className="mt-1 text-sm text-muted">
        This permanently deletes your profile, matches and messages. It cannot be
        undone. Type <span className="font-mono font-medium text-ink">DELETE</span>{" "}
        to confirm.
      </p>
      <form action={action} className="mt-4 grid gap-3">
        <input
          name="confirm"
          placeholder="DELETE"
          autoComplete="off"
          className="w-48 rounded-md border border-line bg-white px-3 py-2 text-sm text-ink outline-none focus:border-red-400 focus:ring-2 focus:ring-red-200"
        />
        <Notice state={state} />
        <div>
          <button
            type="submit"
            disabled={pending}
            className="h-10 rounded-md bg-red-600 px-5 text-sm font-semibold text-white hover:bg-red-700 disabled:opacity-60"
          >
            {pending ? "Closing…" : "Close my account"}
          </button>
        </div>
      </form>
    </section>
  );
}

import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import {
  EmailForm,
  PasswordForm,
  CloseAccountForm,
} from "@/components/account/AccountForms";

export const metadata: Metadata = { title: "Account" };

export default async function AccountPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  return (
    <div>
      <h1 className="font-display text-3xl font-semibold text-ink">Account</h1>
      <p className="mt-1 text-sm text-muted">
        Sign-in details for your account.{" "}
        <Link href="/profile" className="font-medium text-primary hover:underline">
          Edit your public profile
        </Link>{" "}
        instead?
      </p>

      <div className="mt-8 grid max-w-xl gap-6">
        <EmailForm current={user.email ?? ""} />
        <PasswordForm />
        <CloseAccountForm />
      </div>
    </div>
  );
}

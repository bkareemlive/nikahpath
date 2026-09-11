import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { site } from "@/data/site";
import { Logo } from "@/components/Logo";
import { signOut } from "@/lib/actions/auth";
import type { ProfileRow } from "@/lib/supabase/types";

export const metadata: Metadata = { title: "Account suspended" };

export default async function SuspendedPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("status")
    .eq("id", user.id)
    .maybeSingle<Pick<ProfileRow, "status">>();

  if (profile?.status !== "suspended") redirect("/dashboard");

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-cream px-6 py-16">
      <Logo />
      <div className="mt-8 w-full max-w-md rounded-2xl border border-line bg-white p-8 text-center shadow-card">
        <h1 className="font-display text-2xl font-semibold text-ink">
          Your account has been suspended
        </h1>
        <p className="mt-3 text-sm leading-relaxed text-body">
          A member of our team has suspended access to your account, usually
          following a report from another member. Your profile is no longer
          visible on {site.name} and you cannot send or receive messages.
        </p>
        <p className="mt-3 text-sm leading-relaxed text-body">
          If you believe this is a mistake, reach us at{" "}
          <a href={`mailto:${site.email}`} className="font-medium text-primary hover:underline">
            {site.email}
          </a>
          .
        </p>
        <form action={signOut} className="mt-6">
          <button
            type="submit"
            className="rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-white hover:bg-primary-dark"
          >
            Sign out
          </button>
        </form>
      </div>
    </div>
  );
}

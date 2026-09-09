import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type { ProfileRow } from "@/lib/supabase/types";

export const metadata: Metadata = { title: "Dashboard" };

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const [{ data: profile }, { count: waliCount }] = await Promise.all([
    supabase.from("profiles").select("*").eq("id", user.id).maybeSingle<ProfileRow>(),
    supabase
      .from("independent_walis")
      .select("id", { count: "exact", head: true })
      .eq("user_id", user.id),
  ]);

  if (!profile || profile.status === "draft") {
    if ((waliCount ?? 0) > 0) {
      return (
        <div className="max-w-lg rounded-2xl border border-line bg-white p-8 shadow-card">
          <h1 className="font-display text-2xl font-semibold text-ink">
            Assalamu alaikum.
          </h1>
          <p className="mt-2 text-sm leading-relaxed text-muted">
            You are set up as an appointed guardian. Requests from sisters who
            have no family Wali available will appear in your inbox.
          </p>
          <div className="mt-5">
            <Link
              href="/wali"
              className="inline-flex h-11 items-center rounded-md bg-primary px-6 text-sm font-semibold text-white hover:bg-primary-dark"
            >
              Open the guardian inbox →
            </Link>
          </div>
          <p className="mt-4 text-xs text-muted">
            If you also want a marriage profile of your own,{" "}
            <Link href="/onboarding" className="text-primary hover:underline">
              set one up here
            </Link>
            .
          </p>
        </div>
      );
    }
    redirect("/onboarding");
  }

  const [{ count: incoming }, { count: matchCount }] = await Promise.all([
    supabase
      .from("interest_requests")
      .select("id", { count: "exact", head: true })
      .eq("recipient_id", user.id)
      .eq("status", "pending"),
    supabase
      .from("matches")
      .select("id", { count: "exact", head: true })
      .or(`a_id.eq.${user.id},b_id.eq.${user.id}`),
  ]);

  const cards = [
    {
      href: "/requests",
      label: "Interest requests",
      value: incoming ?? 0,
      hint: "waiting for your reply",
    },
    {
      href: "/matches",
      label: "Matches",
      value: matchCount ?? 0,
      hint: "conversations open",
    },
    {
      href: "/browse",
      label: "Browse members",
      value: "→",
      hint: "find someone new",
    },
  ];

  return (
    <div>
      <h1 className="font-display text-3xl font-semibold text-ink">
        Assalamu alaikum{profile.alias ? `, ${profile.alias}` : ""}.
      </h1>
      <p className="mt-1 text-sm text-muted">
        {profile.public_ref ? `Your reference is ${profile.public_ref}. ` : ""}
        Here is where things stand.
      </p>

      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        {cards.map((c) => (
          <Link
            key={c.href}
            href={c.href}
            className="rounded-xl border border-line bg-white p-5 shadow-card transition-colors hover:border-primary"
          >
            <p className="font-display text-3xl font-semibold text-primary">{c.value}</p>
            <p className="mt-1 text-sm font-medium text-ink">{c.label}</p>
            <p className="text-xs text-muted">{c.hint}</p>
          </Link>
        ))}
      </div>

      <div className="mt-8 rounded-xl border border-line bg-white p-5 text-sm text-muted">
        Profile status:{" "}
        <span className="font-medium text-ink">{profile.status}</span> ·{" "}
        <Link href="/profile" className="text-primary hover:underline">
          edit your profile
        </Link>
      </div>
    </div>
  );
}

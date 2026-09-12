import type { ReactNode } from "react";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type { ProfileRow } from "@/lib/supabase/types";
import { AppSidebar } from "@/components/app/AppSidebar";

export default async function AppLayout({ children }: { children: ReactNode }) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const [{ data: profile }, { count: waliCount }, { data: isAdmin }, { count: unreadCount }] =
    await Promise.all([
      supabase.from("profiles").select("*").eq("id", user.id).maybeSingle<ProfileRow>(),
      supabase
        .from("independent_walis")
        .select("id", { count: "exact", head: true })
        .eq("user_id", user.id),
      supabase.rpc("is_admin"),
      supabase
        .from("messages")
        .select("id", { count: "exact", head: true })
        .is("read_at", null)
        .neq("sender_id", user.id),
    ]);

  return (
    <div className="flex min-h-full flex-col bg-cream lg:flex-row">
      <AppSidebar
        email={user.email ?? ""}
        alias={profile?.alias ?? null}
        publicRef={profile?.public_ref ?? null}
        plan={profile?.plan ?? "free"}
        isWali={(waliCount ?? 0) > 0}
        isAdmin={Boolean(isAdmin)}
        unreadCount={unreadCount ?? 0}
      />
      <main className="flex-1 px-5 py-8 sm:px-8 lg:px-12">
        <div className="mx-auto w-full max-w-4xl">{children}</div>
      </main>
    </div>
  );
}

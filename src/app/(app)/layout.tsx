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

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .maybeSingle<ProfileRow>();

  return (
    <div className="flex min-h-full flex-col bg-cream lg:flex-row">
      <AppSidebar
        email={user.email ?? ""}
        alias={profile?.alias ?? null}
        publicRef={profile?.public_ref ?? null}
        plan={profile?.plan ?? "free"}
      />
      <main className="flex-1 px-5 py-8 sm:px-8 lg:px-12">
        <div className="mx-auto w-full max-w-4xl">{children}</div>
      </main>
    </div>
  );
}

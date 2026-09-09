"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Logo } from "@/components/Logo";
import { signOut } from "@/lib/actions/auth";

const baseLinks = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/browse", label: "Browse" },
  { href: "/requests", label: "Requests" },
  { href: "/matches", label: "Matches" },
  { href: "/viewed", label: "Who viewed you" },
  { href: "/profile", label: "My profile" },
];

export function AppSidebar({
  email,
  alias,
  publicRef,
  plan,
  isWali = false,
}: {
  email: string;
  alias: string | null;
  publicRef: string | null;
  plan: string;
  isWali?: boolean;
}) {
  const pathname = usePathname();
  const links = isWali
    ? [...baseLinks, { href: "/wali", label: "Guardian inbox" }]
    : baseLinks;
  const planLabel =
    plan === "lifetime" ? "Lifetime" : plan === "full_access" ? "Full Access" : "Free";

  return (
    <aside className="border-b border-line bg-white px-5 py-5 sm:px-8 lg:w-64 lg:shrink-0 lg:border-b-0 lg:border-r lg:px-6 lg:py-8">
      <Logo />

      <nav className="mt-6 flex gap-1 overflow-x-auto lg:mt-8 lg:flex-col">
        {links.map((link) => {
          const active =
            pathname === link.href || pathname.startsWith(link.href + "/");
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`shrink-0 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                active
                  ? "bg-primary-light text-primary"
                  : "text-body hover:bg-cream hover:text-primary"
              }`}
            >
              {link.label}
            </Link>
          );
        })}
      </nav>

      <div className="mt-6 hidden border-t border-line pt-5 text-sm lg:block">
        <p className="font-medium text-ink">{alias ?? publicRef ?? "Your account"}</p>
        <p className="truncate text-xs text-muted">{email}</p>
        <p className="mt-1 inline-block rounded-full bg-cream-deep px-2 py-0.5 text-xs text-body">
          {planLabel}
        </p>
        <form action={signOut} className="mt-4">
          <button
            type="submit"
            className="text-xs font-medium text-muted hover:text-primary"
          >
            Sign out
          </button>
        </form>
      </div>

      <form action={signOut} className="mt-4 lg:hidden">
        <button
          type="submit"
          className="text-xs font-medium text-muted hover:text-primary"
        >
          Sign out
        </button>
      </form>
    </aside>
  );
}

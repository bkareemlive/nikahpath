import type { ReactNode } from "react";
import Link from "next/link";
import { requireAdmin } from "@/lib/admin";

export default async function AdminLayout({ children }: { children: ReactNode }) {
  await requireAdmin();

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-gold">
            Admin
          </p>
          <h1 className="font-display text-2xl font-semibold text-ink">
            Trust &amp; safety
          </h1>
        </div>
        <nav className="flex gap-1 rounded-lg border border-line bg-white p-1 text-sm">
          <Link
            href="/admin"
            className="rounded-md px-3 py-1.5 font-medium text-body hover:bg-cream hover:text-primary"
          >
            Overview
          </Link>
          <Link
            href="/admin/reports"
            className="rounded-md px-3 py-1.5 font-medium text-body hover:bg-cream hover:text-primary"
          >
            Reports
          </Link>
        </nav>
      </div>

      <div className="mt-6">{children}</div>
    </div>
  );
}

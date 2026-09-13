import Link from "next/link";
import type { ProfileRow } from "@/lib/supabase/types";
import { ageFromDob, isOnline, PRAYER_LABELS, SECT_LABELS } from "@/lib/profile-display";

export function MemberCard({ p }: { p: ProfileRow }) {
  const age = ageFromDob(p.date_of_birth);
  const online = isOnline(p.last_active_at);

  const tags = [
    p.category === "widowed" ? "Widowed" : null,
    p.practice_prayer ? PRAYER_LABELS[p.practice_prayer] : null,
    p.sect ? SECT_LABELS[p.sect] : null,
    p.has_children ? "Has children" : null,
  ].filter(Boolean) as string[];

  const demoLabel = p.is_demo && (
    <span className="rounded-full border border-dashed border-muted/60 px-2.5 py-0.5 text-xs font-medium text-muted">
      Demo profile
    </span>
  );

  return (
    <Link
      href={`/browse/${p.id}`}
      className="flex h-full flex-col rounded-xl border border-line bg-white p-5 shadow-card transition-colors hover:border-primary"
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="font-display text-lg font-semibold text-ink">
            {p.alias ? (
              <>
                {p.alias}{" "}
                <span className="text-sm font-normal text-muted">· {p.public_ref}</span>
              </>
            ) : (
              (p.public_ref ?? "Member")
            )}
          </h3>
          <p className="mt-0.5 text-sm text-muted">
            {[age, p.ethnicity, [p.location_city, p.location_country].filter(Boolean).join(", ")]
              .filter(Boolean)
              .join(" · ")}
          </p>
        </div>
        {online && (
          <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-primary-light px-2.5 py-1 text-xs font-medium text-primary">
            <span className="h-1.5 w-1.5 rounded-full bg-primary" />
            Online
          </span>
        )}
      </div>

      {(tags.length > 0 || demoLabel) && (
        <div className="mt-3 flex flex-wrap gap-1.5">
          {demoLabel}
          {tags.map((t) => (
            <span
              key={t}
              className="rounded-full border border-line bg-cream px-2.5 py-0.5 text-xs text-body"
            >
              {t}
            </span>
          ))}
        </div>
      )}

      {p.about && (
        <p className="mt-3 line-clamp-4 text-sm leading-relaxed text-body">{p.about}</p>
      )}
    </Link>
  );
}

import type { Profile } from "@/data/profiles";

export function ProfileCard({ profile }: { profile: Profile }) {
  const online = profile.status.toLowerCase().includes("online");
  return (
    <article className="flex h-full flex-col rounded-xl border border-line bg-white p-5 shadow-card">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="font-display text-lg font-semibold text-ink">
            {profile.alias ? (
              <>
                {profile.alias}{" "}
                <span className="text-sm font-normal text-muted">• {profile.id}</span>
              </>
            ) : (
              profile.id
            )}
          </h3>
          <p className="mt-0.5 text-sm text-muted">
            {profile.age} · {profile.ethnicity} · {profile.location}
          </p>
        </div>
        <span
          className={`inline-flex shrink-0 items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${
            online ? "bg-primary-light text-primary" : "bg-cream-deep text-muted"
          }`}
        >
          {online && <span className="h-1.5 w-1.5 rounded-full bg-primary" />}
          {profile.status}
        </span>
      </div>

      <div className="mt-3 flex flex-wrap gap-1.5">
        {profile.tags.map((tag) => (
          <span
            key={tag}
            className="rounded-full border border-line bg-cream px-2.5 py-0.5 text-xs text-body"
          >
            {tag}
          </span>
        ))}
      </div>

      <p className="mt-4 line-clamp-5 text-sm leading-relaxed text-body">
        {profile.bio}
      </p>
    </article>
  );
}

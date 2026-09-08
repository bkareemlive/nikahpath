import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/Container";
import { SectionHeading } from "@/components/SectionHeading";
import { posts, journalThemes } from "@/data/posts";

export const metadata: Metadata = {
  title: "Journal",
  description:
    "Short, practical writing on choosing a spouse, the rights of each partner, and the early years of marriage.",
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export default function JournalPage() {
  return (
    <>
      <section className="border-b border-line bg-cream py-16">
        <Container>
          <SectionHeading
            eyebrow="Journal"
            title="Plain writing about getting married well"
            description="Grouped by where you are in the process. Each piece is a few minutes long and tries to be concrete rather than sentimental."
          />
        </Container>
      </section>

      <section className="py-16">
        <Container className="max-w-3xl">
          <div className="space-y-14">
            {journalThemes.map((theme) => {
              const items = posts
                .filter((p) => p.theme === theme)
                .sort((a, b) => (a.date < b.date ? 1 : -1));
              if (!items.length) return null;
              return (
                <div key={theme}>
                  <h2 className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
                    {theme}
                  </h2>
                  <ul className="mt-5 divide-y divide-line border-y border-line">
                    {items.map((p) => (
                      <li key={p.slug}>
                        <Link
                          href={`/journal/${p.slug}`}
                          className="group flex flex-col gap-1 py-5 sm:flex-row sm:items-baseline sm:justify-between sm:gap-6"
                        >
                          <div className="sm:max-w-md">
                            <h3 className="font-display text-lg font-semibold text-ink group-hover:text-primary">
                              {p.title}
                            </h3>
                            <p className="mt-1 text-sm leading-relaxed text-muted">
                              {p.excerpt}
                            </p>
                          </div>
                          <span className="shrink-0 text-xs text-muted">
                            {formatDate(p.date)} · {p.readingTime}
                          </span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        </Container>
      </section>
    </>
  );
}

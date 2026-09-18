import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/Container";
import { Button } from "@/components/Button";
import { SectionHeading } from "@/components/SectionHeading";
import { site } from "@/data/site";

export const metadata: Metadata = {
  title: "The Approach",
  description: `How ${site.name} works, the rules it runs on, and who operates it.`,
};

const steps = [
  {
    n: 1,
    title: "Write your profile",
    body: "A guided form walks you through your practice, your family situation, and what matters to you in a spouse. It is the thing other members read before deciding to reach out, so it is worth the time.",
  },
  {
    n: 2,
    title: "Read through the members",
    body: "Every profile is open to you from the start, wherever members are in the world. Age, location and background filters are free; the finer filters come with a plan.",
  },
  {
    n: 3,
    title: "Send and answer interest",
    body: "Express interest and see everything sent and received in one place. When both sides agree, a conversation opens, with the guardian able to follow along.",
  },
  {
    n: 4,
    title: "Move towards a meeting",
    body: "Share guardian contact details, arrange a call, and plan to meet in person. The aim is a decision, not a chat that runs for months.",
  },
];

const rules: [string, string][] = [
  ["The Wali is involved", "No marriage process here without a guardian. It keeps things accountable and, in practice, keeps them moving."],
  ["Text, not photos", "Profiles carry no images. Appearance is something families confirm when they meet."],
  ["Nothing outside the sharia", "No room for private or inappropriate detail. Conversations are expected to stay purposeful."],
  ["Private until you decide", "No public usernames, and no real name or contact details shared without your say-so."],
];

export default function ApproachPage() {
  return (
    <>
      <section className="border-b border-line bg-cream py-16">
        <Container>
          <SectionHeading
            eyebrow="The approach"
            title="A short process with a clear finish line"
            description="How the service works, the rules it runs on, and who stands behind it, on one page."
          />
        </Container>
      </section>

      {/* Why this exists */}
      <section className="py-16">
        <Container className="max-w-3xl">
          <h2 className="font-display text-2xl font-semibold text-ink">Why this exists</h2>
          <div className="prose-nikah mt-4">
            <p>
              People who want a practising marriage tend to hit the same wall: the
              options are either informal apps that were never built for nikah, or
              a circle of acquaintances that is simply too small. Neither treats
              the search with the seriousness it deserves.
            </p>
            <p>
              {site.name} sits in between: a proper introduction service, run on
              Islamic principles, where marriage is the assumption from the first
              message and the guardian is part of it throughout.
            </p>
          </div>
        </Container>
      </section>

      {/* Steps as a timeline */}
      <section className="border-y border-line bg-cream py-16">
        <Container className="max-w-3xl">
          <h2 className="font-display text-2xl font-semibold text-ink">Step by step</h2>
          <ol className="mt-8 space-y-8">
            {steps.map((s) => (
              <li key={s.n} className="flex gap-5">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary font-display text-sm font-semibold text-white">
                  {s.n}
                </span>
                <div className="pt-1">
                  <h3 className="font-display text-lg font-semibold text-ink">{s.title}</h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-muted">{s.body}</p>
                </div>
              </li>
            ))}
          </ol>
        </Container>
      </section>

      {/* Rules as a definition list */}
      <section className="py-16">
        <Container className="max-w-3xl">
          <h2 className="font-display text-2xl font-semibold text-ink">The ground rules</h2>
          <dl className="mt-8 divide-y divide-line border-y border-line">
            {rules.map(([term, def]) => (
              <div key={term} className="grid gap-1 py-5 sm:grid-cols-[200px_1fr] sm:gap-6">
                <dt className="font-display font-semibold text-ink">{term}</dt>
                <dd className="text-sm leading-relaxed text-muted">{def}</dd>
              </div>
            ))}
          </dl>
        </Container>
      </section>

      {/* Who runs it */}
      <section className="border-t border-line bg-cream py-16">
        <Container className="max-w-3xl">
          <h2 className="font-display text-2xl font-semibold text-ink">Who runs it</h2>
          <div className="prose-nikah mt-4">
            <p>
              {site.name} is operated by{" "}
              <a
                href={site.copyrightHolderUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                {site.copyrightHolder}
              </a>{" "}
              (a US-based Section 501(c)(3) nonprofit organization) as a service
              to the community. Member information is stored securely and is never
              sold. The standards we hold the service to are the ones we would
              want for our own families.
            </p>
          </div>
          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            <div className="rounded-2xl border border-line bg-white p-6">
              <h3 className="font-display text-lg font-semibold text-ink">
                If you are a guardian
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">
                How a Wali takes part, what you can see, and how to raise a
                concern.
              </p>
              <Link
                href="/for-guardians"
                className="mt-3 inline-block text-sm font-medium text-primary hover:underline"
              >
                Read the guardians page →
              </Link>
            </div>
            <div className="rounded-2xl border border-line bg-white p-6">
              <h3 className="font-display text-lg font-semibold text-ink">
                If you have no family Wali
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">
                Sisters can choose an appointed Wali from a vetted register to
                represent them in the contract.
              </p>
              <Link
                href="/independent-wali"
                className="mt-3 inline-block text-sm font-medium text-primary hover:underline"
              >
                About the independent Wali →
              </Link>
            </div>
          </div>
        </Container>
      </section>

      <section className="py-16">
        <Container className="text-center">
          <h2 className="font-display text-3xl font-semibold tracking-tight text-ink">
            Ready to start?
          </h2>
          <div className="mt-8 flex justify-center">
            <Button href={site.registerUrl} size="lg">
              Start your free profile
            </Button>
          </div>
        </Container>
      </section>
    </>
  );
}

import Link from "next/link";
import { Container } from "@/components/Container";
import { Button } from "@/components/Button";
import { SectionHeading } from "@/components/SectionHeading";
import { ProfileCard } from "@/components/ProfileCard";
import { IslamicPattern } from "@/components/IslamicPattern";
import { site } from "@/data/site";
import { sisters, brothers } from "@/data/profiles";

const steps = [
  {
    n: 1,
    title: "Write a real profile",
    body: "A few paragraphs on your practice, your family and what you are looking for. No photo — this is what people read first.",
  },
  {
    n: 2,
    title: "Read and reach out",
    body: "Look through the members, send interest, and open a conversation when both sides agree — with the guardian able to follow along.",
  },
  {
    n: 3,
    title: "Meet, and decide",
    body: "Share guardian contact details, arrange a call, and plan to meet. The service is built to get you to that point quickly.",
  },
];

const rules = [
  "The Wali is part of it, start to finish",
  "Profiles are text — never photos",
  "Nothing on the platform outside the sharia",
  "Your name stays private until you share it",
];

export default function HomePage() {
  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-line bg-white">
        <div className="pointer-events-none absolute inset-0 opacity-[0.06] pattern-mask">
          <IslamicPattern className="h-full w-full" />
        </div>
        <Container className="relative py-20 sm:py-28">
          <div className="max-w-2xl">
            <p className="font-display text-sm font-semibold uppercase tracking-[0.2em] text-primary">
              {site.name}
            </p>
            <h1 className="mt-4 font-display text-4xl font-semibold leading-[1.1] tracking-tight text-ink sm:text-6xl">
              Marriage-minded Muslims,
              <br />
              ready when you are.
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-muted">
              A marriage introduction service for practicing Muslims. Read the
              whole profile first, keep the Wali involved from the start, and aim
              for a real meeting rather than months of messaging.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button href={site.registerUrl} size="lg">
                Start your free profile →
              </Button>
              <Button href="/members" variant="secondary" size="lg">
                See who is here
              </Button>
            </div>
          </div>
        </Container>
      </section>

      {/* Three steps */}
      <section className="py-20">
        <Container>
          <SectionHeading
            eyebrow="How it works"
            title="Three steps, then it is up to the families"
          />
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {steps.map((s) => (
              <div key={s.n} className="rounded-xl border border-line bg-white p-6 shadow-card">
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-primary-light font-display text-sm font-semibold text-primary">
                  {s.n}
                </span>
                <h3 className="mt-4 font-display text-lg font-semibold text-ink">{s.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">{s.body}</p>
              </div>
            ))}
          </div>
          <div className="mt-8">
            <Link href="/approach" className="text-sm font-medium text-primary hover:underline">
              Read the full approach →
            </Link>
          </div>
        </Container>
      </section>

      {/* Rules */}
      <section className="border-y border-line bg-cream py-16">
        <Container>
          <h2 className="font-display text-2xl font-semibold tracking-tight text-ink">
            The rules it runs on
          </h2>
          <ul className="mt-8 grid gap-4 sm:grid-cols-2">
            {rules.map((r) => (
              <li key={r} className="flex items-start gap-3 text-sm text-body">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                {r}
              </li>
            ))}
          </ul>
        </Container>
      </section>

      {/* Member preview */}
      <section className="py-20">
        <Container>
          <SectionHeading
            eyebrow="Members"
            title="Judge the person, not a photo"
            description="A few current members, shown exactly as every profile appears — in writing, with no photo."
          />
          <div className="mt-10 grid gap-4 sm:grid-cols-2">
            <ProfileCard profile={sisters[0]} />
            <ProfileCard profile={brothers[0]} />
            <ProfileCard profile={sisters[3]} />
            <ProfileCard profile={brothers[2]} />
          </div>
          <div className="mt-8">
            <Button href="/members" variant="secondary">
              Browse more members
            </Button>
          </div>
        </Container>
      </section>

      {/* One story */}
      <section className="border-y border-line bg-cream py-20">
        <Container className="max-w-3xl">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
            A story
          </p>
          <blockquote className="mt-4 font-display text-2xl leading-snug text-ink">
            “We were introduced in the spring, the guardians spoke within a few
            days, and the nikah was done before the summer. Nothing about it
            dragged.”
          </blockquote>
          <p className="mt-4 text-sm text-muted">Yahya &amp; Aisha · married 2025</p>
          <Link
            href="/stories"
            className="mt-6 inline-block text-sm font-medium text-primary hover:underline"
          >
            More stories, and how to share yours →
          </Link>
        </Container>
      </section>

      {/* Not the standard situation */}
      <section className="py-16">
        <Container>
          <h2 className="font-display text-2xl font-semibold tracking-tight text-ink">
            If your situation is different
          </h2>
          <div className="mt-8 grid gap-5 md:grid-cols-3">
            {[
              {
                title: "You are a guardian",
                body: "The Wali has a defined role — able to follow conversations, and the point of contact when things get serious.",
                href: "/for-guardians",
                cta: "For guardians",
              },
              {
                title: "You have no family Wali",
                body: "Sisters can choose an appointed Wali from a vetted register to represent them in the marriage contract.",
                href: "/independent-wali",
                cta: "Independent Wali",
              },
              {
                title: "You have been widowed",
                body: "Choose the widow / widower category from the start and connect with others who understand.",
                href: "/widows-and-widowers",
                cta: "Widows & widowers",
              },
            ].map((c) => (
              <div key={c.href} className="flex flex-col rounded-xl border border-line bg-white p-6 shadow-card">
                <h3 className="font-display text-lg font-semibold text-ink">{c.title}</h3>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-muted">{c.body}</p>
                <Link
                  href={c.href}
                  className="mt-4 text-sm font-medium text-primary hover:underline"
                >
                  {c.cta} →
                </Link>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* Closing CTA */}
      <section className="pb-4">
        <Container>
          <div className="relative overflow-hidden rounded-2xl bg-primary px-8 py-14 text-center text-white">
            <div className="pointer-events-none absolute inset-0 opacity-10">
              <IslamicPattern className="h-full w-full" />
            </div>
            <div className="relative mx-auto max-w-xl">
              <h2 className="font-display text-3xl font-semibold tracking-tight sm:text-4xl">
                Someone is hoping to read your profile.
              </h2>
              <p className="mt-4 text-white/80">
                {site.status} from {site.copyrightHolder}. Joining is free — write
                your profile and start reading today.
              </p>
              <div className="mt-8 flex justify-center">
                <Button href={site.registerUrl} variant="light" size="lg">
                  Start your free profile
                </Button>
              </div>
              <div className="mt-10 flex flex-wrap items-center justify-center gap-x-8 gap-y-2 text-sm text-white/70">
                <span>Free to join</span>
                <span className="hidden h-1 w-1 rounded-full bg-white/40 sm:block" />
                <span>Wali-led from the first message</span>
                <span className="hidden h-1 w-1 rounded-full bg-white/40 sm:block" />
                <span>Profiles are text, never photos</span>
              </div>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}

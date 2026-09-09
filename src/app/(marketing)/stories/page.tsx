import type { Metadata } from "next";
import { Container } from "@/components/Container";
import { Button } from "@/components/Button";
import { SectionHeading } from "@/components/SectionHeading";
import { site } from "@/data/site";

export const metadata: Metadata = {
  title: "Stories",
  description: `Married through ${site.name}? Tell us how it happened. Approved stories receive a thank-you payment.`,
};

const tiers = [
  {
    title: "A few written paragraphs, with a couple photo",
    reward: "$60",
    body: "Your account of how it happened, plus one photo of you together. Any sisters in the image have their face obscured before anything is published.",
  },
  {
    title: "A short recorded message",
    reward: "$175",
    body: "Two or three minutes on camera describing how you met and reached nikah through the service.",
  },
  {
    title: "Filming at the walimah",
    reward: "$300",
    body: "We send someone to your walimah to record a proper short film with you and your families.",
  },
];

const stories = [
  {
    quote:
      "We were introduced in the spring, the guardians spoke within a few days, and the nikah was done before the summer. Nothing about it dragged.",
    names: "Yahya & Aisha",
    detail: "Married 2025 · London",
  },
  {
    quote:
      "I had nearly given up on this kind of thing. Being able to read a full profile first meant I was not wasting anyone's time, mine included. Alhamdulillah for a husband who takes the deen seriously.",
    names: "Fatima",
    detail: "Married 2024 · Toronto",
  },
  {
    quote:
      "The absence of photos actually helped. We spoke properly, met with family present, and knew. It was two months from the first request to being married.",
    names: "Bilal & Sumayyah",
    detail: "Married 2025 · Birmingham",
  },
];

export default function SuccessStoriesPage() {
  return (
    <>
      <section className="border-b border-line bg-cream py-16">
        <Container>
          <SectionHeading
            eyebrow="Tell us your story"
            title="If it worked out, let others hear about it"
            description={`If you reached nikah through ${site.name}, we would like to hear how. Approved stories receive a thank-you payment, and they help others decide to take the step.`}
          />
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Button href={`mailto:${site.email}?subject=My%20story`} size="lg">
              Send us your story
            </Button>
            <Button href="#rewards" variant="secondary" size="lg">
              See the thank-you amounts
            </Button>
          </div>
        </Container>
      </section>

      {/* Existing stories */}
      <section className="py-20">
        <Container>
          <SectionHeading eyebrow="From members" title="Marriages that began here" />
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {stories.map((s) => (
              <figure key={s.names} className="flex flex-col rounded-xl border border-line bg-white p-6 shadow-card">
                <blockquote className="flex-1 text-sm leading-relaxed text-body">“{s.quote}”</blockquote>
                <figcaption className="mt-4">
                  <p className="text-sm font-semibold text-ink">{s.names}</p>
                  <p className="text-xs text-muted">{s.detail}</p>
                </figcaption>
              </figure>
            ))}
          </div>
        </Container>
      </section>

      {/* Reward levels */}
      <section id="rewards" className="scroll-mt-20 border-y border-line bg-cream py-20">
        <Container>
          <SectionHeading
            eyebrow="Thank-you amounts"
            title="Share as much as you are comfortable sharing"
            description="Every amount depends on us verifying the account and the story first. The more you are willing to put your name to, the larger the thank-you."
          />
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {tiers.map((t) => (
              <div key={t.title} className="flex flex-col rounded-xl border border-line bg-white p-6 shadow-card">
                <p className="font-display text-2xl font-semibold text-primary">{t.reward}</p>
                <h3 className="mt-3 font-display text-lg font-semibold text-ink">{t.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">{t.body}</p>
              </div>
            ))}
          </div>

          <div className="mt-10 grid gap-6 sm:grid-cols-3">
            {[
              { title: "Privacy comes first", body: "Sisters' faces are obscured before anything goes public. We publish first names only, the wording you approve, and no media you have not cleared." },
              { title: "We check before we pay", body: "The thank-you is sent once the account, the account of events, and your permissions have been confirmed." },
              { title: "No obligation to overshare", body: "A short written note is plenty. It still helps another brother or sister decide to begin." },
            ].map((b) => (
              <div key={b.title} className="rounded-xl border border-line bg-white p-6">
                <h3 className="font-display text-base font-semibold text-ink">{b.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">{b.body}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      <section className="py-20">
        <Container className="max-w-2xl text-center">
          <h2 className="font-display text-3xl font-semibold tracking-tight text-ink">
            Congratulations on your marriage
          </h2>
          <p className="mt-3 text-muted">
            Email us your account of how it happened and which option you have in
            mind. We will reply with what comes next. Payment follows once the
            story, the account and your permissions are confirmed.
          </p>
          <div className="mt-8 flex justify-center">
            <Button href={`mailto:${site.email}?subject=My%20story`} size="lg">
              Send us your story
            </Button>
          </div>
        </Container>
      </section>
    </>
  );
}

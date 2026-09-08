import type { Metadata } from "next";
import { Container } from "@/components/Container";
import { Button } from "@/components/Button";
import { SectionHeading } from "@/components/SectionHeading";
import { site } from "@/data/site";
import { independentWalis, independentWaliRules } from "@/data/walis";

export const metadata: Metadata = {
  title: "Independent Wali",
  description:
    "For sisters with no family guardian available: choose an appointed Wali from a vetted register to represent you in the marriage contract, under rules set by the Shariah and the Sunnah.",
};

const forWhom = [
  "Your father has passed away and you have no Muslim paternal male relatives",
  "You are a revert with no Muslim family",
  "Your guardian is unable or unwilling to act, or is not contactable",
  "You are far from family and need someone local to attend the nikah",
];

const steps = [
  {
    n: 1,
    title: "Open the register",
    body: "Every listed Wali is a known imam, officiant or centre trustee whose references have been checked. You see their role, location, languages and how long they have served.",
  },
  {
    n: 2,
    title: "Review a Wali's profile",
    body: "Read how each one works and what they require. Take your time; there is no obligation to choose anyone.",
  },
  {
    n: 3,
    title: "Send a request to one Wali",
    body: "Ask any questions you have first. Then send a request stating your situation and what you need him to do.",
  },
  {
    n: 4,
    title: "He reviews and accepts or declines",
    body: "The Wali considers your request under the app's guided rules. If he accepts, the two of you confirm the scope, duration and any fee in writing before he acts. Either side may end the arrangement later.",
  },
];

export default function IndependentWaliPage() {
  return (
    <>
      <section className="border-b border-line bg-cream py-16">
        <Container>
          <SectionHeading
            eyebrow="Independent Wali"
            title="A guardian for sisters who have none available"
            description="If there is no father, brother or other Mahram able to act as your Wali, you may choose an appointed one from a vetted register. He represents you in the marriage contract only, under rules set by the Shariah and the practice of the Prophet Muhammad ﷺ."
          />
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Button href={site.registerUrl} size="lg">
              Create a profile to request a Wali
            </Button>
            <Button href="#register" variant="secondary" size="lg">
              See the register
            </Button>
          </div>
        </Container>
      </section>

      {/* Who this is for */}
      <section className="py-16">
        <Container className="max-w-3xl">
          <h2 className="font-display text-2xl font-semibold text-ink">Who this is for</h2>
          <p className="mt-3 leading-relaxed text-muted">
            Sisters in situations such as these, where a family Wali is not an
            option:
          </p>
          <ul className="mt-6 space-y-3">
            {forWhom.map((f) => (
              <li key={f} className="flex items-start gap-3 text-sm text-body">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                {f}
              </li>
            ))}
          </ul>
          <p className="mt-6 text-sm leading-relaxed text-muted">
            Brothers do not need this service. A man is his own representative in
            the marriage contract.
          </p>
        </Container>
      </section>

      {/* How it works */}
      <section className="border-y border-line bg-cream py-16">
        <Container className="max-w-3xl">
          <h2 className="font-display text-2xl font-semibold text-ink">How it works</h2>
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

      {/* The rules */}
      <section className="py-16">
        <Container className="max-w-3xl">
          <h2 className="font-display text-2xl font-semibold text-ink">
            The rules he acts under
          </h2>
          <p className="mt-3 leading-relaxed text-muted">
            Both the sister and the Wali agree to these before anything begins.
          </p>
          <dl className="mt-8 divide-y divide-line border-y border-line">
            {independentWaliRules.map((r) => (
              <div key={r.title} className="py-5">
                <dt className="font-display font-semibold text-ink">{r.title}</dt>
                <dd className="mt-1.5 text-sm leading-relaxed text-muted">{r.body}</dd>
              </div>
            ))}
          </dl>
        </Container>
      </section>

      {/* Register */}
      <section id="register" className="scroll-mt-20 border-t border-line bg-cream py-16">
        <Container>
          <SectionHeading
            eyebrow="The register"
            title="Available Walis"
            description="A sample of the register. The full list, and the ability to send a request, opens once you have a profile."
          />
          <div className="mt-10 grid gap-5 md:grid-cols-2">
            {independentWalis.map((w) => (
              <article
                key={w.id}
                className="flex h-full flex-col rounded-xl border border-line bg-white p-6 shadow-card"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="font-display text-lg font-semibold text-ink">{w.name}</h3>
                    <p className="mt-0.5 text-sm text-muted">{w.role}</p>
                    <p className="text-sm text-muted">{w.location}</p>
                  </div>
                  <span
                    className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-medium ${
                      w.availability === "Available"
                        ? "bg-primary-light text-primary"
                        : w.availability === "Limited"
                          ? "bg-gold-light text-gold"
                          : "bg-cream-deep text-muted"
                    }`}
                  >
                    {w.availability}
                  </span>
                </div>
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {w.languages.map((l) => (
                    <span
                      key={l}
                      className="rounded-full border border-line bg-cream px-2.5 py-0.5 text-xs text-body"
                    >
                      {l}
                    </span>
                  ))}
                  <span className="rounded-full border border-line bg-cream px-2.5 py-0.5 text-xs text-body">
                    {w.yearsServing} yrs serving
                  </span>
                  {w.referencesVerified && (
                    <span className="rounded-full border border-line bg-cream px-2.5 py-0.5 text-xs text-body">
                      References verified
                    </span>
                  )}
                </div>
                <p className="mt-4 text-sm leading-relaxed text-body">{w.bio}</p>
                <div className="mt-5">
                  <Button
                    href={site.registerUrl}
                    variant={w.availability === "Full" ? "secondary" : "primary"}
                    className="w-full"
                  >
                    {w.availability === "Full" ? "Not taking requests" : "Request this Wali"}
                  </Button>
                </div>
              </article>
            ))}
          </div>
        </Container>
      </section>

      {/* Serve as a Wali */}
      <section className="py-16">
        <Container className="max-w-3xl">
          <div className="rounded-2xl border border-line bg-white p-8 shadow-card">
            <h2 className="font-display text-xl font-semibold text-ink">
              If you are qualified to serve as a Wali
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-muted">
              Imams, nikah officiants and centre trustees can apply to join the
              register. You will be asked for references and to agree to the same
              guided rules before being listed.
            </p>
            <div className="mt-5">
              <Button href={`mailto:${site.email}?subject=Independent%20wali%20register`}>
                Apply to be listed
              </Button>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}

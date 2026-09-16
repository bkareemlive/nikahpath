import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/Container";
import { Button } from "@/components/Button";
import { SectionHeading } from "@/components/SectionHeading";
import { ProfileCard } from "@/components/ProfileCard";
import { site } from "@/data/site";
import { widowedMembers } from "@/data/profiles";

export const metadata: Metadata = {
  title: "Widows & Widowers",
  description:
    "A dedicated space on NikahPathway for those who have been widowed — choose the category when you join, and connect with others who understand.",
};

const faqs = [
  {
    q: "When can I create a profile?",
    a: "A widow observes her iddah of four months and ten days (longer if pregnant, until she gives birth) before a new marriage contract. You are welcome to prepare a profile during that time, but the nikah itself waits until the iddah is complete.",
  },
  {
    q: "Should my late spouse's family be involved?",
    a: "That is your choice. Many members keep those ties close and involve them alongside their Wali. If relations are difficult, the independent Wali register is available to you.",
  },
  {
    q: "How do children fit into this?",
    a: "Profiles in this category note whether there are children and their general ages, so expectations are clear early. Meetings between a prospective spouse and children come much later, once the adults are serious and a guardian agrees.",
  },
  {
    q: "Is the pace different here?",
    a: "It can be. There is no expectation to move quickly. The category simply groups people who are likely to understand each other's situation without much explaining.",
  },
];

export default function WidowsAndWidowersPage() {
  return (
    <>
      <section className="border-b border-line bg-cream py-16">
        <Container>
          <SectionHeading
            eyebrow="Widows & widowers"
            title="A space to begin again, at your own pace"
            description="If you have been widowed, you can choose this category when you create your profile. It connects you with others who have carried the same loss, and it sets the tone for how conversations begin."
          />
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Button href={site.registerUrl} size="lg">
              Create a profile in this category
            </Button>
            <Button href="#members" variant="secondary" size="lg">
              See members
            </Button>
          </div>
        </Container>
      </section>

      {/* Why a separate space */}
      <section className="py-16">
        <Container className="max-w-3xl">
          <h2 className="font-display text-2xl font-semibold text-ink">Why a separate category</h2>
          <div className="prose-nikah mt-4">
            <p>
              Marrying again after losing a spouse comes with its own
              considerations — children, extended family, an iddah to observe,
              and a grief that does not run to anyone else&apos;s timetable.
            </p>
            <p>
              Choosing this category from the outset means you are seen by, and
              can filter to, others in the same position. There is less to
              explain, and the conversations tend to start from a place of shared
              understanding.
            </p>
          </div>
        </Container>
      </section>

      {/* How it's different */}
      <section className="border-y border-line bg-cream py-16">
        <Container className="max-w-3xl">
          <h2 className="font-display text-2xl font-semibold text-ink">
            How it works on {site.name}
          </h2>
          <ul className="mt-6 space-y-3">
            {[
              "You select the widow / widower category when you write your profile.",
              "Your profile notes whether you have children and their general ages.",
              "You can filter the members to others who have chosen this category.",
              "A Wali is still involved. If a family guardian is not available, the independent Wali register is open to you.",
            ].map((f) => (
              <li key={f} className="flex items-start gap-3 text-sm text-body">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                {f}
              </li>
            ))}
          </ul>
          <p className="mt-6 text-sm text-muted">
            Need an appointed guardian?{" "}
            <Link href="/independent-wali" className="font-medium text-primary hover:underline">
              Read about the independent Wali register →
            </Link>
          </p>
        </Container>
      </section>

      {/* Members */}
      <section id="members" className="scroll-mt-20 py-16">
        <Container>
          <SectionHeading
            eyebrow="Members"
            title="People in this category"
            description="A sample of members who have chosen the widow / widower category."
          />
          <div className="mt-10 grid gap-4 sm:grid-cols-2">
            {widowedMembers.map((p) => (
              <ProfileCard key={p.id} profile={p} />
            ))}
          </div>
        </Container>
      </section>

      {/* FAQ */}
      <section className="border-t border-line bg-cream py-16">
        <Container className="max-w-3xl">
          <h2 className="font-display text-2xl font-semibold text-ink">Things people ask</h2>
          <dl className="mt-8 divide-y divide-line border-y border-line">
            {faqs.map((f) => (
              <div key={f.q} className="py-5">
                <dt className="font-display font-semibold text-ink">{f.q}</dt>
                <dd className="mt-1.5 text-sm leading-relaxed text-muted">{f.a}</dd>
              </div>
            ))}
          </dl>
          <div className="mt-10">
            <Button href={site.registerUrl} size="lg">
              Start your free profile
            </Button>
          </div>
        </Container>
      </section>
    </>
  );
}

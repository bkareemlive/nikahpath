import type { Metadata } from "next";
import { Container } from "@/components/Container";
import { Button } from "@/components/Button";
import { SectionHeading } from "@/components/SectionHeading";
import { site } from "@/data/site";

export const metadata: Metadata = {
  title: "For Guardians",
  description:
    "How a Wali takes part on NikahPathway: what you can see, how conversations work, and how to raise a concern.",
};

const points = [
  {
    q: "You are meant to be here",
    a: "The service assumes a guardian is part of the process. A sister's profile records who her Wali is, and he can be looped into conversations rather than kept at arm's length.",
  },
  {
    q: "What you can see",
    a: "Once a conversation is open, the Wali can be given access to it. Nothing on the platform is hidden from a guardian who is taking an active role.",
  },
  {
    q: "How contact happens",
    a: "Members do not exchange phone numbers early. When both sides are serious, guardian contact details are shared and the families take over from there.",
  },
  {
    q: "Raising a concern",
    a: `If something is not right (a member misrepresenting themselves, pressure to move off-platform too quickly, anything improper), email ${site.email} and the team will look into it.`,
  },
];

export default function ForGuardiansPage() {
  return (
    <>
      <section className="border-b border-line bg-cream py-16">
        <Container>
          <SectionHeading
            eyebrow="For guardians"
            title="A note for the Wali"
            description="If someone in your family is using the service, here is how your role fits in and what to expect."
          />
        </Container>
      </section>

      <section className="py-16">
        <Container className="max-w-3xl">
          <div className="space-y-8">
            {points.map((p) => (
              <div key={p.q} className="border-l-2 border-primary pl-5">
                <h2 className="font-display text-lg font-semibold text-ink">{p.q}</h2>
                <p className="mt-1.5 text-sm leading-relaxed text-muted">{p.a}</p>
              </div>
            ))}
          </div>

          <div className="mt-12 rounded-2xl border border-line bg-cream p-8">
            <h2 className="font-display text-xl font-semibold text-ink">
              Starting a profile on someone&apos;s behalf
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-muted">
              A guardian can help set up and manage a profile with the member.
              Create an account, complete the form together, and keep the login
              details between you.
            </p>
            <div className="mt-5">
              <Button href={site.registerUrl}>Create an account</Button>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}

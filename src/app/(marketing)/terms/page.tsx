import type { Metadata } from "next";
import { Container } from "@/components/Container";
import { site } from "@/data/site";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: `The terms that govern your use of ${site.name}.`,
};

export default function TermsPage() {
  return (
    <section className="py-16">
      <Container className="max-w-3xl">
        <h1 className="font-display text-4xl font-semibold tracking-tight text-ink">
          Terms of Service
        </h1>
        <p className="mt-3 text-sm text-muted">Last updated: 1 January 2026</p>

        <div className="prose-nikah mt-10">
          <p>
            These terms are a placeholder for the {site.name} marketing site built
            in this project. Replace this content with your reviewed legal terms
            before any real launch.
          </p>
          <h2>1. Eligibility</h2>
          <p>
            {site.name} is intended for practicing Muslims of marriageable age who
            are seeking marriage. By creating a profile you confirm the
            information you provide is accurate.
          </p>
          <h2>2. Acceptable use</h2>
          <p>
            The service is for the sole purpose of seeking marriage. Harassment,
            impersonation, sharing of others&apos; contact details without consent,
            and any conduct contrary to the sharia are prohibited and may result
            in removal.
          </p>
          <h2>3. Payments and refunds</h2>
          <p>
            Paid plans are billed as described on the pricing page. Every paid
            plan is covered by a 7-day money-back guarantee.
          </p>
          <h2>4. Termination</h2>
          <p>
            You may close your account at any time. We may suspend accounts that
            breach these terms.
          </p>
          <h2>5. Contact</h2>
          <p>
            Questions about these terms can be sent to{" "}
            <a href={`mailto:${site.email}`}>{site.email}</a>.
          </p>
        </div>
      </Container>
    </section>
  );
}

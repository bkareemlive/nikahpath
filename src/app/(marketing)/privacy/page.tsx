import type { Metadata } from "next";
import { Container } from "@/components/Container";
import { site } from "@/data/site";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: `How ${site.name} handles your data.`,
};

export default function PrivacyPage() {
  return (
    <section className="py-16">
      <Container className="max-w-3xl">
        <h1 className="font-display text-4xl font-semibold tracking-tight text-ink">
          Privacy Policy
        </h1>
        <p className="mt-3 text-sm text-muted">Last updated: 1 January 2026</p>

        <div className="prose-nikah mt-10">
          <p>
            This is placeholder privacy content for the {site.name} marketing site
            in this project. Replace it with your reviewed policy before launch.
          </p>
          <h2>What we collect</h2>
          <p>
            Account details you provide, the contents of your profile, and basic
            usage data needed to run the service.
          </p>
          <h2>What we never do</h2>
          <ul>
            <li>Your information is not sold to third parties.</li>
            <li>We never share your name or contact details without your permission.</li>
            <li>We don&apos;t use usernames, so your profile can&apos;t be traced to your social media.</li>
          </ul>
          <h2>Photos</h2>
          <p>
            Profiles do not carry photos. Where a photo is submitted for a
            published success story, any sisters in it have their face obscured
            first.
          </p>
          <h2>Your controls</h2>
          <p>
            You can edit or delete your profile at any time. To request full
            account deletion, contact{" "}
            <a href={`mailto:${site.email}`}>{site.email}</a>.
          </p>
        </div>
      </Container>
    </section>
  );
}

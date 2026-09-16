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
        <p className="mt-3 text-sm text-muted">Last updated: 16 September 2026</p>

        <div className="prose-nikah mt-10">
          <p>
            This policy explains what {site.name}, operated by{" "}
            {site.copyrightHolder}, collects about you, why, and what control
            you have over it.
          </p>

          <h2>What we collect</h2>
          <ul>
            <li>
              <strong>Account details</strong> — the email address and password
              you sign up with.
            </li>
            <li>
              <strong>Profile information</strong> — what you write when
              creating and editing your profile: age, ethnicity, location,
              marital status, religious practice, what you are looking for, and
              similar details you choose to share.
            </li>
            <li>
              <strong>Guardian (Wali) details</strong> — if you have a family
              guardian, the name and contact details you provide for them; if
              you request an independent Wali, that request and the Wali&apos;s
              response.
            </li>
            <li>
              <strong>Messages</strong> — the content of interest requests and
              conversations with other members.
            </li>
            <li>
              <strong>Payment information</strong> — if you subscribe to a paid
              plan, Stripe processes your payment; we receive confirmation of
              your plan and a Stripe customer reference, never your full card
              details.
            </li>
            <li>
              <strong>Usage data</strong> — things like when you were last
              active and which profiles you have viewed, used to run features
              such as &ldquo;online now&rdquo; and &ldquo;who viewed you&rdquo;.
            </li>
          </ul>

          <h2>How we use it</h2>
          <p>We use your information to:</p>
          <ul>
            <li>run the core service — matching, interest requests, messaging, and guardian involvement;</li>
            <li>process payments and manage your plan;</li>
            <li>respond to reports and enforce our <a href="/terms">Terms of Service</a>;</li>
            <li>send you service emails — account confirmation, password resets, and activity on your account; and</li>
            <li>keep the service secure and working as intended.</li>
          </ul>
          <p>We do not use your information for advertising, and we do not sell it to anyone.</p>

          <h2>Who sees it</h2>
          <p>Depending on your plan and settings, other members and guardians can see:</p>
          <ul>
            <li>your active profile, shown to members of the opposite gender whose filters it matches;</li>
            <li>your guardian&apos;s contact details, shared with a match once a conversation opens between you;</li>
            <li>your full profile, if you are a sister who has an assigned independent Wali; and</li>
            <li>messages you send, visible to the person you are messaging and, where wali visibility applies, potentially to a family Wali following the conversation.</li>
          </ul>
          <p>Beyond that, we share information only with:</p>
          <ul>
            <li><strong>Stripe</strong>, to process payments;</li>
            <li><strong>Supabase</strong>, our database and authentication provider, which stores your data on our behalf;</li>
            <li><strong>Resend</strong>, to deliver account emails; and</li>
            <li>law enforcement or regulators, only where we are legally required to.</li>
          </ul>

          <h2>Your controls</h2>
          <p>
            You can edit your profile, pause your visibility, or unblock/report
            members at any time from your account. Closing your account from{" "}
            <a href="/account">Account settings</a> permanently and immediately
            deletes your profile, messages, and related data — this cannot be
            undone. You can also request deletion by contacting{" "}
            <a href={`mailto:${site.email}`}>{site.email}</a>.
          </p>

          <h2>Photos</h2>
          <p>
            Profiles do not carry photos. Where a photo is submitted for a
            published success story, any sisters in it have their face obscured
            first.
          </p>

          <h2>Security</h2>
          <p>
            Your data is encrypted in transit, and access to it is restricted by
            database-level rules so that members can only read what the service
            is designed to show them. Only a small number of trust &amp; safety
            team members can access reported accounts to review and act on
            reports.
          </p>

          <h2>International use</h2>
          <p>
            {site.name} is used by members around the world, and your
            information is processed and stored on infrastructure that may be
            located outside your own country. By using the service, you
            understand your information will be handled as described in this
            policy wherever it is processed.
          </p>

          <h2>Children</h2>
          <p>
            {site.name} is not intended for anyone under 18, and we do not
            knowingly collect information from anyone under that age. If you
            believe a minor has created a profile, contact us and we will
            remove it.
          </p>

          <h2>Cookies</h2>
          <p>
            We use only the cookies needed to keep you signed in and the
            service working. We do not use third-party advertising or tracking
            cookies.
          </p>

          <h2>Changes to this policy</h2>
          <p>
            We may update this policy from time to time. We will change the
            &ldquo;Last updated&rdquo; date above when we do.
          </p>

          <h2>Contact</h2>
          <p>
            Questions about this policy, or requests about your data, can be
            sent to <a href={`mailto:${site.email}`}>{site.email}</a>.
          </p>
        </div>
      </Container>
    </section>
  );
}

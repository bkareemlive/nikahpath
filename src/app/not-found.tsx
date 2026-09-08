import { Container } from "@/components/Container";
import { Button } from "@/components/Button";

export default function NotFound() {
  return (
    <section className="py-28">
      <Container className="max-w-lg text-center">
        <p className="font-display text-6xl font-semibold text-primary-mid">404</p>
        <h1 className="mt-4 font-display text-3xl font-semibold tracking-tight text-ink">
          This page wandered off
        </h1>
        <p className="mt-3 text-muted">
          The link may be old or mistyped. Let&apos;s get you back on the path.
        </p>
        <div className="mt-8 flex justify-center gap-3">
          <Button href="/">Back to home</Button>
          <Button href="/approach" variant="secondary">
            The approach
          </Button>
        </div>
      </Container>
    </section>
  );
}

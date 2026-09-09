import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Container } from "@/components/Container";
import { Button } from "@/components/Button";
import { posts, getPost } from "@/data/posts";
import { site } from "@/data/site";

export function generateStaticParams() {
  return posts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/journal/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) return {};
  return { title: post.title, description: post.excerpt };
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function renderBody(lines: string[]) {
  const out: React.ReactNode[] = [];
  let list: string[] = [];

  const flushList = (key: string) => {
    if (list.length) {
      out.push(
        <ul key={key}>
          {list.map((item, i) => (
            <li key={i}>{item}</li>
          ))}
        </ul>
      );
      list = [];
    }
  };

  lines.forEach((line, i) => {
    if (line.startsWith("- ")) {
      list.push(line.slice(2));
      return;
    }
    flushList(`ul-${i}`);
    if (line.startsWith("## ")) {
      out.push(<h2 key={i}>{line.slice(3)}</h2>);
    } else if (line.startsWith("### ")) {
      out.push(<h3 key={i}>{line.slice(4)}</h3>);
    } else if (line.startsWith("> ")) {
      out.push(<blockquote key={i}>{line.slice(2)}</blockquote>);
    } else {
      out.push(<p key={i}>{line}</p>);
    }
  });
  flushList("ul-end");
  return out;
}

export default async function BlogPostPage({ params }: PageProps<"/journal/[slug]">) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) notFound();

  const sameTheme = posts.filter((p) => p.slug !== post.slug && p.theme === post.theme);
  const more = (sameTheme.length ? sameTheme : posts.filter((p) => p.slug !== post.slug)).slice(0, 3);

  return (
    <>
      <article className="py-16">
        <Container className="max-w-3xl">
          <Link href="/journal" className="text-sm font-medium text-primary hover:underline">
            ← Back to the Journal
          </Link>
          <p className="mt-6 text-xs font-semibold uppercase tracking-[0.18em] text-primary">
            {post.theme}
          </p>
          <h1 className="mt-2 font-display text-4xl font-semibold leading-tight tracking-tight text-ink">
            {post.title}
          </h1>
          <p className="mt-4 text-sm text-muted">
            {post.author} · {formatDate(post.date)} · {post.readingTime}
          </p>

          <div className="prose-nikah mt-10">{renderBody(post.body)}</div>

          <div className="mt-12 rounded-2xl border border-line bg-cream p-8 text-center">
            <h2 className="font-display text-2xl font-semibold text-ink">
              Ready to begin your own search?
            </h2>
            <div className="mt-6 flex justify-center">
              <Button href={site.registerUrl}>Start your free profile</Button>
            </div>
          </div>
        </Container>
      </article>

      <section className="border-t border-line bg-cream py-16">
        <Container>
          <h2 className="font-display text-xl font-semibold text-ink">
            More on {post.theme.toLowerCase()}
          </h2>
          <div className="mt-6 grid gap-6 md:grid-cols-3">
            {more.map((p) => (
              <Link
                key={p.slug}
                href={`/journal/${p.slug}`}
                className="group rounded-xl border border-line bg-white p-6 shadow-card transition-colors hover:border-primary"
              >
                <h3 className="font-display text-base font-semibold text-ink group-hover:text-primary">
                  {p.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted line-clamp-3">
                  {p.excerpt}
                </p>
              </Link>
            ))}
          </div>
        </Container>
      </section>
    </>
  );
}

import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { Link, routing, type Locale } from "@/i18n/routing";
import { ensureTrailingSlash } from "@/lib/utils";
import { getAllBlogPosts } from "@/lib/blog";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://blockout.cc";

export async function generateStaticParams() {
  return routing.locales.map((lang) => ({ lang }));
}

export const dynamic = "force-static";
export const dynamicParams = false;

interface Props {
  params: Promise<{ lang: Locale }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = await params;
  setRequestLocale(lang);
  return {
    title: "Block Out! Blog — Tips, Comparisons & Strategy Guides",
    description:
      "Read the latest Block Out! tips, comparisons, and strategy guides. Beginner walkthroughs, game comparisons, and color-sort puzzle theory.",
    alternates: {
      canonical: ensureTrailingSlash(`/${lang}/blog`),
      languages: Object.fromEntries(
        routing.locales.map((l) => [l, ensureTrailingSlash(`/${l}/blog`)])
      ),
    },
    openGraph: {
      title: "Block Out! Blog",
      description: "Tips, comparisons, and strategy guides for Block Out!",
      url: `${SITE_URL}${ensureTrailingSlash(`/${lang}/blog`)}`,
      type: "website",
    },
  };
}

export default async function BlogIndexPage({ params }: Props) {
  const { lang } = await params;
  setRequestLocale(lang);
  const posts = getAllBlogPosts();

  return (
    <section className="pt-24 pb-16">
      <div className="container max-w-4xl">
        <nav
          aria-label="Breadcrumb"
          className="text-sm text-muted-foreground mb-6"
        >
          <ol className="flex flex-wrap items-center gap-1.5">
            <li>
              <Link href="/" className="hover:text-foreground">
                Home
              </Link>
            </li>
            <li aria-hidden>/</li>
            <li className="text-foreground">Blog</li>
          </ol>
        </nav>

        <header className="mb-10">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight">
            Block Out! Blog
          </h1>
          <p className="mt-4 text-base sm:text-lg text-muted-foreground max-w-2xl leading-relaxed">
            Tips, comparisons, and strategy guides for Block Out! and color-sort
            puzzle players.
          </p>
        </header>

        <ul className="grid gap-6 sm:grid-cols-2">
          {posts.map((post) => (
            <li
              key={post.slug}
              className="spring-hover rounded-2xl border bg-card overflow-hidden hover:border-foreground/15 hover:shadow-lg hover:shadow-foreground/5"
            >
              <Link href={`/blog/${post.slug}/`} className="block">
                {post.heroImage ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={post.heroImage}
                    alt={post.title}
                    className="block w-full h-44 object-cover"
                    loading="lazy"
                  />
                ) : null}
                <div className="p-5">
                  <div className="flex items-center gap-2 text-xs mb-3">
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-block-blue/10 text-block-blue px-2.5 py-0.5 font-semibold capitalize">
                      <span
                        className="block-tile h-1.5 w-1.5 bg-block-blue"
                        aria-hidden
                      />
                      {post.category}
                    </span>
                    <time
                      dateTime={post.date}
                      className="text-muted-foreground"
                    >
                      {post.date}
                    </time>
                  </div>
                  <h2 className="text-lg font-bold tracking-tight">
                    {post.title}
                  </h2>
                  <p className="mt-2 text-sm text-muted-foreground line-clamp-3">
                    {post.description}
                  </p>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

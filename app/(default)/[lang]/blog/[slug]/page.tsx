import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import { Link, routing, type Locale } from "@/i18n/routing";
import { getAlternateLanguageUrls, getLocaleUrl } from "@/lib/locale-path";
import { getAllBlogSlugs, getBlogPost } from "@/lib/blog";
import { StructuredData } from "@/components/common/StructuredData";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://blockout.cc";

export async function generateStaticParams() {
  const slugs = getAllBlogSlugs();
  const params: { lang: string; slug: string }[] = [];
  for (const lang of routing.locales) {
    for (const slug of slugs) {
      params.push({ lang, slug });
    }
  }
  return params;
}

export const dynamic = "force-static";
export const dynamicParams = false;

interface Props {
  params: Promise<{ lang: Locale; slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang, slug } = await params;
  setRequestLocale(lang);
  const post = getBlogPost(slug);
  if (!post) return {};
  const blogPath = `/blog/${slug}`;
  return {
    title: post.title,
    description: post.description,
    alternates: {
      canonical: getLocaleUrl(lang, blogPath),
      languages: getAlternateLanguageUrls(blogPath),
    },
    openGraph: {
      title: post.title,
      description: post.description,
      url: getLocaleUrl(lang, blogPath),
      type: "article",
      publishedTime: post.date,
      authors: [post.author],
      tags: post.tags,
      images: post.heroImage
        ? [{ url: `${SITE_URL}${post.heroImage}`, alt: post.title }]
        : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.description,
      images: post.heroImage ? [`${SITE_URL}${post.heroImage}`] : undefined,
    },
  };
}

export default async function BlogDetailPage({ params }: Props) {
  const { lang, slug } = await params;
  setRequestLocale(lang);
  const post = getBlogPost(slug);
  if (!post) notFound();

  const canonicalUrl = getLocaleUrl(lang, `/blog/${slug}`);
  const homeUrl = getLocaleUrl(lang, "/");
  const blogUrl = getLocaleUrl(lang, "/blog");

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.description,
    image: post.heroImage ? `${SITE_URL}${post.heroImage}` : undefined,
    datePublished: post.date,
    dateModified: post.date,
    author: {
      "@type": "Organization",
      name: post.author,
      url: SITE_URL,
    },
    publisher: {
      "@type": "Organization",
      name: "Block Out! Walkthrough",
      logo: {
        "@type": "ImageObject",
        url: `${SITE_URL}/images/store-assets/app_icon_512.png`,
      },
    },
    mainEntityOfPage: { "@type": "WebPage", "@id": canonicalUrl },
    keywords: post.tags.join(", "),
  };

  const breadcrumbList = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: homeUrl },
      { "@type": "ListItem", position: 2, name: "Blog", item: blogUrl },
      {
        "@type": "ListItem",
        position: 3,
        name: post.title,
        item: canonicalUrl,
      },
    ],
  };

  return (
    <>
      <StructuredData data={[articleSchema, breadcrumbList]} />
      <article className="pt-24 pb-16">
        <div className="container max-w-3xl">
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
              <li>
                <Link href="/blog/" className="hover:text-foreground">
                  Blog
                </Link>
              </li>
              <li aria-hidden>/</li>
              <li className="text-foreground line-clamp-1">{post.title}</li>
            </ol>
          </nav>

          <header className="mb-8">
            <div className="flex items-center gap-2 text-xs mb-4">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-block-blue/10 text-block-blue px-2.5 py-0.5 font-semibold capitalize">
                <span className="block-tile h-1.5 w-1.5 bg-block-blue" aria-hidden />
                {post.category}
              </span>
              <time dateTime={post.date} className="text-muted-foreground">
                {post.date}
              </time>
              <span aria-hidden className="text-muted-foreground">·</span>
              <span className="text-muted-foreground">{post.author}</span>
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-balance leading-[1.1]">
              {post.title}
            </h1>
            <p className="mt-4 text-base sm:text-lg text-muted-foreground leading-relaxed text-pretty">
              {post.description}
            </p>
          </header>

          {post.heroImage ? (
            <figure className="mb-10 rounded-2xl overflow-hidden border bg-card">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={post.heroImage}
                alt={post.title}
                className="block w-full h-auto"
              />
            </figure>
          ) : null}

          <div
            className="blog-prose"
            dangerouslySetInnerHTML={{ __html: post.html }}
          />

          <hr className="my-12 border-t" />
          <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
            <span className="font-semibold text-foreground">Tagged:</span>
            {post.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-full border bg-card px-2.5 py-0.5 text-foreground text-xs font-medium"
              >
                {tag}
              </span>
            ))}
          </div>

          <div className="mt-8">
            <Link
              href="/blog/"
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:gap-2.5 transition-all"
            >
              ← Back to all posts
            </Link>
          </div>
        </div>
      </article>
    </>
  );
}

import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { marked } from "marked";

export interface BlogFrontmatter {
  slug: string;
  title: string;
  description: string;
  date: string;
  author: string;
  category: string;
  tags: string[];
  heroImage?: string;
}

export interface BlogPost extends BlogFrontmatter {
  html: string;
  body: string;
}

const BLOG_DIR = path.join(process.cwd(), "content", "blog");

marked.setOptions({ gfm: true, breaks: false });

function loadFile(slug: string): BlogPost | null {
  const file = path.join(BLOG_DIR, `${slug}.mdx`);
  if (!fs.existsSync(file)) return null;
  const raw = fs.readFileSync(file, "utf8");
  const { data, content } = matter(raw);
  const html = marked.parse(content) as string;
  return {
    slug: data.slug ?? slug,
    title: data.title ?? "",
    description: data.description ?? "",
    date: data.date ?? "",
    author: data.author ?? "Block Out! Walkthrough Team",
    category: data.category ?? "Guide",
    tags: data.tags ?? [],
    heroImage: data.heroImage,
    html,
    body: content,
  };
}

export function getAllBlogPosts(): BlogPost[] {
  if (!fs.existsSync(BLOG_DIR)) return [];
  const files = fs
    .readdirSync(BLOG_DIR)
    .filter((f) => f.endsWith(".mdx"))
    .map((f) => f.replace(/\.mdx$/, ""));
  const posts = files
    .map((slug) => loadFile(slug))
    .filter((p): p is BlogPost => p !== null);
  return posts.sort((a, b) => (a.date < b.date ? 1 : -1));
}

export function getBlogPost(slug: string): BlogPost | null {
  return loadFile(slug);
}

export function getAllBlogSlugs(): string[] {
  return getAllBlogPosts().map((p) => p.slug);
}

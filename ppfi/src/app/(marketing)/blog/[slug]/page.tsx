import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

import { Badge } from "@/components/ui/badge";
import { getBlogPostBySlug, getBlogPosts } from "@/features/content";

type Params = Promise<{ slug: string }>;

export async function generateStaticParams() {
  return (await getBlogPosts()).map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { slug } = await params;
  const post = await getBlogPostBySlug(slug);
  if (!post) return { title: "Post not found" };
  return {
    title: post.title,
    description: post.excerpt,
    openGraph: {
      type: "article",
      title: post.title,
      description: post.excerpt,
      images: [post.image],
      publishedTime: post.publishedAt,
    },
  };
}

function formatDate(date: string) {
  return new Date(date).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export default async function BlogPostPage({ params }: { params: Params }) {
  const { slug } = await params;
  const post = await getBlogPostBySlug(slug);
  if (!post) notFound();

  return (
    <article className="container py-16">
      <div className="mx-auto max-w-3xl">
        <Link href="/blog" className="text-sm text-muted-foreground hover:text-foreground">
          ← All posts
        </Link>

        <div className="mt-6">
          <Badge variant="muted">{post.category}</Badge>
          <h1 className="mt-4 font-display text-4xl font-semibold tracking-tight">
            {post.title}
          </h1>
          <p className="mt-4 text-sm text-muted-foreground">
            By {post.author} · {formatDate(post.publishedAt)} · {post.readingMinutes} min
            read
          </p>
        </div>

        <div className="relative mt-8 aspect-[16/9] overflow-hidden rounded-xl border">
          <Image
            src={post.image}
            alt={post.title}
            fill
            sizes="(max-width: 768px) 100vw, 768px"
            className="object-cover"
            priority
          />
        </div>

        <div className="mt-10 space-y-5 text-pretty text-lg leading-relaxed text-muted-foreground">
          <p className="text-xl font-medium text-foreground">{post.excerpt}</p>
          <p>{post.content}</p>
        </div>
      </div>
    </article>
  );
}

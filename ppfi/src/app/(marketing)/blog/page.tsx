import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

import { Reveal } from "@/components/marketing/reveal";
import { SectionHeading } from "@/components/marketing/section-heading";
import { Badge } from "@/components/ui/badge";
import { getBlogPosts } from "@/features/content";

export const metadata: Metadata = {
  title: "Blog",
  description:
    "Insights on film, media, marketing and building a creative career from the Pixel Perfect Films Institute team.",
};

function formatDate(date: string) {
  return new Date(date).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export default function BlogPage() {
  const posts = getBlogPosts();

  return (
    <div className="container py-20">
      <SectionHeading
        eyebrow="Blog"
        title="Ideas, craft and career"
        description="Practical writing from working professionals on making better creative work."
      />

      <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {posts.map((post, i) => (
          <Reveal key={post.slug} delay={i * 0.05}>
            <Link
              href={`/blog/${post.slug}`}
              className="group flex h-full flex-col overflow-hidden rounded-xl border bg-card transition-all hover:-translate-y-1 hover:shadow-lg"
            >
              <div className="relative aspect-[16/10] overflow-hidden">
                <Image
                  src={post.image}
                  alt={post.title}
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              <div className="flex flex-1 flex-col p-5">
                <Badge variant="muted" className="w-fit">
                  {post.category}
                </Badge>
                <h3 className="mt-3 font-display text-lg font-semibold">{post.title}</h3>
                <p className="mt-1.5 line-clamp-2 flex-1 text-sm text-muted-foreground">
                  {post.excerpt}
                </p>
                <p className="mt-4 text-xs text-muted-foreground">
                  {formatDate(post.publishedAt)} · {post.readingMinutes} min read
                </p>
              </div>
            </Link>
          </Reveal>
        ))}
      </div>
    </div>
  );
}

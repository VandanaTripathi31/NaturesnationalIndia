"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Calendar, Tag as TagIcon, User } from "lucide-react";
import Breadcrumb from "../Breadcrumb";
import BlogCard, { formatBlogDate } from "./BlogCard";
import { resolveImageUrl } from "../../lib/image-url";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
};

export default function BlogDetailView({ blog, related = [] }) {
  const heroImageUrl = resolveImageUrl(blog.image, `blog-detail:${blog.title}`);
  const category = blog.categories?.[0];

  return (
    <div className="min-h-screen w-full" style={{ background: "var(--color-cream-white)" }}>
      <article className="px-6 py-10 sm:px-10 lg:px-16">
        <div className="mx-auto max-w-3xl">
          <Breadcrumb
            items={[{ label: "Blog", href: "/blog" }, { label: blog.title }]}
          />

          <motion.div initial="hidden" animate="visible" variants={fadeUp}>
            {category && (
              <span className="mb-3 inline-block rounded-full bg-[var(--color-dark-brown)] px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-[var(--color-cream-white)]">
                {category.title}
              </span>
            )}
            <h1 className="font-playfair text-3xl font-semibold leading-tight text-[var(--color-text-primary)] sm:text-4xl">
              {blog.title}
            </h1>

            <div className="mt-4 flex flex-wrap items-center gap-4 text-[13px] text-[var(--color-text-muted)]">
              {blog.publishedAt && (
                <span className="flex items-center gap-1.5">
                  <Calendar size={14} /> {formatBlogDate(blog.publishedAt)}
                </span>
              )}
              {blog.author && (
                <span className="flex items-center gap-1.5">
                  <User size={14} /> {blog.author}
                </span>
              )}
            </div>
          </motion.div>

          {heroImageUrl && (
            <div className="relative mt-8 aspect-[16/9] w-full overflow-hidden rounded-2xl bg-white">
              <Image
                src={heroImageUrl}
                alt={blog.title}
                fill
                priority
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 768px"
              />
            </div>
          )}

          {/* Article body — sanitized HTML at migration time (see
              backend/migration/migrate-blogs.js), same trusted-HTML render
              pattern already used for Category.content. */}
          <div
            className="blog-content prose mt-10 max-w-none text-[15px] leading-relaxed text-[var(--color-text-primary)] [&_h1]:font-playfair [&_h1]:text-2xl [&_h1]:font-semibold [&_h2]:font-playfair [&_h2]:mt-8 [&_h2]:text-2xl [&_h2]:font-semibold [&_h3]:mt-6 [&_h3]:font-playfair [&_h3]:text-xl [&_h3]:font-semibold [&_p]:my-4 [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:list-decimal [&_ol]:pl-5 [&_a]:text-[var(--color-dark-brown)] [&_a]:underline [&_img]:rounded-xl [&_img]:my-6"
            dangerouslySetInnerHTML={{ __html: blog.content }}
          />

          {blog.tags?.length > 0 && (
            <div className="mt-10 flex flex-wrap items-center gap-2 border-t border-[var(--color-warm-gray)] pt-6">
              <span className="text-sm font-semibold text-[var(--color-text-primary)]">
                Tags:
              </span>
              {blog.tags.map((tag) => (
                <span
                  key={tag}
                  className="flex items-center gap-1 rounded-full bg-[var(--color-off-white)] px-2.5 py-1 text-[11.5px] text-[var(--color-brown-muted)]"
                >
                  <TagIcon size={10} /> {tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </article>

      {related.length > 0 && (
        <section className="px-6 py-14 sm:px-10 lg:px-16">
          <div className="mx-auto max-w-7xl">
            <h2 className="font-playfair mb-8 text-2xl font-semibold text-[var(--color-text-primary)]">
              Related Articles
            </h2>
            <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
              {related.map((item, i) => (
                <BlogCard key={item.id} blog={item} index={i} />
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}

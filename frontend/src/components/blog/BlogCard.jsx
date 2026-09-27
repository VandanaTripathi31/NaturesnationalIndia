"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Calendar, Tag as TagIcon, User } from "lucide-react";
import SafeImage from "../ui/SafeImage";
import { resolveImageUrl } from "../../lib/image-url";

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] },
  }),
};

export function formatBlogDate(value) {
  if (!value) return "";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default function BlogCard({ blog, index = 0 }) {
  const imageUrl = resolveImageUrl(blog.image, `blog-card:${blog.title}`);
  const category = blog.categories?.[0];

  return (
    <motion.article
      variants={fadeUp}
      custom={index}
      className="group relative flex flex-col overflow-hidden rounded-2xl border border-[var(--color-warm-gray)] bg-[var(--color-cream-white)] shadow-sm"
      style={{ boxShadow: "0 2px 20px rgba(92,64,51,0.07)" }}
    >
      <Link href={`/blog/${blog.slug}`} className="relative block aspect-[16/10] overflow-hidden bg-white">
        <SafeImage
          src={imageUrl}
          alt={blog.title}
          fill
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, 33vw"
        />
        {category && (
          <span className="absolute left-3 top-3 rounded-full bg-[var(--color-dark-brown)] px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-[var(--color-cream-white)]">
            {category.title}
          </span>
        )}
      </Link>

      <div className="flex flex-1 flex-col p-5">
        <div className="mb-2 flex flex-wrap items-center gap-3 text-[11.5px] text-[var(--color-text-muted)]">
          {blog.publishedAt && (
            <span className="flex items-center gap-1">
              <Calendar size={12} /> {formatBlogDate(blog.publishedAt)}
            </span>
          )}
          {blog.author && (
            <span className="flex items-center gap-1">
              <User size={12} /> {blog.author}
            </span>
          )}
        </div>

        <Link
          href={`/blog/${blog.slug}`}
          className="font-playfair text-lg font-semibold leading-snug text-[var(--color-text-primary)] transition hover:text-[var(--color-dark-brown)]"
        >
          {blog.title}
        </Link>

        {blog.excerpt && (
          <p className="mt-2.5 line-clamp-3 text-[13.5px] leading-relaxed text-[var(--color-text-muted)]">
            {blog.excerpt}
          </p>
        )}

        {blog.tags?.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-1.5">
            {blog.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="flex items-center gap-1 rounded-full bg-[var(--color-off-white)] px-2 py-0.5 text-[10.5px] text-[var(--color-brown-muted)]"
              >
                <TagIcon size={9} /> {tag}
              </span>
            ))}
          </div>
        )}

        <Link
          href={`/blog/${blog.slug}`}
          className="mt-auto pt-5 text-[12.5px] font-semibold text-[var(--color-dark-brown)] underline-offset-4 hover:underline"
        >
          Read More →
        </Link>
      </div>
    </motion.article>
  );
}

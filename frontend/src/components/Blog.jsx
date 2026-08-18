"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getBlogs } from "../services/blogService";
import { resolveImageUrl } from "../lib/image-url";
import SafeImage from "./ui/SafeImage";

const ayurvedicOilImg = "/images/Brahmi-Ayurvedic-Hair-Oil-Ps.jpg";
const essentialOilImg = "/images/essential-oil.jpg";
const carrierOilImg = "/images/castor oil.jpeg";

// Static fallback — shown until the real posts load, and kept as a safety
// net if the API call fails/returns nothing, so this section never goes
// blank on the homepage.
const FALLBACK_POSTS = [
  {
    title: "Top 10 Essential Oils for B2B Cosmetic Formulations in 2026",
    category: "Essential Oils Guide",
    text: "A manufacturer's guide to the most in-demand oils for skincare, haircare and wellness formulations globally.",
    action: "Read article",
    image: essentialOilImg,
    href: "/blog",
  },
  {
    title: "Castor Oil: Quality Grades & What Importers Must Know",
    category: "Carrier Oils",
    text: "Everything importers need to know about quality grades, sourcing regions and certification requirements.",
    action: "Read article",
    image: carrierOilImg,
    href: "/blog",
  },
  {
    title: "Understanding Ayurvedic Oils: A Guide for International Buyers",
    category: "Ayurveda",
    text: "From Bhringraj to Brahmi — the growing global demand for authentic Ayurvedic oils.",
    action: "Read article",
    image: ayurvedicOilImg,
    href: "/blog",
  },
];

// Real migrated posts → same card shape as FALLBACK_POSTS.
function toCardPost(blog) {
  return {
    title: blog.title,
    category: blog.categories?.[0]?.title || "Natures Natural India",
    text: blog.excerpt || "",
    action: "Read article",
    image: resolveImageUrl(blog.image, `home-blog:${blog.title}`),
    href: `/blog/${blog.slug}`,
  };
}

const Blog = () => {
  const [posts, setPosts] = useState(FALLBACK_POSTS);

  useEffect(() => {
    let cancelled = false;
    getBlogs({ page: 1, limit: 3 })
      .then(({ blogs }) => {
        if (!cancelled && blogs.length > 0) {
          setPosts(blogs.map(toCardPost));
        }
      })
      .catch(() => {
        // Keep the static fallback — see FALLBACK_POSTS comment above.
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return renderBlog(posts);
};

const renderBlog = (posts) => (
  <section
    id="blog-sec"
    style={{ backgroundColor: "var(--color-cream-white)" }}
    className="py-20"
  >
    <div className="max-w-[1220px] mx-auto px-6 sm:px-8">
      {/* Header — site-wide pattern */}
      <div style={{ textAlign: "center", marginBottom: 48 }}>
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 10,
            marginBottom: 12,
          }}
        >
          <span
            style={{
              display: "inline-block",
              width: 24,
              height: 1.5,
              background:
                "linear-gradient(90deg, transparent, var(--color-brown-light))",
              borderRadius: 2,
            }}
          />
          <p
            style={{
              fontSize: 11,
              fontWeight: 700,
              color: "var(--color-brown-muted)",
              letterSpacing: "0.24em",
              textTransform: "uppercase",
              margin: 0,
              fontFamily: "'DM Sans', system-ui, sans-serif",
            }}
          >
            Knowledge Center
          </p>
          <span
            style={{
              display: "inline-block",
              width: 24,
              height: 1.5,
              background:
                "linear-gradient(90deg, var(--color-brown-light), transparent)",
              borderRadius: 2,
            }}
          />
        </div>

        <h2
          style={{
            fontFamily:
              "'Cormorant Garamond', 'Playfair Display', Georgia, serif",
            fontSize: "clamp(24px, 4vw, 36px)",
            fontWeight: 600,
            color: "var(--color-text-primary)",
            letterSpacing: "0.01em",
            marginBottom: 12,
          }}
        >
          Blog &amp; Industry Insights
        </h2>

        <div
          style={{
            width: 40,
            height: 2,
            background:
              "linear-gradient(90deg, var(--color-brown-light), var(--color-brown-muted))",
            margin: "0 auto",
            borderRadius: 2,
          }}
        />
      </div>

      {/* Cards */}
      <div className="mt-12 grid gap-6 lg:grid-cols-3">
        {posts.map((post) => (
          <Link
            href={post.href}
            key={post.title}
            style={{
              display: "block",
              textDecoration: "none",
              color: "inherit",
              overflow: "hidden",
              borderRadius: 4,
              border: "1px solid var(--color-warm-gray)",
              backgroundColor: "var(--color-off-white)",
              boxShadow: "0 2px 10px rgba(92,64,51,0.06)",
              transition:
                "transform 0.3s ease, box-shadow 0.3s ease, border-color 0.25s ease",
              cursor: "pointer",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-4px)";
              e.currentTarget.style.boxShadow =
                "0 12px 32px rgba(92,64,51,0.13)";
              e.currentTarget.style.borderColor = "var(--color-brown-light)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow =
                "0 2px 10px rgba(92,64,51,0.06)";
              e.currentTarget.style.borderColor = "var(--color-warm-gray)";
            }}
          >
            {/* Image */}
            <div
              style={{
                position: "relative",
                height: 200,
                overflow: "hidden",
              }}
            >
              <SafeImage
                src={post.image}
                alt={post.title}
                fill
                sizes="(max-width: 1024px) 100vw, 33vw"
                style={{
                  objectFit: "cover",
                  objectPosition: "center",
                  transition: "transform 0.5s ease",
                }}
              />
            </div>

            {/* Body */}
            <div style={{ padding: "22px 22px 20px" }}>
              <div
                style={{
                  fontSize: 10,
                  textTransform: "uppercase",
                  letterSpacing: "0.22em",
                  color: "var(--color-brown-muted)",
                  fontWeight: 700,
                  fontFamily: "'DM Sans', system-ui, sans-serif",
                  marginBottom: 10,
                }}
              >
                {post.category}
              </div>

              <h3
                style={{
                  fontFamily:
                    "'Cormorant Garamond', 'Playfair Display', Georgia, serif",
                  fontSize: 17,
                  fontWeight: 600,
                  color: "var(--color-text-primary)",
                  lineHeight: 1.4,
                  marginBottom: 10,
                  letterSpacing: "0.01em",
                }}
              >
                {post.title}
              </h3>

              <p
                style={{
                  fontSize: 13,
                  lineHeight: 1.75,
                  color: "var(--color-text-muted)",
                  fontFamily: "'DM Sans', system-ui, sans-serif",
                  marginBottom: 18,
                  fontWeight: 400,
                }}
              >
                {post.text}
              </p>

              <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 6,
                  fontSize: 11,
                  textTransform: "uppercase",
                  letterSpacing: "0.18em",
                  color: "var(--color-dark-brown)",
                  fontWeight: 700,
                  fontFamily: "'DM Sans', system-ui, sans-serif",
                  paddingBottom: 2,
                  borderBottom: "1px solid var(--color-brown-light)",
                }}
              >
                {post.action}
                <span style={{ fontSize: 13 }}>→</span>
              </div>
            </div>
          </Link>
        ))}
      </div>

      <div style={{ textAlign: "center", marginTop: 40 }}>
        <Link
          href="/blog"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 6,
            fontSize: 12,
            textTransform: "uppercase",
            letterSpacing: "0.18em",
            color: "var(--color-cream-white)",
            fontWeight: 700,
            fontFamily: "'DM Sans', system-ui, sans-serif",
            background: "var(--color-dark-brown)",
            padding: "12px 28px",
            borderRadius: 4,
            textDecoration: "none",
          }}
        >
          View All Articles <span style={{ fontSize: 14 }}>→</span>
        </Link>
      </div>
    </div>
  </section>
);

export default Blog;

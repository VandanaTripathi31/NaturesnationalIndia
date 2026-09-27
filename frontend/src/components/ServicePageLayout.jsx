"use client";

import Link from "next/link";
import { ChevronRight } from "lucide-react";
import FadeIn from "./FadeIn";

function openInquiry() {
  window.dispatchEvent(new CustomEvent("open-inquiry"));
}

/**
 * Shared layout for the new content pages (About Us, Our Offices, Policies,
 * Distillation methods, Private Label services, Packaging).
 *
 * Reuses the exact visual language already established elsewhere in the
 * codebase: the full-bleed hero + breadcrumb from src/views/OurCertification.jsx,
 * and the FadeIn / card / CTA patterns from src/views/QualityAssurance.jsx.
 * Keeping this in one place means every new page automatically stays
 * consistent with the rest of the site.
 */
export default function ServicePageLayout({
  eyebrow,
  title,
  subtitle,
  heroImage,
  breadcrumb,
  intro,
  highlights,
  steps,
  gallery,
  cta,
  children,
}) {
  return (
    <div
      className="bg-[#f8f5f2] text-[#1a0f0a]"
      style={{ fontFamily: "'Outfit',sans-serif" }}
    >
      {/* HERO */}
      <section className="relative min-h-[440px] sm:min-h-[520px] flex items-end overflow-hidden">
        <div className="absolute inset-0">
          <img
            src={heroImage}
            alt={title}
            className="w-full h-full object-cover object-center"
          />
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(135deg, rgba(42,26,16,0.92) 0%, rgba(62,43,30,0.82) 55%, rgba(111,78,55,0.62) 100%)",
            }}
          />
        </div>
        <div className="relative z-10 max-w-6xl mx-auto px-6 sm:px-8 pb-14 pt-32 w-full">
          {eyebrow && (
            <div className="flex items-center gap-3 text-[#e8c98a] text-xs font-bold tracking-[0.2em] uppercase mb-4">
              <span className="w-7 h-px bg-[#c4a882]" />
              {eyebrow}
            </div>
          )}
          <h1
            style={{ fontFamily: "'Playfair Display',serif" }}
            className="text-4xl sm:text-5xl font-semibold text-white leading-tight mb-4 max-w-2xl"
          >
            {title}
          </h1>
          {subtitle && (
            <p className="text-white/75 text-base sm:text-lg leading-relaxed max-w-xl mb-8">
              {subtitle}
            </p>
          )}
          <nav className="flex items-center gap-2 text-sm">
            <Link
              href="/"
              className="transition-colors hover:opacity-80"
              style={{ color: "var(--color-warm-gray, #d6d0ca)" }}
            >
              Home
            </Link>
            <ChevronRight
              className="w-4 h-4"
              style={{ color: "var(--color-brown-muted, #a8896c)" }}
            />
            <span className="font-semibold" style={{ color: "#e8c98a" }}>
              {breadcrumb || title}
            </span>
          </nav>
        </div>
      </section>

      {/* INTRO */}
      {intro && (
        <section className="py-20 sm:py-24">
          <div className="max-w-4xl mx-auto px-6 text-center">
            <FadeIn>
              {intro.heading && (
                <h2
                  style={{ fontFamily: "'Playfair Display',serif" }}
                  className="text-3xl sm:text-4xl font-semibold text-[#3e2b1e] mb-6"
                >
                  {intro.heading}
                </h2>
              )}
              {intro.paragraphs?.map((p, i) => (
                <p
                  key={i}
                  className="text-[#6b5a4e] leading-relaxed text-base sm:text-lg mb-4 last:mb-0"
                >
                  {p}
                </p>
              ))}
            </FadeIn>
          </div>
        </section>
      )}

      {/* HIGHLIGHTS / FEATURE CARDS */}
      {highlights && highlights.length > 0 && (
        <section className="pb-20 sm:pb-24">
          <div className="max-w-6xl mx-auto px-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {highlights.map((h, i) => (
                <FadeIn key={i} delay={i * 70}>
                  <div className="bg-white border border-[#ede8e3] rounded-3xl p-7 h-full hover:shadow-xl hover:border-[#c4a882] hover:-translate-y-1 transition-all duration-300">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#f0e4d4] to-[#ede0cc] flex items-center justify-center mb-5 text-[#7a5544] text-xl">
                      {h.icon}
                    </div>
                    <h3 className="font-bold text-[#3e2b1e] text-base mb-2">
                      {h.title}
                    </h3>
                    <p className="text-[#6b5a4e] text-sm leading-relaxed">
                      {h.desc}
                    </p>
                  </div>
                </FadeIn>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* PROCESS STEPS */}
      {steps && steps.length > 0 && (
        <section className="py-20 sm:py-24 bg-gradient-to-b from-[#f0e8de] to-[#f8f5f2]">
          <div className="max-w-5xl mx-auto px-6">
            <FadeIn>
              <div className="text-center max-w-xl mx-auto mb-14">
                <div className="flex items-center justify-center gap-3 text-[#7a5544] text-xs font-bold tracking-widest uppercase mb-4">
                  <span className="w-7 h-px bg-[#c4a882]" />
                  How It Works
                  <span className="w-7 h-px bg-[#c4a882]" />
                </div>
                <h2
                  style={{ fontFamily: "'Playfair Display',serif" }}
                  className="text-3xl sm:text-4xl font-semibold text-[#3e2b1e]"
                >
                  Our Process
                </h2>
              </div>
            </FadeIn>
            <div className="space-y-4">
              {steps.map((s, i) => (
                <FadeIn key={i} delay={i * 80}>
                  <div className="flex gap-5 items-start bg-white border border-[#ede8e3] rounded-2xl p-6 hover:border-[#c4a882] transition-colors duration-300">
                    <div
                      className="flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm"
                      style={{
                        background:
                          "linear-gradient(135deg, #5c4033, #6f4e37)",
                        color: "#f8f5f2",
                      }}
                    >
                      {String(i + 1).padStart(2, "0")}
                    </div>
                    <div>
                      <h4 className="font-bold text-[#3e2b1e] text-sm sm:text-base mb-1.5">
                        {s.title}
                      </h4>
                      <p className="text-[#6b5a4e] text-sm leading-relaxed">
                        {s.desc}
                      </p>
                    </div>
                  </div>
                </FadeIn>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* GALLERY */}
      {gallery && gallery.length > 0 && (
        <section className="py-20 sm:py-24">
          <div className="max-w-6xl mx-auto px-6">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {gallery.map((g, i) => (
                <FadeIn key={i} delay={i * 60}>
                  <div className="rounded-2xl overflow-hidden aspect-[4/3] group relative">
                    <img
                      src={g.src}
                      alt={g.alt}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    {g.label && (
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex items-end p-3">
                        <span className="text-white text-xs font-semibold tracking-wide">
                          {g.label}
                        </span>
                      </div>
                    )}
                  </div>
                </FadeIn>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Arbitrary extra content (e.g. Policies accordion) */}
      {children}

      {/* CTA */}
      {cta !== false && (
        <section className="relative py-28 sm:py-32 overflow-hidden text-center">
          <div className="absolute inset-0">
            <div
              className="w-full h-full"
              style={{ background: "var(--gradient-hero)" }}
            />
          </div>
          <div className="relative z-10 max-w-2xl mx-auto px-6">
            <FadeIn>
              <div className="inline-flex items-center gap-2 bg-[#c4a882]/20 border border-[#c4a882]/40 text-[#c4a882] rounded-full px-5 py-2 text-xs font-semibold tracking-widest uppercase mb-8">
                ✦ {cta?.eyebrow || "Get In Touch"}
              </div>
              <h2
                style={{ fontFamily: "'Playfair Display',serif" }}
                className="text-3xl sm:text-4xl lg:text-5xl font-semibold text-white mb-6 leading-tight"
              >
                {cta?.heading || (
                  <>
                    Ready to Start Your
                    <br />
                    <span className="text-[#c4a882]">Enquiry?</span>
                  </>
                )}
              </h2>
              <p className="text-white/75 text-base sm:text-lg leading-relaxed mb-10">
                {cta?.subtext ||
                  "Tell us your requirement and our export team will get back to you within 24 hours with pricing and samples."}
              </p>
              <button
                type="button"
                onClick={openInquiry}
                className="inline-flex items-center gap-3 bg-gradient-to-r from-[#c4a882] to-[#a8896c] text-[#1a0f0a] font-bold rounded-full px-9 py-4 text-sm hover:shadow-2xl hover:-translate-y-0.5 transition-all duration-200 cursor-pointer border-none"
              >
                {cta?.buttonLabel || "Send Enquiry"} →
              </button>
            </FadeIn>
          </div>
        </section>
      )}
    </div>
  );
}

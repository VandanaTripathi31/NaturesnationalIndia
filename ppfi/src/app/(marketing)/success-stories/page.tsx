import type { Metadata } from "next";
import Image from "next/image";

import { Reveal } from "@/components/marketing/reveal";
import { SectionHeading } from "@/components/marketing/section-heading";
import { getSuccessStories } from "@/features/content";

export const metadata: Metadata = {
  title: "Success Stories",
  description:
    "Hear from Pixel Perfect Films Institute graduates who turned practical training into real creative careers.",
};

export default function SuccessStoriesPage() {
  const stories = getSuccessStories();

  return (
    <div className="container py-20">
      <SectionHeading
        eyebrow="Success stories"
        title="Careers built on real work"
        description="Our graduates don't just finish a course — they leave with portfolios and momentum."
      />

      <div className="mt-14 grid gap-6 lg:grid-cols-3">
        {stories.map((s, i) => (
          <Reveal key={s.slug} delay={i * 0.05}>
            <figure className="flex h-full flex-col rounded-xl border bg-card p-6">
              <blockquote className="flex-1 text-pretty text-lg font-medium leading-relaxed">
                “{s.quote}”
              </blockquote>
              <figcaption className="mt-6 flex items-center gap-3 border-t border-border/60 pt-5">
                <div className="relative size-11 overflow-hidden rounded-full">
                  <Image src={s.image} alt={s.name} fill sizes="44px" className="object-cover" />
                </div>
                <div>
                  <p className="text-sm font-semibold">{s.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {s.role} · {s.course}
                  </p>
                </div>
              </figcaption>
            </figure>
          </Reveal>
        ))}
      </div>
    </div>
  );
}

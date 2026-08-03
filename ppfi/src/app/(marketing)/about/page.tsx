import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Target, Eye, Rocket } from "lucide-react";

import { Reveal } from "@/components/marketing/reveal";
import { SectionHeading } from "@/components/marketing/section-heading";
import { Button } from "@/components/ui/button";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: "About",
  description:
    "Pixel Perfect Films Institute is the education arm of Pixel Perfect Films — teaching real, industry-ready skills through live projects and working mentors.",
};

const pillars = [
  {
    icon: Eye,
    title: "Vision",
    body: "Learn. Create. Grow. — creating industry-ready professionals through practical, hands-on learning.",
  },
  {
    icon: Target,
    title: "Mission",
    body: "Bridge the gap between theory-based media education and real-world industry practice.",
  },
  {
    icon: Rocket,
    title: "Approach",
    body: "Teach through live projects, using working professionals as mentors, so learners build genuine portfolios.",
  },
];

export default function AboutPage() {
  return (
    <div>
      <section className="container py-20">
        <div className="mx-auto max-w-3xl text-center">
          <p className="mb-3 text-sm font-medium uppercase tracking-widest text-muted-foreground">
            About us
          </p>
          <h1 className="font-display text-4xl font-semibold tracking-tight sm:text-5xl">
            The education arm of {siteConfig.parentCompany}
          </h1>
          <p className="mt-6 text-lg text-muted-foreground">
            Unlike a typical ed-tech company, PPFI is run by active industry
            professionals — not academic-only instructors. We teach the same real-world
            skills we use to produce films, ads and content for real paying clients.
          </p>
        </div>
      </section>

      <section className="border-y border-border/60 bg-muted/30">
        <div className="container grid gap-6 py-16 sm:grid-cols-3">
          {pillars.map((p, i) => (
            <Reveal key={p.title} delay={i * 0.05}>
              <div className="h-full rounded-xl border bg-card p-6">
                <div className="mb-4 inline-flex size-11 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                  <p.icon className="size-5" />
                </div>
                <h2 className="font-display text-lg font-semibold">{p.title}</h2>
                <p className="mt-2 text-sm text-muted-foreground">{p.body}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="container py-20">
        <div className="grid gap-12 lg:grid-cols-2">
          <SectionHeading
            align="left"
            eyebrow="The problem we solve"
            title="Media education is too theoretical"
          />
          <div className="space-y-4 text-muted-foreground">
            <p>
              Learners want to actually produce real content and build a demonstrable
              portfolio — not just collect a certificate. Schools and colleges want to
              offer modern, practical skills but lack the equipment, trained faculty and
              structured curriculum to do so in-house.
            </p>
            <p>
              PPFI solves both: individual learners train on live projects with industry
              mentors, while institutions partner with us to bring that same practical
              training on-campus, certified under their own name.
            </p>
          </div>
        </div>
        <div className="mt-12">
          <Button asChild>
            <Link href="/courses">
              Explore our courses
              <ArrowRight />
            </Link>
          </Button>
        </div>
      </section>
    </div>
  );
}

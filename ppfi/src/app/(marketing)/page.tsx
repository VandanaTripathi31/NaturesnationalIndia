import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Award, Clapperboard, Sparkles, Users } from "lucide-react";

import { CourseCard } from "@/components/marketing/course-card";
import { Reveal } from "@/components/marketing/reveal";
import { SectionHeading } from "@/components/marketing/section-heading";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { siteConfig } from "@/config/site";
import { getFeaturedCourses, getMentors } from "@/features/content";

const stats = [
  { label: "Live client projects", value: "50+" },
  { label: "Industry mentors", value: "12" },
  { label: "Student portfolios built", value: "300+" },
  { label: "Partner institutions", value: "15+" },
];

const differentiators = [
  {
    icon: Clapperboard,
    title: "Industry-led faculty",
    body: "Learn from active filmmakers, editors and marketers — not academic-only instructors.",
  },
  {
    icon: Sparkles,
    title: "Learn by doing",
    body: "Every course ends in real output. You build a portfolio, not just collect a certificate.",
  },
  {
    icon: Users,
    title: "Real client work",
    body: "Train on live briefs from Pixel Perfect Films' actual production network.",
  },
  {
    icon: Award,
    title: "Certified & shareable",
    body: "Earn a verifiable certificate on completion — co-branded for institute partners.",
  },
];

export default function HomePage() {
  const featured = getFeaturedCourses();
  const mentors = getMentors().slice(0, 4);

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div
          className="pointer-events-none absolute inset-0 -z-10 opacity-[0.06]"
          style={{
            backgroundImage:
              "radial-gradient(circle at 15% 20%, currentColor 1px, transparent 1px)",
            backgroundSize: "28px 28px",
          }}
        />
        <div className="container flex flex-col items-center py-24 text-center sm:py-32">
          <Reveal>
            <Badge variant="outline" className="mb-6">
              {siteConfig.parentCompany} · Education
            </Badge>
          </Reveal>
          <Reveal delay={0.05}>
            <h1 className="max-w-4xl text-balance font-display text-4xl font-semibold tracking-tight sm:text-6xl">
              Learn the craft. Build real work. Grow your career.
            </h1>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="mt-6 max-w-2xl text-pretty text-lg text-muted-foreground">
              Practical film, media and marketing education led by working
              professionals — where every course ends in a portfolio-ready project.
            </p>
          </Reveal>
          <Reveal delay={0.15}>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Button asChild size="lg">
                <Link href="/courses">
                  Explore courses
                  <ArrowRight />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link href="/admissions">Partner your institute</Link>
              </Button>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Stats */}
      <section className="border-y border-border/60 bg-muted/30">
        <div className="container grid grid-cols-2 gap-8 py-12 md:grid-cols-4">
          {stats.map((s) => (
            <div key={s.label} className="text-center">
              <p className="font-display text-3xl font-semibold sm:text-4xl">{s.value}</p>
              <p className="mt-1 text-sm text-muted-foreground">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Differentiators */}
      <section className="container py-24">
        <SectionHeading
          eyebrow="Why PPFI"
          title="Education built like the industry works"
          description="We bridge the gap between theory-heavy courses and the real, hands-on skills the creative industry actually hires for."
        />
        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {differentiators.map((d, i) => (
            <Reveal key={d.title} delay={i * 0.05}>
              <div className="flex h-full flex-col rounded-xl border bg-card p-6">
                <div className="mb-4 inline-flex size-11 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                  <d.icon className="size-5" />
                </div>
                <h3 className="font-display text-lg font-semibold">{d.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{d.body}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Featured courses */}
      <section className="border-t border-border/60 bg-muted/30">
        <div className="container py-24">
          <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
            <SectionHeading
              align="left"
              eyebrow="Courses"
              title="Start with our most popular tracks"
            />
            <Button asChild variant="ghost">
              <Link href="/courses">
                All courses
                <ArrowRight />
              </Link>
            </Button>
          </div>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {featured.map((course, i) => (
              <Reveal key={course.slug} delay={i * 0.05}>
                <CourseCard course={course} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Mentors preview */}
      <section className="container py-24">
        <SectionHeading
          eyebrow="Mentors"
          title="Taught by people who do this for a living"
          description="Our mentors are active industry professionals from Pixel Perfect Films' production network."
        />
        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {mentors.map((m, i) => (
            <Reveal key={m.slug} delay={i * 0.05}>
              <Link
                href={`/mentors/${m.slug}`}
                className="group block overflow-hidden rounded-xl border bg-card"
              >
                <div className="relative aspect-square overflow-hidden">
                  <Image
                    src={m.image}
                    alt={m.name}
                    fill
                    sizes="(max-width: 768px) 50vw, 25vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <div className="p-5">
                  <h3 className="font-display font-semibold">{m.name}</h3>
                  <p className="text-sm text-muted-foreground">{m.role}</p>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="container pb-24">
        <div className="relative overflow-hidden rounded-3xl bg-primary px-8 py-16 text-center text-primary-foreground sm:px-16">
          <div
            className="pointer-events-none absolute inset-0 opacity-20"
            style={{
              backgroundImage:
                "radial-gradient(circle at 25% 25%, rgba(255,255,255,0.4), transparent 40%), radial-gradient(circle at 75% 60%, rgba(255,255,255,0.3), transparent 45%)",
            }}
          />
          <div className="relative z-10">
            <h2 className="mx-auto max-w-2xl font-display text-3xl font-semibold tracking-tight sm:text-4xl">
              Ready to build work you&apos;re proud of?
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-primary-foreground/80">
              Join learners building real portfolios with active industry mentors.
            </p>
            <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
              <Button asChild size="lg" variant="secondary">
                <Link href="/signup">Get started free</Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="border-primary-foreground/30 bg-transparent text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground"
              >
                <Link href="/courses">Browse courses</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

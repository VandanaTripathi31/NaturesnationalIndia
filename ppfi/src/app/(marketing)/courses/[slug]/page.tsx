import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { ArrowRight, Check, Clock, Layers, SignalHigh } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getCourseBySlug, getCourses } from "@/features/content";
import { formatINR } from "@/lib/utils";

type Params = Promise<{ slug: string }>;

export function generateStaticParams() {
  return getCourses().map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { slug } = await params;
  const course = getCourseBySlug(slug);
  if (!course) return { title: "Course not found" };
  return {
    title: course.title,
    description: course.excerpt,
    openGraph: { title: course.title, description: course.excerpt, images: [course.image] },
  };
}

export default async function CourseDetailPage({ params }: { params: Params }) {
  const { slug } = await params;
  const course = getCourseBySlug(slug);
  if (!course) notFound();

  const meta = [
    { icon: Clock, label: "Duration", value: `${course.durationWeeks} weeks` },
    { icon: SignalHigh, label: "Level", value: course.level },
    { icon: Layers, label: "Category", value: course.category },
  ];

  return (
    <article className="container py-16">
      <Link
        href="/courses"
        className="text-sm text-muted-foreground hover:text-foreground"
      >
        ← All courses
      </Link>

      <div className="mt-6 grid gap-12 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <Badge variant="secondary">{course.category}</Badge>
          <h1 className="mt-4 font-display text-4xl font-semibold tracking-tight">
            {course.title}
          </h1>
          <p className="mt-4 text-lg text-muted-foreground">{course.description}</p>

          <div className="relative mt-8 aspect-[16/9] overflow-hidden rounded-xl border">
            <Image
              src={course.image}
              alt={course.title}
              fill
              sizes="(max-width: 1024px) 100vw, 66vw"
              className="object-cover"
              priority
            />
          </div>

          <section className="mt-12">
            <h2 className="font-display text-2xl font-semibold">What you&apos;ll learn</h2>
            <ul className="mt-6 grid gap-3 sm:grid-cols-2">
              {course.syllabus.map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <span className="mt-0.5 inline-flex size-5 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground">
                    <Check className="size-3" />
                  </span>
                  <span className="text-sm">{item}</span>
                </li>
              ))}
            </ul>
          </section>

          <section className="mt-12">
            <h2 className="font-display text-2xl font-semibold">Outcomes</h2>
            <ul className="mt-6 space-y-3">
              {course.outcomes.map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <ArrowRight className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
                  <span className="text-sm">{item}</span>
                </li>
              ))}
            </ul>
          </section>
        </div>

        {/* Enrolment card */}
        <aside className="lg:col-span-1">
          <div className="sticky top-24 rounded-xl border bg-card p-6">
            <p className="text-sm text-muted-foreground">
              {course.comingSoon ? "Enrolment opens soon" : "Enrol today"}
            </p>
            <p className="mt-1 font-display text-3xl font-semibold">
              {course.comingSoon ? "Coming soon" : formatINR(course.price)}
            </p>

            <dl className="mt-6 space-y-4">
              {meta.map((m) => (
                <div key={m.label} className="flex items-center gap-3">
                  <m.icon className="size-4 text-muted-foreground" />
                  <dt className="sr-only">{m.label}</dt>
                  <dd className="text-sm">
                    <span className="text-muted-foreground">{m.label}: </span>
                    {m.value}
                  </dd>
                </div>
              ))}
            </dl>

            <Button asChild className="mt-6 w-full" disabled={course.comingSoon}>
              {course.comingSoon ? (
                <span>Notify me</span>
              ) : (
                <Link href={`/signup?course=${course.slug}`}>Enrol now</Link>
              )}
            </Button>
            <p className="mt-3 text-center text-xs text-muted-foreground">
              Secure payment · Certificate on completion
            </p>
          </div>
        </aside>
      </div>
    </article>
  );
}

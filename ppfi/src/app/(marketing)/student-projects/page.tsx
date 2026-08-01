import type { Metadata } from "next";
import Image from "next/image";

import { Reveal } from "@/components/marketing/reveal";
import { SectionHeading } from "@/components/marketing/section-heading";
import { Badge } from "@/components/ui/badge";
import { getStudentProjects } from "@/features/content";

export const metadata: Metadata = {
  title: "Student Projects",
  description:
    "Real work produced by Pixel Perfect Films Institute students — films, campaigns, photography and more.",
};

export default function StudentProjectsPage() {
  const projects = getStudentProjects();

  return (
    <div className="container py-20">
      <SectionHeading
        eyebrow="Portfolio"
        title="Real work by real students"
        description="Every course ends in output. Here's a selection of projects our students have produced."
      />

      <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {projects.map((p, i) => (
          <Reveal key={p.slug} delay={i * 0.05}>
            <figure className="group overflow-hidden rounded-xl border bg-card">
              <div className="relative aspect-[4/3] overflow-hidden">
                <Image
                  src={p.image}
                  alt={p.title}
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              <figcaption className="p-5">
                <Badge variant="muted">{p.course}</Badge>
                <h3 className="mt-3 font-display text-lg font-semibold">{p.title}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{p.description}</p>
                <p className="mt-3 text-xs text-muted-foreground">by {p.studentName}</p>
              </figcaption>
            </figure>
          </Reveal>
        ))}
      </div>
    </div>
  );
}

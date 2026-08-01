import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

import { Reveal } from "@/components/marketing/reveal";
import { SectionHeading } from "@/components/marketing/section-heading";
import { Badge } from "@/components/ui/badge";
import { getMentors } from "@/features/content";

export const metadata: Metadata = {
  title: "Mentors",
  description:
    "Meet the active industry professionals who mentor at Pixel Perfect Films Institute.",
};

export default function MentorsPage() {
  const mentors = getMentors();

  return (
    <div className="container py-20">
      <SectionHeading
        eyebrow="Mentors"
        title="Learn from working professionals"
        description="Our mentors are active filmmakers, editors, marketers and photographers from Pixel Perfect Films' production network."
      />

      <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {mentors.map((m, i) => (
          <Reveal key={m.slug} delay={i * 0.05}>
            <Link
              href={`/mentors/${m.slug}`}
              className="group block overflow-hidden rounded-xl border bg-card transition-all hover:-translate-y-1 hover:shadow-lg"
            >
              <div className="relative aspect-[4/3] overflow-hidden">
                <Image
                  src={m.image}
                  alt={m.name}
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              <div className="p-5">
                <h3 className="font-display text-lg font-semibold">{m.name}</h3>
                <p className="text-sm text-muted-foreground">{m.role}</p>
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {m.expertise.slice(0, 3).map((e) => (
                    <Badge key={e} variant="muted">
                      {e}
                    </Badge>
                  ))}
                </div>
              </div>
            </Link>
          </Reveal>
        ))}
      </div>
    </div>
  );
}

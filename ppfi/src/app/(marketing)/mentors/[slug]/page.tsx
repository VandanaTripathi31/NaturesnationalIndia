import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { Instagram, Linkedin } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { getMentorBySlug, getMentors } from "@/features/content";

type Params = Promise<{ slug: string }>;

export async function generateStaticParams() {
  return (await getMentors()).map((m) => ({ slug: m.slug }));
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { slug } = await params;
  const mentor = await getMentorBySlug(slug);
  if (!mentor) return { title: "Mentor not found" };
  return { title: mentor.name, description: `${mentor.name} — ${mentor.role}` };
}

export default async function MentorDetailPage({ params }: { params: Params }) {
  const { slug } = await params;
  const mentor = await getMentorBySlug(slug);
  if (!mentor) notFound();

  return (
    <div className="container py-16">
      <Link href="/mentors" className="text-sm text-muted-foreground hover:text-foreground">
        ← All mentors
      </Link>

      <div className="mt-6 grid gap-10 lg:grid-cols-3">
        <div className="relative aspect-square overflow-hidden rounded-2xl border">
          <Image
            src={mentor.image}
            alt={mentor.name}
            fill
            sizes="(max-width: 1024px) 100vw, 33vw"
            className="object-cover"
            priority
          />
        </div>

        <div className="lg:col-span-2">
          <h1 className="font-display text-4xl font-semibold tracking-tight">
            {mentor.name}
          </h1>
          <p className="mt-2 text-lg text-muted-foreground">{mentor.role}</p>

          <div className="mt-4 flex flex-wrap gap-1.5">
            {mentor.expertise.map((e) => (
              <Badge key={e} variant="muted">
                {e}
              </Badge>
            ))}
          </div>

          <p className="mt-8 text-pretty text-muted-foreground">{mentor.bio}</p>

          {mentor.socials ? (
            <div className="mt-8 flex gap-3">
              {mentor.socials.linkedin ? (
                <a
                  href={mentor.socials.linkedin}
                  aria-label="LinkedIn"
                  className="inline-flex size-9 items-center justify-center rounded-md border hover:bg-accent"
                >
                  <Linkedin className="size-4" />
                </a>
              ) : null}
              {mentor.socials.instagram ? (
                <a
                  href={mentor.socials.instagram}
                  aria-label="Instagram"
                  className="inline-flex size-9 items-center justify-center rounded-md border hover:bg-accent"
                >
                  <Instagram className="size-4" />
                </a>
              ) : null}
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}

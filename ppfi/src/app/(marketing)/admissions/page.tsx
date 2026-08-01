import type { Metadata } from "next";
import { Building2, CalendarCheck, FileText, Handshake } from "lucide-react";

import { SectionHeading } from "@/components/marketing/section-heading";
import { InquiryForm } from "@/features/leads/components/inquiry-form";

export const metadata: Metadata = {
  title: "Partner Your Institute",
  description:
    "Bring practical, industry-led media and marketing training to your school or college through a Pixel Perfect Films Institute partnership.",
};

const steps = [
  {
    icon: FileText,
    title: "Share your requirement",
    body: "Tell us your student strength, interest areas and available time slots.",
  },
  {
    icon: Handshake,
    title: "Get a custom program",
    body: "We propose a tailored program and schedule within a few days.",
  },
  {
    icon: CalendarCheck,
    title: "Free demo session",
    body: "A free, no-obligation demo session for your students and faculty.",
  },
  {
    icon: Building2,
    title: "Partnership begins",
    body: "On-campus, project-based batches with co-branded certificates.",
  },
];

export default function AdmissionsPage() {
  return (
    <div className="container py-20">
      <SectionHeading
        eyebrow="For Schools & Colleges"
        title="Bring the industry to your campus"
        description="Offer modern, practical media and marketing skills — taught on-campus with our equipment and industry mentors, certified under your institute's name."
      />

      <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {steps.map((s, i) => (
          <div key={s.title} className="rounded-xl border bg-card p-6">
            <div className="mb-4 inline-flex size-11 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <s.icon className="size-5" />
            </div>
            <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
              Step {i + 1}
            </p>
            <h3 className="mt-1 font-display text-lg font-semibold">{s.title}</h3>
            <p className="mt-2 text-sm text-muted-foreground">{s.body}</p>
          </div>
        ))}
      </div>

      <div className="mx-auto mt-20 max-w-3xl">
        <div className="rounded-2xl border bg-card p-8 sm:p-10">
          <h2 className="font-display text-2xl font-semibold">Request a partnership</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Fill in your details and our team will get back to you with a proposal.
          </p>
          <div className="mt-8">
            <InquiryForm />
          </div>
        </div>
      </div>
    </div>
  );
}

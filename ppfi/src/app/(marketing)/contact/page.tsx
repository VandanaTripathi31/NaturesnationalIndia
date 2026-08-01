import type { Metadata } from "next";
import { Mail, MapPin, Phone } from "lucide-react";

import { SectionHeading } from "@/components/marketing/section-heading";
import { ContactForm } from "@/features/leads/components/contact-form";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: "Contact",
  description: "Get in touch with Pixel Perfect Films Institute.",
};

export default function ContactPage() {
  return (
    <div className="container py-20">
      <SectionHeading
        align="left"
        eyebrow="Contact"
        title="Let's talk"
        description="Questions about a course, a partnership, or anything else? Send us a message."
      />

      <div className="mt-14 grid gap-12 lg:grid-cols-3">
        <div className="space-y-6">
          <div className="flex items-start gap-3">
            <Mail className="mt-0.5 size-5 text-muted-foreground" />
            <div>
              <p className="text-sm font-medium">Email</p>
              <p className="text-sm text-muted-foreground">{siteConfig.contactEmail}</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <Phone className="mt-0.5 size-5 text-muted-foreground" />
            <div>
              <p className="text-sm font-medium">Phone</p>
              <p className="text-sm text-muted-foreground">+91 00000 00000</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <MapPin className="mt-0.5 size-5 text-muted-foreground" />
            <div>
              <p className="text-sm font-medium">Studio</p>
              <p className="text-sm text-muted-foreground">
                Pixel Perfect Films, India
              </p>
            </div>
          </div>
        </div>

        <div className="lg:col-span-2">
          <ContactForm />
        </div>
      </div>
    </div>
  );
}

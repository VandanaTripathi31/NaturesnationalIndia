import Link from "next/link";
import { Instagram, Linkedin, Youtube } from "lucide-react";

import { mainNav, siteConfig } from "@/config/site";

export function Footer() {
  return (
    <footer className="border-t border-border/60">
      <div className="container grid gap-10 py-14 md:grid-cols-4">
        <div className="md:col-span-2">
          <Link href="/" className="font-display text-lg font-semibold">
            {siteConfig.name}
          </Link>
          <p className="mt-3 max-w-sm text-sm text-muted-foreground">
            {siteConfig.description}
          </p>
          <div className="mt-5 flex gap-3">
            <a
              href={siteConfig.socials.instagram}
              aria-label="Instagram"
              className="text-muted-foreground hover:text-foreground"
            >
              <Instagram className="size-5" />
            </a>
            <a
              href={siteConfig.socials.youtube}
              aria-label="YouTube"
              className="text-muted-foreground hover:text-foreground"
            >
              <Youtube className="size-5" />
            </a>
            <a
              href={siteConfig.socials.linkedin}
              aria-label="LinkedIn"
              className="text-muted-foreground hover:text-foreground"
            >
              <Linkedin className="size-5" />
            </a>
          </div>
        </div>

        <div>
          <h3 className="text-sm font-semibold">Explore</h3>
          <ul className="mt-4 space-y-2.5">
            {mainNav.slice(0, 5).map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="text-sm text-muted-foreground hover:text-foreground"
                >
                  {item.title}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="text-sm font-semibold">Get involved</h3>
          <ul className="mt-4 space-y-2.5">
            <li>
              <Link
                href="/admissions"
                className="text-sm text-muted-foreground hover:text-foreground"
              >
                Partner with us
              </Link>
            </li>
            <li>
              <Link
                href="/contact"
                className="text-sm text-muted-foreground hover:text-foreground"
              >
                Contact
              </Link>
            </li>
            <li>
              <Link
                href="/signup"
                className="text-sm text-muted-foreground hover:text-foreground"
              >
                Create account
              </Link>
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-border/60">
        <div className="container flex flex-col items-center justify-between gap-2 py-6 text-xs text-muted-foreground sm:flex-row">
          <p>
            © {new Date().getFullYear()} {siteConfig.parentCompany}. All rights reserved.
          </p>
          <p>{siteConfig.tagline}</p>
        </div>
      </div>
    </footer>
  );
}

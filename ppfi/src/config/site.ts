import { publicEnv } from "./env";

/** Global, static site configuration used across metadata, nav and SEO. */
export const siteConfig = {
  name: publicEnv.NEXT_PUBLIC_APP_NAME,
  shortName: "PPFI",
  description:
    "Pixel Perfect Films Institute — learn videography, editing, digital marketing and content creation from active industry professionals. Learn. Create. Grow.",
  tagline: "Learn. Create. Grow.",
  url: publicEnv.NEXT_PUBLIC_APP_URL,
  ogImage: "/og.png",
  parentCompany: "Pixel Perfect Films",
  contactEmail: "hello@pixelperfectfilms.in",
  socials: {
    instagram: "https://instagram.com/pixelperfectfilms",
    youtube: "https://youtube.com/@pixelperfectfilms",
    linkedin: "https://linkedin.com/company/pixelperfectfilms",
  },
} as const;

/** Primary public navigation (Phase 3 fills these routes in). */
export const mainNav = [
  { title: "Home", href: "/" },
  { title: "About", href: "/about" },
  { title: "Courses", href: "/courses" },
  { title: "Mentors", href: "/mentors" },
  { title: "Student Projects", href: "/student-projects" },
  { title: "Success Stories", href: "/success-stories" },
  { title: "Blog", href: "/blog" },
  { title: "Contact", href: "/contact" },
] as const;

export type NavItem = (typeof mainNav)[number];

import { getCategories } from "../src/services/categoryService";
import "./globals.css";
import SiteShell from "../src/components/SiteShell";

// FIX (SEO): `title.template` used to append " | Natures National" to
// EVERY page's title — Next.js's metadata resolution applies a parent
// layout's title.template to any descendant page that returns a plain
// string `title` (which is every page/category/product/blog route in this
// app; see app/[slug]/page.jsx, app/product/[slug]/page.jsx,
// app/category/[slug]/page.jsx, app/blog/[slug]/page.jsx). Since those
// pages already return the exact original migrated meta title (or the
// live site's), the template was silently corrupting every single one of
// them relative to the live site by appending this suffix — not just a
// handful of pages. Only `default` remains, used solely for routes that
// don't set their own metadata at all.
export const metadata = {
  title: {
    default: "Natures National",
  },
  description:
    "Premium essential oils, carrier oils, herbal extracts, and natural products for global export.",
  icons: {
    icon: [
      { url: "/images/logo.jpeg" },
      { url: "/images/logo.jpeg", sizes: "16x16", type: "image/png" },
      { url: "/images/logo.jpeg", sizes: "32x32", type: "image/png" },
    ],
    apple: "/apple-touch-icon.png",
  },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export default async function RootLayout({ children }) {
  let categories = [];

  try {
    categories = await getCategories();
  } catch {
    categories = [];
  }

  return (
    <html lang="en">
      <body>
        <SiteShell categories={categories}>{children}</SiteShell>
      </body>
    </html>
  );
}

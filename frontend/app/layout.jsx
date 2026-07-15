import { getCategories } from "../src/services/categoryService";
import "./globals.css";
import SiteShell from "../src/components/SiteShell";

export const metadata = {
  title: {
    default: "Natures National",
    template: "%s | Natures National",
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

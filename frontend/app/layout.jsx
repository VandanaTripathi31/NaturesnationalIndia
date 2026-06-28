import "./globals.css";
import { getCategories } from "@/services/categoryService";
import SiteShell from "@/components/SiteShell";

export const metadata = {
  title: {
    default: "Natures National",
    template: "%s | Natures National",
  },
  description:
    "Premium essential oils, carrier oils, herbal extracts, and natural products for global export.",
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

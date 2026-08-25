import HomePage from "../src/components/HomePage";
import { getCategories } from "../src/services/categoryService";

// Homepage-only metadata. Overrides the `title.default` / `description`
// set for the rest of the site in app/layout.jsx.
export const metadata = {
  title:
    "100% Natural Essential Oils & Cold Pressed Oils - Natures Natural India",
  description:
    "Natures Natural India is a manufacturer and wholesaler of the largest number of essential oils, carrier oils, hydrosols, absolute oils, Indian traditional attar, synergy blends.",
};

export default async function Page() {
  let categories = [];

  try {
    categories = await getCategories();
  } catch {
    categories = [];
  }

  return <HomePage categories={categories} />;
}

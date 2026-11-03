import { getCategories, getCategoryBySlug } from "../src/services/categoryService";
import { categoryHref, productHref } from "../src/lib/seo-routes";

const SITE_URL = "https://www.naturesnaturalindia.com";
const PAGE_LIMIT = 50;

const STATIC_PATHS = [
  "/",
  "/about-us",
  "/our-offices",
  "/our-certification",
  "/contact-us",
  "/policies",
  "/blog",
  "/steam-distillation",
  "/cold-pressing",
  "/solvent-extraction",
  "/bulk-orders",
  "/private-labelling",
  "/private-packaging",
  "/barrel-packaging",
  "/custom-blends",
  "/wholesale",
  "/secure-shopping",
  "/delivery-info",
  "/quality-assurance",
];

// Categories and products come from the API, so anything created in the
// dashboard shows up here without a redeploy. An API outage must not break
// the sitemap, so catalog failures fall back to the static pages only.
async function getCatalogEntries() {
  const entries = [];

  try {
    const categories = await getCategories();

    for (const category of categories) {
      entries.push({ url: `${SITE_URL}${categoryHref(category.slug)}` });

      for (let page = 1; ; page += 1) {
        const data = await getCategoryBySlug(category.slug, {
          page,
          limit: PAGE_LIMIT,
        });

        for (const product of data.products ?? []) {
          entries.push({
            url: `${SITE_URL}${productHref(category.slug, product.slug)}`,
          });
        }

        if (page >= (data.pagination?.totalPages ?? 1)) break;
      }
    }
  } catch {
    // fall through with whatever was collected
  }

  return entries;
}

export const revalidate = 3600;

export default async function sitemap() {
  const staticEntries = STATIC_PATHS.map((path) => ({
    url: `${SITE_URL}${path === "/" ? "" : path}`,
  }));

  return [...staticEntries, ...(await getCatalogEntries())];
}

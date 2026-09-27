// Source of truth for the public URL slugs, taken verbatim from the live
// site's sitemap.xml (https://www.naturesnaturalindia.com/sitemap.xml).
//
// On the live site BOTH categories and products are served as flat
// "/{slug}.html" URLs. Only "liquid-herbals-extracts" has nested
// sub-category pages. The slug-alignment migration (align-slugs.js) uses the
// lists below to bring the MongoDB slugs in line with these URLs.

// Category (top-level listing) slugs — flat "/{slug}.html".
export const CATEGORY_SLUGS = [
  "spice-oils",
  "hydrosols",
  "exotic-oil-dilutions",
  "oleoresins",
  "natural-cosmetic-butters",
  "fragrances-oil",
  "ayurvedic-herbal-oil",
  "organic-essential-oil",
  "organic-carrier-oil",
  "synergy-blends",
  "peppermint-products",
  "aromatic-chemicals",
  "liquid-herbals-extracts",
  "diffuser-oil",
  "co2-oil",
  "seven-chakra-blends",
  "pure-and-natural-essential-oils",
  "carrier-oils",
  "certified-organic-oils",
  "floral-absolute-oils",
  "traditional-indian-attars",
];

// Nested sub-categories under liquid-herbals-extracts.
export const SUBCATEGORY_SLUGS = [
  "liquid-herbals-extracts/water-soluble",
  "liquid-herbals-extracts/oil-soluble",
];

// Maps the "natural" slug generated from a category's display name
// (generateSlug(name)) to the exact canonical slug used on the live site.
// This is the crux of the reported bug — e.g. the category named
// "Essential Oils" must live at "/pure-and-natural-essential-oils.html".
//
// Keyed by generateSlug(name) so it is robust to spacing/case. Edit an entry
// here if a category's display name differs from what is assumed.
export const CATEGORY_NAME_TO_SLUG = {
  // ── Exact current → live mappings supplied by the client ──────────
  "essential-oils": "pure-and-natural-essential-oils",
  "hydrosols-floral-water": "hydrosols",
  "absolute-oils": "floral-absolute-oils",
  "3-exotic-oil-dilution": "exotic-oil-dilutions",
  "indian-attars": "traditional-indian-attars",
  "cosmetic-butters": "natural-cosmetic-butters",
  "oleoresins-oils": "oleoresins",
  // ── Canonical + common-variant fallbacks ─────────────────────────
  "pure-and-natural-essential-oils": "pure-and-natural-essential-oils",
  "carrier-oils": "carrier-oils",
  "organic-oils": "certified-organic-oils",
  "certified-organic-oils": "certified-organic-oils",
  "floral-absolute-oils": "floral-absolute-oils",
  "attars": "traditional-indian-attars",
  "traditional-indian-attars": "traditional-indian-attars",
  "spice-oils": "spice-oils",
  "hydrosols": "hydrosols",
  "floral-water": "hydrosols",
  "floral-waters": "hydrosols",
  "exotic-oil-dilutions": "exotic-oil-dilutions",
  "exotic-oil-dilution": "exotic-oil-dilutions",
  "dilutions": "exotic-oil-dilutions",
  "oleoresins": "oleoresins",
  "natural-cosmetic-butters": "natural-cosmetic-butters",
  "cosmetic-butters": "natural-cosmetic-butters",
  "butters": "natural-cosmetic-butters",
  "fragrances-oil": "fragrances-oil",
  "fragrance-oils": "fragrances-oil",
  "fragrances-oils": "fragrances-oil",
  "fragrances": "fragrances-oil",
  // liquid-herbals-extracts sub-categories (live URLs are nested under
  // /liquid-herbals-extracts/; the flat category route serves them at the
  // leaf slug).
  "water-soluble": "water-soluble",
  "oil-soluble": "oil-soluble",
  "ayurvedic-herbal-oil": "ayurvedic-herbal-oil",
  "ayurvedic-herbal-oils": "ayurvedic-herbal-oil",
  "organic-essential-oil": "organic-essential-oil",
  "organic-essential-oils": "organic-essential-oil",
  "organic-carrier-oil": "organic-carrier-oil",
  "organic-carrier-oils": "organic-carrier-oil",
  "synergy-blends": "synergy-blends",
  "peppermint-products": "peppermint-products",
  "aromatic-chemicals": "aromatic-chemicals",
  "liquid-herbals-extracts": "liquid-herbals-extracts",
  "liquid-herbal-extracts": "liquid-herbals-extracts",
  "diffuser-oil": "diffuser-oil",
  "diffuser-oils": "diffuser-oil",
  "co2-oil": "co2-oil",
  "co2-oils": "co2-oil",
  "seven-chakra-blends": "seven-chakra-blends",
  "chakra-blends": "seven-chakra-blends",
};

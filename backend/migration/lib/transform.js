// ── Field mapping + value transforms: Magento attribute_code → Mongo field ─
//
// Each Mongo field lists the candidate Magento attribute codes it may come
// from; the first one present on the record wins. Standard Magento codes
// (name, url_key, description, meta_*) are fixed; the custom ones (botanical
// name, origin, extraction method, benefits, uses) are best-guess — run
// `node discover.js` to print the real attribute codes in your store and
// adjust the candidate lists below if any field comes through empty.

export const PRODUCT_CODE_MAP = {
  name: ["name"],
  slug: ["url_key"],
  description: ["description", "short_description"],
  // Codes confirmed from the live store's eav_attribute table.
  botanicalName: ["botanicalname", "scientificname"],
  origin: ["origin"],
  extractionMethod: ["extractionmethod"],
  benefits: ["therapeuticbenefits"],
  uses: ["uses"],
  productCode: ["productcode"],
  blendsWith: ["bledswith"],
  history: ["history"],
  storage: ["storage"],
  precautions: ["precautionarywords"],
  faqs: ["faqs"],
  metaTitle: ["meta_title"],
  metaDescription: ["meta_description"],
  metaKeywords: ["meta_keyword", "meta_keywords"],
  status: ["status"],
  image: ["image", "small_image", "thumbnail"],
};

export const CATEGORY_CODE_MAP = {
  name: ["name"],
  slug: ["url_key"],
  description: ["description"],
  metaTitle: ["meta_title"],
  metaDescription: ["meta_description"],
  metaKeywords: ["meta_keywords", "meta_keyword"],
  status: ["is_active"],
  image: ["image"],
};

// Extra Magento product attributes → "Additional Information" spec rows.
// Order here is the order they render in the product page's spec table.
export const SPEC_FIELDS = [
  ["productcode", "Product Code"],
  ["othernames", "Other Names"],
  ["casno", "CAS No"],
  ["colour", "Colour"],
  ["odor", "Odor"],
  ["colorodor", "Colour and Odor"],
  ["appearance", "Appearance"],
  ["components", "Components"],
  ["solubility", "Solubility"],
  ["specificgravity", "Specific Gravity"],
  ["opticalrotation", "Optical Rotation"],
  ["refractiveindex", "Refractive Index"],
  ["flashpoint", "Flash Point"],
  ["molecularformula", "Molecular Formula"],
  ["molecularweight", "Molecular Weight"],
  ["purity", "Purity"],
  ["properties", "Properties"],
  ["source", "Source"],
  ["cultivation", "Cultivation"],
  ["shelflife", "Shelf Life"],
  ["note", "Note"],
];

// Build the label/value spec rows, skipping empty attributes and stripping
// any HTML so the values render cleanly.
export function buildSpecifications(record) {
  const rows = [];
  for (const [code, label] of SPEC_FIELDS) {
    const raw = record[code];
    if (raw === undefined || raw === null || String(raw).trim() === "") continue;
    const value = stripHtml(String(raw)).slice(0, 500);
    if (value) rows.push({ label, value });
  }
  return rows;
}

const first = (record, codes) => {
  for (const c of codes) {
    const v = record[c];
    if (v !== undefined && v !== null && String(v).trim() !== "") return v;
  }
  return undefined;
};

export const pick = (record, map, field) => first(record, map[field]);

export const stripHtml = (html = "") =>
  String(html).replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();

export const truncate = (s, max) =>
  s ? String(s).trim().slice(0, max) : undefined;

export function slugify(input = "") {
  return String(input)
    .toLowerCase()
    .replace(/\.html?$/i, "")
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

// Magento status: 1 = enabled → active, 2 = disabled. Category is_active is
// already 1/0. Anything truthy-but-not-2 is treated as active.
export const toIsActive = (status) =>
  status === undefined || status === null
    ? true
    : Number(status) === 1 || String(status) === "1";

// Split a benefits/uses blob (HTML list, newlines, semicolons) into an array.
export function toList(value) {
  if (!value) return [];
  const text = String(value)
    .replace(/<\/(li|p|br)>/gi, "\n")
    .replace(/<[^>]*>/g, "");
  return text
    .split(/[\n;•]+/)
    .map((s) => s.trim())
    .filter(Boolean);
}

// Build a public image URL from a Magento media path like "/a/r/argan.jpg".
export function magentoImageUrl(pathValue) {
  if (!pathValue) return null;
  const base = (process.env.MAGENTO_MEDIA_BASE || "").replace(/\/+$/, "");
  const rel = String(pathValue).startsWith("/") ? pathValue : `/${pathValue}`;
  return `${base}${rel}`;
}

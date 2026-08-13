/**
 * Builds the product page's "Overview" tab content to match the structure
 * of the original (Magento) product pages — see the client-supplied
 * reference HTML/screenshot: a label/value block (Botanical Name, Country
 * of origin, Odor, Colour, Extraction Method, Components, Solubility),
 * then Blends well with, History, Uses, Therapeutic Benefits, and FAQs.
 *
 * Every field here already exists on the Product model (see
 * backend/src/models/Product.js) and was populated for exactly this
 * purpose by the Magento migration (backend/migration/migrate-products.js,
 * lib/transform.js SPEC_FIELDS) — nothing here is invented; this only maps
 * existing fields into the reference order/shape. Works for every product:
 * a row/section is only added when the underlying field is actually set.
 */

function specValue(product, label) {
  const row = (product?.specifications || []).find(
    (r) => r.label?.trim().toLowerCase() === label.toLowerCase(),
  );
  return row?.value?.trim() || "";
}

// Migrated `faqs` text is HTML-stripped (see migration/lib/transform.js
// stripHtml), which collapses "<p><b>Question: ...</b> <b>Answer:</b> ...
// </p>" runs into one flattened string. This splits it back into Q/A pairs
// using the "Question:" / "Answer:" markers the source data consistently
// uses — presentational parsing of existing data, not invented content.
export function parseFaqs(raw) {
  if (!raw) return [];
  const text = String(raw).trim();
  if (!text) return [];

  const parts = text.split(/(?=Question\s*\d*\s*:)/gi).filter((p) => p.trim());
  const items = [];
  for (const part of parts) {
    const match = part.match(/Question\s*\d*\s*:\s*(.*?)\s*Answer\s*:\s*(.*)$/is);
    if (match && match[1].trim() && match[2].trim()) {
      items.push({ q: match[1].trim(), a: match[2].trim() });
    }
  }

  // Data stored in a shape the "Question:"/"Answer:" pattern doesn't match
  // — still show it (as a single block) rather than silently dropping it.
  if (items.length === 0) return [{ q: null, a: text }];
  return items;
}

export function buildOverviewSections(product) {
  if (!product) return [];
  const sections = [];

  const primaryRows = [
    { label: "Botanical Name", value: product.botanicalName?.trim() },
    { label: "Country of Origin", value: product.origin?.trim() },
    { label: "Odor", value: specValue(product, "Odor") },
    { label: "Colour", value: specValue(product, "Colour") },
    { label: "Extraction Method", value: product.extractionMethod?.trim() },
    { label: "Components", value: specValue(product, "Components") },
    { label: "Solubility", value: specValue(product, "Solubility") },
  ].filter((r) => r.value);

  // Any other migrated spec rows not already surfaced above (Product Code,
  // CAS No, Appearance, Specific Gravity, Shelf Life, etc.) — preserved,
  // never dropped, just appended after the reference's primary fields.
  const consumed = new Set(["odor", "colour", "components", "solubility"]);
  const extraSpecRows = (product.specifications || []).filter(
    (r) => r.value?.trim() && !consumed.has(r.label?.trim().toLowerCase()),
  );

  if (primaryRows.length || extraSpecRows.length) {
    sections.push({ type: "rows", rows: [...primaryRows, ...extraSpecRows] });
  }

  if (product.blendsWith?.trim()) {
    sections.push({
      type: "rows",
      rows: [{ label: "Blends Well With", value: product.blendsWith.trim() }],
    });
  }

  if (product.history?.trim()) {
    sections.push({ type: "heading", text: "History" });
    sections.push({ type: "paragraph", text: product.history.trim() });
  }

  if (product.uses?.length) {
    sections.push({ type: "heading", text: "Uses" });
    sections.push({ type: "list", items: product.uses });
  }

  if (product.benefits?.length) {
    sections.push({ type: "heading", text: "Therapeutic Benefits" });
    sections.push({ type: "list", items: product.benefits });
  }

  if (product.precautions?.trim()) {
    sections.push({ type: "heading", text: "Precautions" });
    sections.push({ type: "paragraph", text: product.precautions.trim() });
  }

  if (product.storage?.trim()) {
    sections.push({ type: "heading", text: "Storage" });
    sections.push({ type: "paragraph", text: product.storage.trim() });
  }

  const faqs = parseFaqs(product.faqs);
  if (faqs.length) {
    sections.push({ type: "heading", text: "FAQs" });
    sections.push({ type: "faqs", items: faqs });
  }

  return sections;
}

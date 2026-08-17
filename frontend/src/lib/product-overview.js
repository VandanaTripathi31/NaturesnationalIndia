/**
 * Builds the product page's "Overview" tab content to match the original
 * live website's product pages (client-supplied reference HTML/live-site
 * comparisons). Structure, in order:
 *
 *   1. Specification fields (Product Code, Botanical/Scientific Name,
 *      Country of origin, Source, Cultivation, Colour and odor, Note,
 *      Extraction Method, CAS No, Refractive Index, Specific Gravity,
 *      Optical Rotation, Flash Point, Components, Solubility, Shelf Life,
 *      Storage, Certificate on Demand) — only the fields a given product
 *      actually has.
 *   2. Blends Well With
 *   3. History
 *   4. Uses
 *   5. Therapeutic Benefits
 *   6. Precautionary Words
 *   7. FAQs
 *
 * Every field here already exists on the Product model (see
 * backend/src/models/Product.js) and was populated for exactly this
 * purpose by the Magento migration (backend/migration/migrate-products.js,
 * lib/transform.js SPEC_FIELDS/PRODUCT_CODE_MAP) — nothing here is
 * invented; this only maps existing fields into the reference order/shape.
 * A row/section only renders when the underlying field is actually set,
 * so this works for every product regardless of which fields it has, with
 * no product-specific hardcoding.
 *
 * The one exception is "Certificate on Demand": the client supplied this
 * verbatim in their requirements as fixed, product-independent boilerplate
 * (same COA/GC/MS explanation for every product, not a per-product DB
 * field) — see CERTIFICATE_ON_DEMAND_TEXT below.
 */

const CERTIFICATE_ON_DEMAND_TEXT =
  "At our customer's request, we provide the subsequent indenture (COA) " +
  "Certificate of Analysis which gives the information on color, odor & " +
  "additional details, (GC) Gas Chromatography provides statistics of the " +
  "product element & its percentage, and (MS) Mass Spectrometry gives " +
  "details of the component present in the product & its quantity.";

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

  // Odor/Colour: some products carry them as two separate migrated spec
  // rows ("Odor", "Colour"); others only have the combined Magento
  // "colorodor" attribute ("Colour and Odor"), and some only have a
  // free-text "Colour" description (e.g. dilution products). Prefer
  // whichever the product actually has — never invent the ones it doesn't.
  const odor = specValue(product, "Odor");
  const colour = specValue(product, "Colour");
  const colourAndOdorCombined = specValue(product, "Colour and Odor");

  // ── 1. Specification fields — one unified block, in the order the
  // original site presents them. Every row is conditional; nothing here
  // is invented for a product that doesn't have it.
  const specRows = [
    { label: "Product Code", value: product.productCode?.trim() },
    { label: "Botanical Name", value: product.botanicalName?.trim() },
    { label: "Country of Origin", value: product.origin?.trim() },
    { label: "Source", value: specValue(product, "Source") },
    { label: "Cultivation", value: specValue(product, "Cultivation") },
    ...(odor || colour
      ? [
          { label: "Odor", value: odor },
          { label: "Colour", value: colour },
        ]
      : colourAndOdorCombined
        ? [{ label: "Colour and Odor", value: colourAndOdorCombined }]
        : []),
    { label: "Note", value: specValue(product, "Note") },
    { label: "Extraction Method", value: product.extractionMethod?.trim() },
    { label: "CAS No", value: specValue(product, "CAS No") },
    { label: "Refractive Index", value: specValue(product, "Refractive Index") },
    { label: "Specific Gravity", value: specValue(product, "Specific Gravity") },
    { label: "Optical Rotation", value: specValue(product, "Optical Rotation") },
    { label: "Flash Point", value: specValue(product, "Flash Point") },
    { label: "Components", value: specValue(product, "Components") },
    { label: "Solubility", value: specValue(product, "Solubility") },
    { label: "Shelf Life", value: specValue(product, "Shelf Life") },
  ].filter((r) => r.value);

  // Any other migrated spec rows not already surfaced above (Other Names,
  // Appearance, Molecular Formula, Molecular Weight, Purity, Properties,
  // etc.) — preserved, never dropped, just appended after the named
  // fields so no migrated data silently disappears.
  const consumed = new Set(
    [
      "odor",
      "colour",
      "colour and odor",
      "source",
      "cultivation",
      "note",
      "cas no",
      "refractive index",
      "specific gravity",
      "optical rotation",
      "flash point",
      "components",
      "solubility",
      "shelf life",
    ].map((s) => s.toLowerCase()),
  );
  const extraSpecRows = (product.specifications || []).filter(
    (r) => r.value?.trim() && !consumed.has(r.label?.trim().toLowerCase()),
  );

  if (specRows.length || extraSpecRows.length) {
    sections.push({ type: "rows", rows: [...specRows, ...extraSpecRows] });
  }

  if (product.storage?.trim()) {
    sections.push({ type: "heading", text: "Storage" });
    sections.push({ type: "paragraph", text: product.storage.trim() });
  }

  // Fixed boilerplate — see the module comment. Always shown; it isn't
  // per-product data so it doesn't depend on any product field being set.
  sections.push({ type: "heading", text: "Certificate on Demand" });
  sections.push({ type: "paragraph", text: CERTIFICATE_ON_DEMAND_TEXT });

  // ── 2–7. Long-form sections, in the requested order ────────────────
  if (product.blendsWith?.trim()) {
    sections.push({ type: "heading", text: "Blends Well With" });
    sections.push({ type: "paragraph", text: product.blendsWith.trim() });
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
    sections.push({ type: "heading", text: "Precautionary Words" });
    sections.push({ type: "paragraph", text: product.precautions.trim() });
  }

  const faqs = parseFaqs(product.faqs);
  if (faqs.length) {
    sections.push({ type: "heading", text: "FAQs" });
    sections.push({ type: "faqs", items: faqs });
  }

  return sections;
}

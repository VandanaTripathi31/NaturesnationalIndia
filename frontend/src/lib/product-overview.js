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

export function parseFaqs(raw) {
  if (!raw) return [];
  const text = String(raw).trim();
  if (!text) return [];

  const parts = text.split(/(?=Question\s*\d*\s*:)/gi).filter((p) => p.trim());
  const items = [];
  for (const part of parts) {
    const match = part.match(
      /Question\s*\d*\s*:\s*(.*?)\s*Answer\s*:\s*(.*)$/is,
    );
    if (match && match[1].trim() && match[2].trim()) {
      items.push({ q: match[1].trim(), a: match[2].trim() });
    }
  }

  if (items.length === 0) return [{ q: null, a: text }];
  return items;
}

export function buildOverviewSections(product) {
  if (!product) return [];
  const sections = [];
  const odor = specValue(product, "Odor");
  const colour = specValue(product, "Colour");
  const colourAndOdorCombined = specValue(product, "Colour and Odor");
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
    {
      label: "Refractive Index",
      value: specValue(product, "Refractive Index"),
    },
    {
      label: "Specific Gravity",
      value: specValue(product, "Specific Gravity"),
    },
    {
      label: "Optical Rotation",
      value: specValue(product, "Optical Rotation"),
    },
    { label: "Flash Point", value: specValue(product, "Flash Point") },
    { label: "Components", value: specValue(product, "Components") },
    { label: "Solubility", value: specValue(product, "Solubility") },
    { label: "Shelf Life", value: specValue(product, "Shelf Life") },
  ].filter((r) => r.value);

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

  sections.push({ type: "heading", text: "Certificate on Demand" });
  sections.push({ type: "paragraph", text: CERTIFICATE_ON_DEMAND_TEXT });

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

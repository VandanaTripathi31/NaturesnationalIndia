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

const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "@id": "https://www.naturesnaturalindia.com/#organization",
  name: "Natures Natural India Oils Pvt. Ltd.",
  alternateName: "Natures Natural India",
  url: "https://www.naturesnaturalindia.com/",
  logo: {
    "@type": "ImageObject",
    url: "https://www.naturesnaturalindia.com/images/logo1.png",
  },
  description:
    "Natures Natural India Oils Pvt. Ltd. is an Indian manufacturer and exporter of pure, natural and certified organic essential oils, carrier oils, fragrance oils and allied herbal products, serving B2B customers worldwide.",
  foundingDate: "2010",
  telephone: "+91-9711003901",
  email: "info@naturesnaturalindia.com",
  address: {
    "@type": "PostalAddress",
    streetAddress:
      "Plot No. B 45/7, Sahibabad Industrial Area, Site 4, Sahibabad",
    addressLocality: "Ghaziabad",
    addressRegion: "Uttar Pradesh",
    postalCode: "201010",
    addressCountry: "IN",
  },
  areaServed: {
    "@type": "Place",
    name: "Worldwide",
  },
  knowsAbout: [
    "Essential Oils",
    "Carrier Oils",
    "Organic Essential Oils",
    "Fragrance Oils",
    "Ayurvedic Herbal Oils",
    "Hydrosols",
    "Indian Attars",
    "Spice Oils",
    "Cosmetic Butters",
    "CO2 Extracts",
    "Oleoresins",
    "Private Label Manufacturing",
    "OEM and ODM",
    "Bulk Essential Oils",
    "Custom Blends",
  ],
  sameAs: [
    "https://www.facebook.com/Naturesnaturalindia.pvt.ltd",
    "https://www.instagram.com/naturenaturalindia/",
    "https://www.youtube.com/@Naturesnaturalindia",
  ],
};

const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": "https://www.naturesnaturalindia.com/#website",
  url: "https://www.naturesnaturalindia.com/",
  name: "Natures Natural India",
  alternateName: "Natures Natural India Oils Pvt. Ltd.",
  description:
    "Natures Natural India is a manufacturer and exporter of pure and natural essential oils, carrier oils, fragrance oils, certified organic oils and allied herbal products, serving B2B clients worldwide.",
  publisher: {
    "@id": "https://www.naturesnaturalindia.com/#organization",
  },
  inLanguage: "en-IN",
  potentialAction: {
    "@type": "SearchAction",
    target: {
      "@type": "EntryPoint",
      urlTemplate:
        "https://www.naturesnaturalindia.com/?s={search_term_string}",
    },
    "query-input": {
      "@type": "PropertyValueSpecification",
      valueRequired: true,
      valueName: "search_term_string",
    },
  },
};

export default async function Page() {
  let categories = [];

  try {
    categories = await getCategories();
  } catch {
    categories = [];
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
      />
      <HomePage categories={categories} />
    </>
  );
}

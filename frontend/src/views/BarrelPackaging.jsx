"use client";

import ServicePageLayout from "../components/ServicePageLayout";

const highlights = [
  {
    icon: "🛢️",
    title: "Export-Grade Drums",
    desc: "UN-certified steel and HDPE drums in 25L, 50L, 200L, and custom sizes, built for long-distance freight without leaks or contamination.",
  },
  {
    icon: "🔒",
    title: "Spill-Proof Sealing",
    desc: "Tamper-evident seals and reinforced bungs keep every drum secure from our dispatch floor to your receiving dock.",
  },
  {
    icon: "🏷️",
    title: "Clear Batch Labelling",
    desc: "Every drum is labelled with batch number, product name, and handling instructions for full traceability.",
  },
  {
    icon: "📦",
    title: "Palletised for Freight",
    desc: "Drums are palletised and shrink-wrapped to standard freight dimensions, ready to load straight into a container.",
  },
];

export default function BarrelPackaging() {
  return (
    <ServicePageLayout
      eyebrow="Packaging"
      title="Barrel Packaging"
      subtitle="Spill-proof, export-ready drum packaging for bulk essential oils, carrier oils, and industrial-volume orders."
      heroImage="/images/infra3.jpeg"
      breadcrumb="Barrel Packaging"
      intro={{
        heading: "Built to Travel",
        paragraphs: [
          "Bulk and wholesale orders move in barrels and drums, and how those are sealed matters just as much as what's inside them. Our packaging process is handled with the same seriousness as production itself — a spill-proof, standard packaging is proof of great care.",
          "We use export-grade steel and HDPE drums, sealed and labelled to withstand long ocean or air freight, so what leaves our facility arrives at yours exactly as it left — full volume, no leaks, no cross-contamination.",
        ],
      }}
      highlights={highlights}
      gallery={[
        { src: "/images/infra3.jpeg", alt: "Barrel packaging line" },
        { src: "/images/Packaging.jpeg", alt: "Export packaging" },
        { src: "/images/Machine.jpg", alt: "Filling machinery" },
        { src: "/images/exportdoc.jpeg", alt: "Export documentation" },
      ]}
      cta={{
        eyebrow: "Plan a Bulk Shipment",
        heading: (
          <>
            Ready to Ship
            <br />
            <span className="text-[#c4a882]">in Bulk?</span>
          </>
        ),
        subtext:
          "Tell us your product, volume, and destination, and we'll confirm drum sizing and packaging options.",
      }}
    />
  );
}

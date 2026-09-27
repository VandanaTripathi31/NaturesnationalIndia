"use client";

import ServicePageLayout from "../components/ServicePageLayout";

const highlights = [
  {
    icon: "📦",
    title: "Container-Ready Volumes",
    desc: "From 25kg drums to full container loads, our production capacity is built to handle large, recurring orders without compromising lead time.",
  },
  {
    icon: "💵",
    title: "Tiered, Transparent Pricing",
    desc: "Bulk pricing scales with volume and order frequency — ask for a quote and we'll break down exactly how the numbers work.",
  },
  {
    icon: "🧾",
    title: "Full Batch Documentation",
    desc: "Every bulk shipment ships with COA, MSDS, and GC-MS reports as standard, so your quality team has everything on arrival.",
  },
  {
    icon: "🚢",
    title: "Export-Ready Packaging",
    desc: "Drums, jerry cans, and IBC totes are sealed, labelled, and export-documented to move smoothly through customs worldwide.",
  },
];

const steps = [
  {
    title: "Share Your Requirement",
    desc: "Tell us the product, quantity, and any specification or grade requirements through our enquiry form.",
  },
  {
    title: "Quote & Sample",
    desc: "We respond with a formal quote and, where useful, a sample so you can verify quality before committing to volume.",
  },
  {
    title: "Production Scheduling",
    desc: "Once confirmed, your order is scheduled into our production line with a clear timeline communicated up front.",
  },
  {
    title: "Dispatch & Documentation",
    desc: "Your bulk order ships with full export paperwork, batch testing reports, and tracking details.",
  },
];

export default function BulkOrders() {
  return (
    <ServicePageLayout
      eyebrow="Private Label"
      title="Bulk Orders"
      subtitle="Reliable, large-volume supply of essential oils, carrier oils, and allied natural products — built for distributors, formulators, and manufacturers."
      heroImage="/images/Bulk.jpg"
      breadcrumb="Bulk Orders"
      intro={{
        heading: "Volume Without Compromise",
        paragraphs: [
          "Whether you're stocking a warehouse, supplying a production line, or fulfilling a distribution contract, our bulk order programme is built to deliver consistent quality at scale — without the price creep that comes with 'fancy' retail packaging.",
          "Every bulk order is backed by the same lab testing and batch traceability as our smallest sample, so scaling up never means scaling down on quality.",
        ],
      }}
      highlights={highlights}
      steps={steps}
      gallery={[
        { src: "/images/Bulk.jpg", alt: "Bulk essential oil supply" },
        {
          src: "/images/Bulk Supply.jpeg",
          alt: "Bulk supply warehouse",
        },
        {
          src: "/images/Bulk essential oils manufacturer.jpg",
          alt: "Bulk essential oils manufacturing",
        },
        { src: "/images/infra4.jpg", alt: "Warehouse and storage" },
      ]}
      cta={{
        eyebrow: "Get a Bulk Quote",
        heading: (
          <>
            Ready to Order
            <br />
            <span className="text-[#c4a882]">at Volume?</span>
          </>
        ),
        subtext:
          "Tell us your product, quantity, and destination — we'll come back with a formal quote within 24 hours.",
      }}
    />
  );
}

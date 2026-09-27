"use client";

import ServicePageLayout from "../components/ServicePageLayout";

const highlights = [
  {
    icon: "📊",
    title: "Tiered Wholesale Pricing",
    desc: "The more you order, the more the per-unit price drops — clear tiers, no hidden negotiation required.",
  },
  {
    icon: "🔄",
    title: "Reorder-Friendly",
    desc: "Standing orders and repeat wholesale accounts get priority scheduling, so restocking never becomes a bottleneck.",
  },
  {
    icon: "🧪",
    title: "Same Lab Standards, Every Order",
    desc: "Wholesale volumes go through the exact same GC-MS and purity testing as our retail-size samples.",
  },
  {
    icon: "🌍",
    title: "Export Documentation Included",
    desc: "Commercial invoices, packing lists, and certificates of origin are prepared for every wholesale shipment.",
  },
];

const steps = [
  {
    title: "Register a Wholesale Account",
    desc: "Tell us a bit about your business — retail, distribution, formulation — so we can set the right pricing tier.",
  },
  {
    title: "Build Your Order",
    desc: "Choose from our full product range, or ask for a curated list based on your market.",
  },
  {
    title: "Confirm & Dispatch",
    desc: "Once confirmed, orders are scheduled, packed, and dispatched with full tracking and paperwork.",
  },
  {
    title: "Ongoing Support",
    desc: "A dedicated point of contact handles reorders, new product requests, and any account-level questions.",
  },
];

export default function Wholesale() {
  return (
    <ServicePageLayout
      eyebrow="Private Label"
      title="Wholesale"
      subtitle="Straightforward wholesale pricing and dependable supply for retailers, distributors, and formulators buying on a recurring basis."
      heroImage="/images/Wholesale.jpg"
      breadcrumb="Wholesale"
      intro={{
        heading: "Built for Repeat Business",
        paragraphs: [
          "Our wholesale programme is designed around one goal: making it easy for retailers, distributors, and formulators to keep their shelves and production lines stocked, order after order.",
          "Wholesale pricing scales with volume, and every account gets a dedicated point of contact who understands your product mix and reorder rhythm — so restocking is never a scramble.",
        ],
      }}
      highlights={highlights}
      steps={steps}
      gallery={[
        { src: "/images/Wholesale.jpg", alt: "Wholesale essential oils" },
        {
          src: "/images/Bulk essential oils manufacturer.jpg",
          alt: "Wholesale manufacturing",
        },
        { src: "/images/infra4.jpg", alt: "Warehouse storage" },
        { src: "/images/essential-oils.jpg", alt: "Wholesale essential oil range" },
      ]}
      cta={{
        eyebrow: "Open a Wholesale Account",
        heading: (
          <>
            Ready to Stock Up
            <br />
            <span className="text-[#c4a882]">at Wholesale Rates?</span>
          </>
        ),
        subtext:
          "Tell us your business type and typical order volume, and we'll set you up with pricing.",
      }}
    />
  );
}

"use client";

import ServicePageLayout from "../components/ServicePageLayout";

const highlights = [
  {
    icon: "🏷️",
    title: "Your Brand, Front and Centre",
    desc: "Every bottle carries your name, your design, and your story — we simply supply the purity inside it.",
  },
  {
    icon: "🎨",
    title: "Send Us the Design",
    desc: "Share your label artwork and specifications, and we handle sourcing, printing, and application from there.",
  },
  {
    icon: "📐",
    title: "Flexible Minimum Order Quantities",
    desc: "Programmes are structured to suit both new brands testing the market and established labels scaling up.",
  },
  {
    icon: "🧴",
    title: "Full Bottling & Packaging Support",
    desc: "From bottle selection to cap style and outer carton, we help bring the full retail-ready product together.",
  },
];

const steps = [
  {
    title: "Share Your Brand Identity",
    desc: "Send us your logo, label design, and any brand guidelines you'd like the finished product to follow.",
  },
  {
    title: "Product & Packaging Selection",
    desc: "Choose your oils, bottle formats, and cap styles — we'll advise on what works best for your target market.",
  },
  {
    title: "Sample Approval",
    desc: "We produce a labelled sample for your sign-off before any full production run begins.",
  },
  {
    title: "Production & Fulfilment",
    desc: "Once approved, your order is filled, labelled, quality-checked, and packed ready for dispatch to you or direct to your customers.",
  },
];

export default function PrivateLabelling() {
  return (
    <ServicePageLayout
      eyebrow="Private Label"
      title="Private Labelling"
      subtitle="A smooth, start-to-finish labelling service that turns our natural oils into a product carrying your brand."
      heroImage="/images/Private Labeling.jpeg"
      breadcrumb="Private Labelling"
      intro={{
        heading: "A Name to Remember",
        paragraphs: [
          "A brand is what connects a product to the people who buy it — and the label is often the first thing they notice. A well-designed label on a beautifully packaged bottle, filled with the purity and goodness of nature, does more to build recognition than almost anything else in your marketing.",
          "We understand how important that recognition is, which is why we offer a complete private labelling service. Send us your design and specifications, and we'll take care of the rest — quality labelling materials, precise application, and a finished product that reflects your brand exactly as you envisioned it.",
        ],
      }}
      highlights={highlights}
      steps={steps}
      gallery={[
        {
          src: "/images/Private Labeling.jpeg",
          alt: "Private labelling service",
        },
        { src: "/images/Private lable.jpg", alt: "Private label bottles" },
        { src: "/images/Private.jpg", alt: "Custom branded products" },
        { src: "/images/Cosmetic Butters.jpeg", alt: "Labelled cosmetic butters" },
      ]}
      cta={{
        eyebrow: "Start Your Brand",
        heading: (
          <>
            Let's Put Your Name
            <br />
            <span className="text-[#c4a882]">on the Bottle</span>
          </>
        ),
        subtext:
          "Share your label design and requirements, and we'll come back with a sample plan and quote.",
      }}
    />
  );
}

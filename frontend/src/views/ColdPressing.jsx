"use client";

import ServicePageLayout from "../components/ServicePageLayout";

const highlights = [
  {
    icon: "❄️",
    title: "No Heat, No Chemicals",
    desc: "Mechanical pressure alone extracts the oil, keeping the process well below temperatures that would break down heat-sensitive nutrients.",
  },
  {
    icon: "🥑",
    title: "Nutrients Stay Intact",
    desc: "Vitamins, fatty acids, and antioxidants that heat or solvents would destroy are preserved in the finished carrier oil.",
  },
  {
    icon: "🌰",
    title: "Ideal for Carrier & Base Oils",
    desc: "Almond, argan, jojoba, olive, and castor oils are among the botanicals we cold press for cosmetic and therapeutic use.",
  },
  {
    icon: "🎯",
    title: "True-to-Source Character",
    desc: "Cold-pressed oils retain the natural colour, aroma, and composition of the seed or kernel they came from.",
  },
];

const steps = [
  {
    title: "Cleaning & Sorting",
    desc: "Seeds, kernels, or fruit are cleaned and sorted to remove debris, ensuring only quality raw material enters the press.",
  },
  {
    title: "Mechanical Pressing",
    desc: "Material is fed through a screw press that applies steady mechanical pressure, releasing the oil without any external heat source.",
  },
  {
    title: "Temperature Monitoring",
    desc: "Friction naturally generates some warmth during pressing, so we monitor closely to keep the process within cold-pressed limits, typically below 50°C.",
  },
  {
    title: "Filtration",
    desc: "The raw pressed oil is filtered to remove sediment and pulp, resulting in a clear, ready-to-use carrier oil.",
  },
  {
    title: "Lab Verification",
    desc: "Each batch is checked for acid value, peroxide value, and other purity parameters before approval for packaging and export.",
  },
];

export default function ColdPressing() {
  return (
    <ServicePageLayout
      eyebrow="Our Distillation"
      title="Cold Pressing"
      subtitle="A low-temperature, mechanical extraction method that preserves the natural nutrients of seeds, nuts, and kernels — the standard for our carrier oil range."
      heroImage="/images/Carrier Oil.jpg"
      breadcrumb="Cold Pressing"
      intro={{
        heading: "Extraction Without Compromise",
        paragraphs: [
          "Cold pressing is a purely mechanical extraction process — no heat, no solvents, and no chemical additives. Seeds, nuts, or kernels are pressed under controlled pressure, and the oil is simply squeezed out and filtered.",
          "Because the process avoids high temperatures, cold-pressed oils retain more of their natural vitamins, essential fatty acids, and antioxidant compounds than oils extracted by heat-based or solvent-based methods. It's the method we rely on for the bulk of our carrier oil range, including argan, almond, jojoba, and olive oil.",
        ],
      }}
      highlights={highlights}
      steps={steps}
      gallery={[
        { src: "/images/Carrier Oil.jpg", alt: "Cold pressed carrier oil" },
        {
          src: "/images/Organic Carrier Oil.jpg",
          alt: "Organic carrier oil",
        },
        { src: "/images/carrier argan-oil.jpeg", alt: "Argan carrier oil" },
        { src: "/images/castor oil.jpeg", alt: "Cold pressed castor oil" },
      ]}
      cta={{
        eyebrow: "Request a Sample",
        heading: (
          <>
            Try Our
            <br />
            <span className="text-[#c4a882]">Cold-Pressed Carrier Oils</span>
          </>
        ),
        subtext:
          "Sample sizes are available across our full cold-pressed carrier oil range — get in touch to request one.",
      }}
    />
  );
}

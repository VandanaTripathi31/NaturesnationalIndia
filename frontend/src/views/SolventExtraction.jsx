"use client";

import ServicePageLayout from "../components/ServicePageLayout";

const highlights = [
  {
    icon: "🌸",
    title: "Built for Delicate Florals",
    desc: "Jasmine, rose, and other fragile flowers release very little oil under steam and would be damaged by it — solvent extraction captures their full aromatic profile instead.",
  },
  {
    icon: "🎨",
    title: "Richer, Truer Aroma",
    desc: "Because no heat or water is involved, the resulting absolute captures a scent profile closer to the living flower than steam distillation can achieve.",
  },
  {
    icon: "🔬",
    title: "Two-Stage Refinement",
    desc: "Raw concrete is refined further with alcohol to remove waxes, yielding a concentrated, wax-free absolute oil.",
  },
  {
    icon: "✅",
    title: "Residue-Tested Every Batch",
    desc: "Solvent residue testing is carried out on every batch to confirm the finished absolute meets export-grade purity standards.",
  },
];

const steps = [
  {
    title: "Flower Selection",
    desc: "Freshly harvested, delicate botanicals — most often flowers — are selected specifically because they yield poorly under heat-based methods.",
  },
  {
    title: "Solvent Washing",
    desc: "The material is gently washed with a food-grade solvent that dissolves the aromatic compounds along with natural waxes and pigments.",
  },
  {
    title: "Solvent Recovery",
    desc: "The solvent is recovered under vacuum and low heat, leaving behind a waxy, highly aromatic solid known as a 'concrete'.",
  },
  {
    title: "Alcohol Washing",
    desc: "The concrete is washed with pure alcohol to separate the aromatic compounds from the waxes, then chilled and filtered.",
  },
  {
    title: "Final Absolute",
    desc: "Once the alcohol is removed, what remains is the absolute oil — a deeply concentrated, true-to-flower extract ready for testing and packaging.",
  },
];

export default function SolventExtraction() {
  return (
    <ServicePageLayout
      eyebrow="Our Distillation"
      title="Solvent Extraction"
      subtitle="The method behind our floral absolutes — used where steam alone can't fully capture a delicate botanical's true aroma."
      heroImage="/images/infra6.jpeg"
      breadcrumb="Solvent Extraction"
      intro={{
        heading: "Capturing What Steam Can't",
        paragraphs: [
          "Some botanicals — particularly delicate flowers like jasmine and rose — yield very little oil under steam distillation, and the heat involved can damage their more fragile aromatic compounds. Solvent extraction was developed to solve exactly this problem.",
          "A food-grade solvent gently draws the aromatic compounds, along with natural waxes, out of the plant material. The solvent is then carefully removed, and what remains after a secondary alcohol wash is an absolute oil — richer and more true to the living flower's scent than steam distillation alone could ever achieve.",
        ],
      }}
      highlights={highlights}
      steps={steps}
      gallery={[
        { src: "/images/infra6.jpeg", alt: "Extraction unit" },
        {
          src: "/images/Absolute Floral Oils.jpg",
          alt: "Floral absolute oils",
        },
        { src: "/images/CO2 Oils.jpeg", alt: "CO2 and solvent extracts" },
        { src: "/images/infra2.jpeg", alt: "Lab analysis" },
      ]}
      cta={{
        eyebrow: "Request a Sample",
        heading: (
          <>
            Discover Our
            <br />
            <span className="text-[#c4a882]">Floral Absolutes</span>
          </>
        ),
        subtext:
          "From jasmine to rose absolute, ask our team for a sample and a full solvent-residue test report.",
      }}
    />
  );
}

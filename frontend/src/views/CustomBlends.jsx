"use client";

import ServicePageLayout from "../components/ServicePageLayout";

const highlights = [
  {
    icon: "🧴",
    title: "Formulated to Your Brief",
    desc: "Give us a purpose — relaxation, focus, skincare, fragrance — and our team formulates a blend to match it.",
  },
  {
    icon: "🌿",
    title: "Drawn From 500+ Ingredients",
    desc: "With one of India's widest single-oil ranges to draw from, blends can be built around almost any botanical profile.",
  },
  {
    icon: "🔁",
    title: "Batch-to-Batch Consistency",
    desc: "Once a formula is finalised, it's documented precisely so every future batch smells and performs the same way.",
  },
  {
    icon: "🔒",
    title: "Exclusive to Your Brand",
    desc: "Custom formulas developed for you stay yours — we don't resell your exact blend to other clients.",
  },
];

const steps = [
  {
    title: "Brief & Inspiration",
    desc: "Share the mood, use case, or reference scent you're aiming for — even a rough idea is a good starting point.",
  },
  {
    title: "Formulation & Trial Blend",
    desc: "Our team develops a trial formulation and sends you a sample to evaluate.",
  },
  {
    title: "Refinement",
    desc: "Based on your feedback, we adjust ratios and ingredients until the blend matches your vision.",
  },
  {
    title: "Documentation & Production",
    desc: "The final formula is documented and locked in, then produced at whatever volume you need — sample size to bulk.",
  },
];

export default function CustomBlends() {
  return (
    <ServicePageLayout
      eyebrow="Private Label"
      title="Custom Blends"
      subtitle="Bespoke essential oil and synergy blends, formulated around your brief and locked in for consistent, repeatable production."
      heroImage="/images/Custom Blends.jpeg"
      breadcrumb="Custom Blends"
      intro={{
        heading: "A Signature Scent, Built for You",
        paragraphs: [
          "Sometimes a single oil isn't enough to capture what a product needs to feel like. Our custom blending service brings together our in-house formulation experience with our full catalogue of essential, carrier, and specialty oils to create a signature blend that's entirely yours.",
          "Whether you're developing an aromatherapy synergy, a skincare base, or a fragrance concept, we work iteratively with you — sample, feedback, refine — until the formula is exactly right, then document it precisely so it stays consistent for every future order.",
        ],
      }}
      highlights={highlights}
      steps={steps}
      gallery={[
        { src: "/images/Custom Blends.jpeg", alt: "Custom essential oil blends" },
        { src: "/images/Synergy Blends.jpg", alt: "Synergy blends" },
        { src: "/images/synergy.jpeg", alt: "Aromatherapy synergy blend" },
        { src: "/images/diffuseroil.jpeg", alt: "Diffuser oil blend" },
      ]}
      cta={{
        eyebrow: "Start a Formulation",
        heading: (
          <>
            Bring Your Blend
            <br />
            <span className="text-[#c4a882]">Concept to Life</span>
          </>
        ),
        subtext:
          "Share your brief — even a rough one — and our formulation team will get back with next steps.",
      }}
    />
  );
}

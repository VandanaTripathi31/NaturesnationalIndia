"use client";

import ServicePageLayout from "../components/ServicePageLayout";

const highlights = [
  {
    icon: "🍾",
    title: "Glass Bottles & Jars",
    desc: "Amber and clear glass in a range of sizes, chosen to protect light-sensitive oils and present beautifully on a shelf.",
  },
  {
    icon: "🧴",
    title: "Aluminium Packaging",
    desc: "Lightweight, UV-protective aluminium bottles for oils that need extra protection from light and oxidation.",
  },
  {
    icon: "🏷️",
    title: "Custom Printed Labels",
    desc: "Your artwork, applied precisely to bottle or jar, with finishes ranging from matte to foil depending on your brand.",
  },
  {
    icon: "📐",
    title: "Format Flexibility",
    desc: "From 5ml sample vials to 1L retail bottles, packaging formats are matched to your product and target market.",
  },
];

export default function PrivatePackaging() {
  return (
    <ServicePageLayout
      eyebrow="Packaging"
      title="Private Packaging"
      subtitle="Retail-ready glass, aluminium, and custom-labelled packaging for brands selling directly to end customers."
      heroImage="/images/Packaging.jpeg"
      breadcrumb="Private Packaging"
      intro={{
        heading: "Packaging That Represents Your Brand",
        paragraphs: [
          "Our workforce takes real pride in the packaging process, because we know it's often the first physical thing a customer touches from your brand. Whether it's a boutique amber glass bottle for a skincare line or a bulk aluminium container for a formulator, packaging is handled with the same care as the oil inside it.",
          "We offer aluminium packaging, glass bottles and jars, drum packaging for larger volumes, and fully custom printed labels — so the finished product looks and feels every bit as considered as its contents.",
        ],
      }}
      highlights={highlights}
      gallery={[
        { src: "/images/Packaging.jpeg", alt: "Private packaging" },
        {
          src: "/images/Cosmetic Butter copy.jpeg",
          alt: "Cosmetic butter jars",
        },
        { src: "/images/Private lable.jpg", alt: "Private label bottles" },
        { src: "/images/infra8.jpeg", alt: "Auto filling and capping" },
      ]}
      cta={{
        eyebrow: "Package Your Product",
        heading: (
          <>
            Let's Design
            <br />
            <span className="text-[#c4a882]">Your Packaging</span>
          </>
        ),
        subtext:
          "Share your target bottle format and label design, and our team will confirm options and lead time.",
      }}
    />
  );
}

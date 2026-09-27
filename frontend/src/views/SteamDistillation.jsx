"use client";

import ServicePageLayout from "../components/ServicePageLayout";

const highlights = [
  {
    icon: "🌡️",
    title: "Precise Temperature Control",
    desc: "Stainless steel stills hold steady, gentle temperatures throughout the run, protecting delicate aromatic compounds from heat damage.",
  },
  {
    icon: "🧪",
    title: "No Solvents, No Residue",
    desc: "Only steam touches the botanical material, so the finished oil carries nothing but what nature put there.",
  },
  {
    icon: "💧",
    title: "Hydrosols As a Bonus",
    desc: "The condensed water from each run is collected too, giving us pure floral waters and hydrosols alongside the essential oil.",
  },
  {
    icon: "⚖️",
    title: "Consistent, Batch-Traceable Yield",
    desc: "Every batch is logged for load weight, run time, and yield, so quality stays consistent from one production run to the next.",
  },
];

const steps = [
  {
    title: "Botanical Loading",
    desc: "Fresh or dried plant material — leaves, flowers, seeds, roots, or bark depending on the botanical — is loaded into a stainless steel still.",
  },
  {
    title: "Steam Generation",
    desc: "Steam is passed through or around the plant material, gently rupturing the tiny oil-bearing glands within the botanical structure.",
  },
  {
    title: "Vapour Collection",
    desc: "The rising vapour — now carrying both water and volatile aromatic compounds — travels through a condenser coil and cools back into liquid form.",
  },
  {
    title: "Oil–Water Separation",
    desc: "In a separator vessel, the essential oil (lighter, and generally insoluble in water) naturally floats free from the condensed water below.",
  },
  {
    title: "Filtration & Quality Check",
    desc: "The separated oil is filtered and sent to our in-house lab for GC-MS testing, confirming purity before it's approved for packaging.",
  },
];

export default function SteamDistillation() {
  return (
    <ServicePageLayout
      eyebrow="Our Distillation"
      title="Steam Distillation"
      subtitle="The traditional, time-tested method behind the majority of the essential oils we produce — gentle, solvent-free, and true to the botanical."
      heroImage="/images/infra5.jpeg"
      breadcrumb="Steam Distillation"
      intro={{
        heading: "Extraction in Its Purest Form",
        paragraphs: [
          "Steam distillation is the oldest and most widely used method of essential oil extraction, and it remains our primary production process for the majority of the botanicals we work with — from lavender and peppermint to eucalyptus and clove.",
          "The principle is simple: steam passes through the plant material, carrying the volatile aromatic compounds with it as vapour. Once cooled, the oil naturally separates from the water, leaving behind an essential oil that reflects the true character of the source botanical — with no solvents and no residue.",
        ],
      }}
      highlights={highlights}
      steps={steps}
      gallery={[
        { src: "/images/infra5.jpeg", alt: "Steam distillation unit" },
        { src: "/images/Machine.jpg", alt: "Distillation machinery" },
        { src: "/images/Oil Process.jpg", alt: "Oil extraction process" },
        { src: "/images/infra1.jpeg", alt: "GC-MS lab testing" },
      ]}
      cta={{
        eyebrow: "Request a Sample",
        heading: (
          <>
            Experience the Purity
            <br />
            <span className="text-[#c4a882]">of Steam-Distilled Oils</span>
          </>
        ),
        subtext:
          "Ask about any oil in our range and we'll confirm whether it's steam distilled, along with a batch COA.",
      }}
    />
  );
}

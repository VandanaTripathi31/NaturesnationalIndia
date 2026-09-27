"use client";

import ServicePageLayout from "../components/ServicePageLayout";
import FadeIn from "../components/FadeIn";

const highlights = [
  {
    icon: "🌿",
    title: "One of India's Widest Ranges",
    desc: "From everyday essential oils to rare, specialty botanicals — we manufacture and stock one of the largest selections of natural oils in India.",
  },
  {
    icon: "🏭",
    title: "Manufacturing, Not Just Trading",
    desc: "We control our own distillation and extraction, so quality, consistency, and supply are never left to a third party.",
  },
  {
    icon: "💰",
    title: "Value Over 'Fancy' Packaging",
    desc: "We keep overheads lean and pass the savings on — the focus stays on the purity of what's inside the bottle, at a competitive price.",
  },
  {
    icon: "🤝",
    title: "Relationships Built on Trust",
    desc: "Samples, transparency, and honest communication come before every large order, so clients know exactly what they're buying.",
  },
  {
    icon: "🌾",
    title: "Fresh, Current-Season Crops",
    desc: "Raw material is sourced according to harvest calendars, ensuring the oils we ship are as fresh as the season allows — year round.",
  },
  {
    icon: "🌍",
    title: "Built for Global Export",
    desc: "Bulk sales, wholesale, and export documentation are handled in-house, with shipments reaching 70+ countries worldwide.",
  },
];

export default function AboutUs() {
  return (
    <ServicePageLayout
      eyebrow="Who We Are"
      title="About Us"
      subtitle="A manufacturer, wholesaler, and exporter of natural essential oils, carrier oils, and allied aromatic products — built on purity, transparency, and fair value."
      heroImage="/images/Aboutusimg.jpeg"
      breadcrumb="About Us"
      intro={{
        heading: "Rooted in Purity, Built for the World",
        paragraphs: [
          "Natures Natural India is an India-based manufacturer proudly stocking one of the largest selections of rare and specialty essential oils and allied aromatic products in the country. Beyond manufacturing, we specialise in bulk sales, wholesaling, and export — with offerings customised for every client, from independent formulators to global distributors.",
          "We don't spend on 'fancy' packaging that inflates the price a client pays. Instead, every rupee goes toward delivering the purest form of a product at the most competitive, honest value for money.",
          "We give clients space to learn about each product, provide samples so they can judge our quality for themselves, and build long-term relationships through transparent, ethical work practices. Raw materials are brought in according to current harvest dates, so the oils leaving our facility are as fresh as possible — all year round.",
        ],
      }}
      highlights={highlights}
      cta={{
        eyebrow: "Work With Us",
        heading: (
          <>
            Let's Build a
            <br />
            <span className="text-[#c4a882]">Lasting Partnership</span>
          </>
        ),
        subtext:
          "Whether you need a single sample or a container load, our export team is ready to help.",
        buttonLabel: "Send Enquiry",
      }}
    >
      {/* Address / quick-contact strip, reusing existing brand data */}
      <section className="pb-4">
        <div className="max-w-5xl mx-auto px-6">
          <FadeIn>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 bg-white border border-[#ede8e3] rounded-3xl p-8">
              <div>
                <div className="text-[11px] font-bold tracking-widest uppercase text-[#7a5544] mb-2">
                  Head Office
                </div>
                <p className="text-sm text-[#3e2b1e] leading-relaxed">
                  51, 1/6, Sahibabad Industrial Area, Site 4,
                  <br />
                  Sahibabad, Ghaziabad, Uttar Pradesh 201010, India
                </p>
              </div>
              <div>
                <div className="text-[11px] font-bold tracking-widest uppercase text-[#7a5544] mb-2">
                  Call Us
                </div>
                <a
                  href="tel:+919711003901"
                  className="text-sm text-[#3e2b1e] hover:text-[#7a5544] transition-colors"
                >
                  +91 9711003901
                </a>
              </div>
              <div>
                <div className="text-[11px] font-bold tracking-widest uppercase text-[#7a5544] mb-2">
                  Email Us
                </div>
                <a
                  href="mailto:info@naturesnaturalindia.com"
                  className="text-sm text-[#3e2b1e] hover:text-[#7a5544] transition-colors break-all"
                >
                  info@naturesnaturalindia.com
                </a>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>
    </ServicePageLayout>
  );
}

"use client";

import ServicePageLayout from "../components/ServicePageLayout";
import FadeIn from "../components/FadeIn";

const highlights = [
  {
    icon: "🔐",
    title: "Encrypted Transactions",
    desc: "Payment details are processed over secure, encrypted connections — we never store full card information on our servers.",
  },
  {
    icon: "📜",
    title: "Verified Certifications",
    desc: "ISO, WHO-GMP, HACCP, Halal, and Kosher certifications back every product we ship, giving you confidence in what you're buying.",
  },
  {
    icon: "🧾",
    title: "Transparent Documentation",
    desc: "COA, MSDS, and GC-MS reports are available for every batch, so there are no surprises after the order ships.",
  },
  {
    icon: "↩️",
    title: "Fair Returns Policy",
    desc: "Our returns and refund policy is published in plain language — no fine print designed to catch you out.",
  },
];

const certBadges = [
  { src: "/images/ISO.png", label: "ISO 9001:2008" },
  { src: "/images/WHO-GMP.png", label: "WHO-GMP" },
  { src: "/images/HACCP.png", label: "HACCP" },
  { src: "/images/Halal.png", label: "Halal Certified" },
  { src: "/images/Kosher.png", label: "Kosher Certified" },
  { src: "/images/USDA.png", label: "USDA Organic" },
  { src: "/images/GMP.png", label: "GMP Quality" },
  { src: "/images/Spices Board.png", label: "Spices Board India" },
];

export default function SecureShopping() {
  return (
    <ServicePageLayout
      eyebrow="Private Label"
      title="Secure Shopping"
      subtitle="Every order is backed by encrypted payments, verified certifications, and a clear, fair returns policy — so you can order with confidence."
      heroImage="/images/Secure Shopping.jpeg"
      breadcrumb="Secure Shopping"
      intro={{
        heading: "Order With Confidence",
        paragraphs: [
          "Trust is earned order by order, and we back every transaction with the same seriousness we bring to product quality — secure payment handling, verified certifications, and complete documentation for every batch.",
          "Below are the certifications that stand behind our products, along with the safeguards we put in place around every order you place with us.",
        ],
      }}
      highlights={highlights}
      cta={{
        eyebrow: "Questions About an Order?",
        heading: (
          <>
            Shop and Ship
            <br />
            <span className="text-[#c4a882]">With Confidence</span>
          </>
        ),
        subtext:
          "Have a question about payment, shipping, or a specific certificate? Our team is one message away.",
        buttonLabel: "Contact Us",
      }}
    >
      <section className="pb-4">
        <div className="max-w-5xl mx-auto px-6">
          <FadeIn>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-5">
              {certBadges.map((c, i) => (
                <div
                  key={c.label}
                  className="bg-white border border-[#ede8e3] rounded-2xl p-5 flex flex-col items-center text-center hover:border-[#c4a882] hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
                >
                  <img
                    src={c.src}
                    alt={c.label}
                    className="h-12 w-auto object-contain mb-3"
                  />
                  <span className="text-[#3e2b1e] text-xs font-semibold">
                    {c.label}
                  </span>
                </div>
              ))}
            </div>
          </FadeIn>
        </div>
      </section>
    </ServicePageLayout>
  );
}

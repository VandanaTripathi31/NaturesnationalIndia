"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import ServicePageLayout from "../components/ServicePageLayout";
import FadeIn from "../components/FadeIn";

const policySections = [
  {
    title: "Privacy Policy",
    body: [
      "We respect the privacy of everyone who visits or buys from this website, and we only use the information you share with us in line with this policy. This policy may be updated from time to time, so we'd encourage you to check back periodically.",
      "What we collect: your name, contact details such as email and phone, general location information, and any preferences you share with us that help us serve your enquiry better.",
      "How we use it: to keep accurate business records, to improve our products and services, to respond to your enquiries, and — only where you've agreed to it — to let you know about new products or offers relevant to your business. We never sell your information to third parties, and we only share it with partners where necessary to fulfil an order or as required by law.",
      "Cookies: small files are used to understand how visitors use the site, so we can keep improving it. You're free to decline cookies, though some parts of the site may not work as smoothly without them.",
      "Your control: you can ask us at any time to stop using your data for marketing, correct information that's out of date, or request a copy of what we hold on you. Just email us and we'll act on it promptly.",
    ],
  },
  {
    title: "Terms & Conditions",
    body: [
      "By placing an order with Natures Natural India, you agree to these terms. Orders are confirmed once payment and shipping details are verified, and we'll always confirm quantities, pricing, and specifications with you in writing before dispatch.",
      "Verbal orders are accepted, but any miscommunication on a verbal order is the responsibility of the purchaser — wherever possible, please confirm requirements in writing so both sides have a clear record.",
      "Product specifications, certificates of analysis (COA), and safety data (MSDS) are available on request for every batch we ship, so you always know exactly what you're receiving.",
    ],
  },
  {
    title: "Returns & Refunds",
    body: [
      "We stand firmly behind the quality of every product we ship. If you're not satisfied, most items (up to 1 kg) can be returned within 15 calendar days of delivery, provided they're unused and in their original packaging.",
      "A reasonable restocking fee applies to returns that aren't the result of our error, and returns raised after the 15-day window may carry a higher fee. Sample orders, special orders, and large bulk shipments are generally treated as final sale — we'll always flag this clearly at the time of order.",
      "If we made an error on a written order, we cover the cost of correcting it, including re-shipment. All returns need an authorisation number from our team first, so please get in touch before sending anything back.",
      "Refunds and credits are typically processed within one calendar month of us receiving and inspecting the returned goods.",
    ],
  },
  {
    title: "Secure Payment & Data Safety",
    body: [
      "All payment information shared with us is handled with strict internal controls, and we never store full card details on our servers. Order and enquiry data is kept on secured systems with restricted access.",
      "If you ever have a concern about the safety of your information or a transaction, contact our team directly and we'll look into it right away.",
    ],
  },
];

function AccordionItem({ section, isOpen, onToggle }) {
  return (
    <div className="bg-white border border-[#ede8e3] rounded-2xl overflow-hidden hover:border-[#c4a882] transition-colors duration-300">
      <button
        type="button"
        onClick={onToggle}
        className="w-full flex items-center justify-between gap-4 px-6 sm:px-7 py-5 text-left cursor-pointer bg-transparent border-none"
      >
        <span
          style={{ fontFamily: "'Playfair Display',serif" }}
          className="text-lg sm:text-xl font-semibold text-[#3e2b1e]"
        >
          {section.title}
        </span>
        <ChevronDown
          size={20}
          style={{
            color: "#a8896c",
            transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
            transition: "transform 0.3s ease",
            flexShrink: 0,
          }}
        />
      </button>
      <div
        style={{
          maxHeight: isOpen ? "800px" : "0px",
          overflow: "hidden",
          transition: "max-height 0.4s cubic-bezier(0.4,0,0.2,1)",
        }}
      >
        <div className="px-6 sm:px-7 pb-7 space-y-3">
          {section.body.map((p, i) => (
            <p key={i} className="text-[#6b5a4e] text-sm leading-relaxed">
              {p}
            </p>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function Policies() {
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <ServicePageLayout
      eyebrow="Transparency First"
      title="Policies"
      subtitle="Our privacy, terms, and returns policies — written in plain language so you always know where you stand."
      heroImage="/images/Privacy Policies.jpeg"
      breadcrumb="Policies"
      cta={{
        eyebrow: "Questions?",
        heading: (
          <>
            Talk to Our
            <br />
            <span className="text-[#c4a882]">Support Team</span>
          </>
        ),
        subtext:
          "If anything here isn't clear, or you'd like specifics for your order, our team is happy to walk you through it.",
        buttonLabel: "Contact Us",
      }}
    >
      <section className="py-20 sm:py-24">
        <div className="max-w-3xl mx-auto px-6">
          <div className="space-y-4">
            {policySections.map((section, i) => (
              <FadeIn key={section.title} delay={i * 70}>
                <AccordionItem
                  section={section}
                  isOpen={openIndex === i}
                  onToggle={() => setOpenIndex(openIndex === i ? -1 : i)}
                />
              </FadeIn>
            ))}
          </div>
          <FadeIn delay={policySections.length * 70}>
            <p className="text-center text-[#a8896c] text-xs mt-8">
              Last updated 2026. For a full copy of any policy, email{" "}
              <a
                href="mailto:info@naturesnaturalindia.com"
                className="underline hover:text-[#7a5544]"
              >
                info@naturesnaturalindia.com
              </a>
              .
            </p>
          </FadeIn>
        </div>
      </section>
    </ServicePageLayout>
  );
}

"use client";

import { MapPin, Phone, Mail, Clock } from "lucide-react";
import ServicePageLayout from "../components/ServicePageLayout";
import FadeIn from "../components/FadeIn";

const offices = [
  {
    label: "Head Office & Manufacturing Unit",
    address:
      "Plot No. B 45/7, Site-4, Industrial Area, Sahibabad, Ghaziabad-201010 (UP) India",
    mapHref: "https://goo.gl/maps/UujTpfZP7xWNYTAb7",
    phone: "+91 9711003901",
    email: "info@naturesnaturalindia.com",
    hours: "Mon – Sat, 9:30 AM – 6:30 PM IST",
  },
];

const stats = [
  { value: "15,000+", label: "Active B2B Clients" },
  { value: "70+", label: "Countries Served" },
  { value: "500+", label: "Product Varieties" },
  { value: "15+", label: "Years in Business" },
];

export default function OurOffices() {
  return (
    <ServicePageLayout
      eyebrow="Where We Are"
      title="Our Offices"
      subtitle="Our manufacturing base sits in Sahibabad, Ghaziabad, at the heart of India's industrial belt — with export operations reaching over 70 countries."
      heroImage="/images/infra7.jpeg"
      breadcrumb="Our Offices"
      cta={{
        eyebrow: "Visit or Get In Touch",
        heading: (
          <>
            Come See Where
            <br />
            <span className="text-[#c4a882]">Your Oils Are Made</span>
          </>
        ),
        subtext:
          "Prefer to talk first? Reach our export team directly and we'll arrange a visit or a sample shipment.",
        buttonLabel: "Send Enquiry",
      }}
    >
      {/* OFFICE CARD */}
      <section className="py-20 sm:py-24">
        <div className="max-w-4xl mx-auto px-6">
          {offices.map((office, i) => (
            <FadeIn key={office.label} delay={i * 80}>
              <div className="bg-white border border-[#ede8e3] rounded-3xl p-8 sm:p-10 hover:border-[#c4a882] hover:shadow-xl transition-all duration-300 mb-6">
                <h3
                  style={{ fontFamily: "'Playfair Display',serif" }}
                  className="text-2xl font-semibold text-[#3e2b1e] mb-6"
                >
                  {office.label}
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="flex gap-3">
                    <MapPin
                      size={18}
                      className="flex-shrink-0 mt-0.5"
                      style={{ color: "#a8896c" }}
                    />
                    <div>
                      <div className="text-[11px] font-bold tracking-widest uppercase text-[#7a5544] mb-1">
                        Address
                      </div>
                      <a
                        href={office.mapHref}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-[#3e2b1e] leading-relaxed hover:text-[#7a5544] transition-colors"
                      >
                        {office.address}
                      </a>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <Phone
                      size={18}
                      className="flex-shrink-0 mt-0.5"
                      style={{ color: "#a8896c" }}
                    />
                    <div>
                      <div className="text-[11px] font-bold tracking-widest uppercase text-[#7a5544] mb-1">
                        Phone
                      </div>
                      <a
                        href={`tel:${office.phone.replace(/\s/g, "")}`}
                        className="text-sm text-[#3e2b1e] hover:text-[#7a5544] transition-colors"
                      >
                        {office.phone}
                      </a>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <Mail
                      size={18}
                      className="flex-shrink-0 mt-0.5"
                      style={{ color: "#a8896c" }}
                    />
                    <div>
                      <div className="text-[11px] font-bold tracking-widest uppercase text-[#7a5544] mb-1">
                        Email
                      </div>
                      <a
                        href={`mailto:${office.email}`}
                        className="text-sm text-[#3e2b1e] hover:text-[#7a5544] transition-colors break-all"
                      >
                        {office.email}
                      </a>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <Clock
                      size={18}
                      className="flex-shrink-0 mt-0.5"
                      style={{ color: "#a8896c" }}
                    />
                    <div>
                      <div className="text-[11px] font-bold tracking-widest uppercase text-[#7a5544] mb-1">
                        Working Hours
                      </div>
                      <p className="text-sm text-[#3e2b1e]">{office.hours}</p>
                    </div>
                  </div>
                </div>
              </div>
            </FadeIn>
          ))}

          {/* Map preview */}
          <FadeIn delay={100}>
            <a
              href="https://goo.gl/maps/UujTpfZP7xWNYTAb7"
              target="_blank"
              rel="noopener noreferrer"
              className="block rounded-3xl overflow-hidden border border-[#ede8e3] hover:border-[#c4a882] transition-colors duration-300 relative group"
            >
              <img
                src="/images/map.jpeg"
                alt="Map to our Sahibabad, Ghaziabad office"
                className="w-full h-56 sm:h-72 object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#2a1a10]/70 via-transparent to-transparent flex items-end p-5">
                <span className="text-white text-sm font-semibold">
                  Open in Google Maps →
                </span>
              </div>
            </a>
          </FadeIn>
        </div>
      </section>

      {/* STATS */}
      <section className="pb-20 sm:pb-24">
        <div className="max-w-5xl mx-auto px-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
            {stats.map((s, i) => (
              <FadeIn key={s.label} delay={i * 80}>
                <div className="bg-white border border-[#ede8e3] rounded-3xl p-6 text-center hover:border-[#c4a882] hover:shadow-lg transition-all duration-300">
                  <div
                    style={{ fontFamily: "'Playfair Display',serif" }}
                    className="text-3xl font-bold text-[#5c4033] mb-1"
                  >
                    {s.value}
                  </div>
                  <div className="text-[#6b5a4e] text-xs font-semibold uppercase tracking-wide">
                    {s.label}
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>
    </ServicePageLayout>
  );
}

import React, { useState } from "react";
import { ChevronRight } from "lucide-react";

const Certifications = () => {
  const [hoveredCert, setHoveredCert] = useState(null);

  const certificationsData = [
    {
      id: 1,
      name: "HACCP Certified",
      image: "/images/certificate1.png",
      description: "Hazard Analysis and Critical Control Points",
    },
    {
      id: 2,
      name: "ISO 9001:2015 Certified",
      image: "/images/certificate2.png",
      description: "Quality Management System",
    },
    {
      id: 3,
      name: "Kosher Certified",
      image: "/images/certificate3.png",
      description: "Meets Kosher dietary laws",
    },
    {
      id: 4,
      name: "WHO-GMP Certified",
      image: "/images/certifiacte4.png",
      description: "World Health Organization Good Manufacturing Practice",
    },
    {
      id: 5,
      name: "Halal Certified",
      image: "/images/certificate5.png",
      description: "Certified Halal compliant",
    },
  ];

  return (
    <div className="w-full">
      {/* Hero Section */}
      <section className="relative w-full h-screen min-h-[500px] md:min-h-[600px] flex items-center justify-center overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <img
            src="/images/certifications.jpg"
            alt="Certifications Hero"
            className="w-full h-full"
          />
          {/* Dark Overlay - using custom gradient */}
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(135deg, rgba(62, 43, 30, 0.8) 0%, rgba(92, 64, 51, 0.75) 55%, rgba(111, 78, 55, 0.7) 100%)",
            }}
          ></div>
        </div>

        {/* Hero Content - Empty (no text) */}

        {/* Breadcrumb */}
        <div className="absolute bottom-8 left-8 right-8 z-10">
          <nav className="flex items-center gap-2 text-sm md:text-base">
            <a
              href="/"
              className="transition-colors hover:opacity-80"
              style={{ color: "var(--color-warm-gray)" }}
            >
              Home
            </a>
            <ChevronRight
              className="w-4 h-4"
              style={{ color: "var(--color-brown-muted)" }}
            />
            <span
              className="font-semibold"
              style={{ color: "var(--color-brown-light)" }}
            >
              Certifications
            </span>
          </nav>
        </div>
      </section>

      {/* Introduction Section */}
      <section
        className="py-16 sm:py-20 md:py-28 px-4 sm:px-6 lg:px-8"
        style={{ backgroundColor: "var(--color-cream-white)" }}
      >
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16 items-center">
            {/* Left Content */}
            <div className="order-2 md:order-1">
              <div className="space-y-6">
                <div>
                  <p
                    className="text-sm font-semibold uppercase tracking-widest mb-3"
                    style={{ color: "var(--color-dark-brown)" }}
                  >
                    Why Certifications Matter
                  </p>
                  <h2
                    className="text-3xl sm:text-4xl md:text-5xl font-bold font-playfair leading-tight"
                    style={{ color: "var(--color-text-primary)" }}
                  >
                    Global Quality Standards
                  </h2>
                </div>

                <p
                  className="text-base sm:text-lg leading-relaxed"
                  style={{ color: "var(--color-text-muted)" }}
                >
                  Our comprehensive certification portfolio demonstrates our
                  unwavering commitment to excellence, safety, and
                  sustainability. Each certification represents rigorous
                  testing, compliance verification, and adherence to
                  international best practices.
                </p>

                {/* Key Points */}
                <div className="space-y-4 pt-6">
                  {[
                    {
                      title: "Quality Assurance",
                      desc: "Rigorous testing protocols ensure consistent product quality",
                    },
                    {
                      title: "Global Standards",
                      desc: "Compliance with international regulatory requirements",
                    },
                    {
                      title: "Product Authenticity",
                      desc: "Verified sourcing and authentic ingredient certification",
                    },
                    {
                      title: "Customer Trust",
                      desc: "Third-party validation for transparency and reliability",
                    },
                  ].map((point, idx) => (
                    <div key={idx} className="flex gap-4 group">
                      <div
                        className="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center mt-1 transition-colors duration-300"
                        style={{ backgroundColor: "var(--color-sage-light)" }}
                      >
                        <div
                          className="w-2 h-2 rounded-full transition-colors duration-300"
                          style={{ backgroundColor: "var(--color-sage-dark)" }}
                        ></div>
                      </div>
                      <div>
                        <h3
                          className="font-semibold text-base"
                          style={{ color: "var(--color-text-primary)" }}
                        >
                          {point.title}
                        </h3>
                        <p
                          className="text-sm mt-1"
                          style={{ color: "var(--color-text-muted)" }}
                        >
                          {point.desc}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right - Stats */}
            <div className="order-1 md:order-2">
              <div className="grid grid-cols-2 gap-6">
                {[
                  {
                    label: "5+",
                    desc: "International Certifications",
                    bg: "var(--color-brown-light)",
                  },
                  {
                    label: "100%",
                    desc: "Compliant Products",
                    bg: "var(--color-sage-light)",
                  },
                  {
                    label: "50+",
                    desc: "Countries Served",
                    bg: "var(--color-warm-gray)",
                  },
                  {
                    label: "20+",
                    desc: "Years Excellence",
                    bg: "var(--color-off-white)",
                  },
                ].map((stat, idx) => (
                  <div
                    key={idx}
                    className="rounded-2xl p-8 hover:shadow-lg transition-shadow"
                    style={{ backgroundColor: stat.bg, borderRadius: "1rem" }}
                  >
                    <div
                      className="text-4xl sm:text-5xl font-bold font-playfair mb-2"
                      style={{ color: "var(--color-dark-brown)" }}
                    >
                      {stat.label}
                    </div>
                    <p
                      className="font-semibold text-sm"
                      style={{ color: "var(--color-text-primary)" }}
                    >
                      {stat.desc}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Certifications Gallery Section */}
      <section
        className="py-16 sm:py-20 md:py-28 px-4 sm:px-6 lg:px-8"
        style={{ backgroundColor: "var(--color-off-white)" }}
      >
        <div className="max-w-6xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-16 sm:mb-20">
            <p
              className="text-sm font-semibold uppercase tracking-widest mb-4"
              style={{ color: "var(--color-dark-brown)" }}
            >
              Our Credentials
            </p>
            <h2
              className="text-3xl sm:text-4xl md:text-5xl font-bold font-playfair mb-6"
              style={{ color: "var(--color-text-primary)" }}
            >
              Industry-Leading Certifications
            </h2>
            <p
              className="text-base sm:text-lg max-w-2xl mx-auto"
              style={{ color: "var(--color-text-muted)" }}
            >
              Recognized certifications from prestigious international bodies,
              validating our commitment to quality and customer safety.
            </p>
          </div>

          {/* Certifications Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {certificationsData.map((cert) => (
              <div
                key={cert.id}
                onMouseEnter={() => setHoveredCert(cert.id)}
                onMouseLeave={() => setHoveredCert(null)}
                className="group h-full"
              >
                {/* Certificate Card */}
                <div
                  className="h-full flex flex-col rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-500 hover:scale-105 hover:-translate-y-2 border"
                  style={{
                    backgroundColor: "var(--color-cream-white)",
                    borderColor: "var(--color-warm-gray)",
                  }}
                >
                  {/* Image Container */}
                  <div
                    className="relative overflow-hidden w-full aspect-square"
                    style={{ backgroundColor: "var(--color-soft-gray)" }}
                  >
                    <img
                      src={cert.image}
                      alt={cert.name}
                      className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-700 p-4"
                    />

                    {/* Overlay on Hover */}
                    <div
                      className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end justify-start p-6"
                      style={{
                        background:
                          "linear-gradient(to top, rgba(62, 43, 30, 0.95), rgba(62, 43, 30, 0.6), transparent)",
                      }}
                    >
                      <div className="text-white">
                        <p
                          className="text-sm font-semibold mb-2"
                          style={{ color: "var(--color-brown-light)" }}
                        >
                          Verified Certification
                        </p>
                        <p className="text-sm leading-relaxed">
                          {cert.description}
                        </p>
                      </div>
                    </div>

                    {/* Badge */}
                    <div
                      className="absolute top-4 right-4 px-4 py-2 rounded-full flex items-center gap-2 shadow-lg backdrop-blur-sm"
                      style={{ backgroundColor: "rgba(248, 245, 242, 0.95)" }}
                    >
                      <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                      <span
                        className="text-xs font-semibold"
                        style={{ color: "var(--color-text-primary)" }}
                      >
                        Certified
                      </span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex-1 p-6 sm:p-5 md:p-6 flex flex-col justify-between">
                    <div>
                      <h3
                        className="text-lg sm:text-base md:text-lg font-bold font-playfair mb-3 group-hover:transition-colors group-hover:duration-300 leading-snug"
                        style={{ color: "var(--color-text-primary)" }}
                        onMouseEnter={(e) =>
                          (e.currentTarget.style.color =
                            "var(--color-dark-brown)")
                        }
                        onMouseLeave={(e) =>
                          (e.currentTarget.style.color =
                            "var(--color-text-primary)")
                        }
                      >
                        {cert.name}
                      </h3>
                      <p
                        className="text-sm leading-relaxed mb-4"
                        style={{ color: "var(--color-text-muted)" }}
                      >
                        International standard certification ensuring highest
                        quality and safety standards for our products.
                      </p>
                    </div>

                    {/* Footer Action */}
                    <button
                      className="flex items-center gap-2 font-semibold text-sm group-hover:gap-3 transition-all duration-300"
                      style={{ color: "var(--color-dark-brown)" }}
                    >
                      View Details
                      <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Certifications;

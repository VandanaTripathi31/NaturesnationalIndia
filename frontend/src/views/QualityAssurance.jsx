import { useState, useEffect, useRef } from "react";

const img_coa = "images/COA.jpeg";
const img_mgms = "images/MG-MS-Report.jpeg";
const img_msds = "images/MSDS.jpeg";
const img_cert = "images/Certification.jpeg";
function useInView(threshold = 0.15) {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) setInView(true);
      },
      { threshold },
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [threshold]);
  return [ref, inView];
}

function FadeIn({ children, delay = 0, className = "" }) {
  const [ref, inView] = useInView();
  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: inView ? 1 : 0,
        transform: inView ? "translateY(0)" : "translateY(30px)",
        transition: `opacity 0.7s ease ${delay}ms, transform 0.7s ease ${delay}ms`,
      }}
    >
      {children}
    </div>
  );
}

function useCounter(target, duration = 1800, start = false) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!start) return;
    let s = null;
    const step = (ts) => {
      if (!s) s = ts;
      const p = Math.min((ts - s) / duration, 1);
      setCount(Math.floor(p * target));
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [target, duration, start]);
  return count;
}

function StatCard({ value, suffix, label, desc, icon, delay = 0 }) {
  const [ref, inView] = useInView(0.3);
  const count = useCounter(value, 1600, inView);
  return (
    <div
      ref={ref}
      style={{
        opacity: inView ? 1 : 0,
        transform: inView ? "translateY(0)" : "translateY(24px)",
        transition: `opacity 0.6s ease ${delay}ms, transform 0.6s ease ${delay}ms`,
      }}
      className="bg-[#faf8f5] border border-[#ede8e3] rounded-3xl p-8 text-center hover:shadow-xl hover:border-[#c4a882] hover:-translate-y-1 transition-all duration-300"
    >
      <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#f0e4d4] to-[#ede0cc] flex items-center justify-center mx-auto mb-5 text-[#7a5544] text-2xl">
        {icon}
      </div>
      <div className="font-serif text-5xl font-bold text-[#5c4033]">
        {count}
        {suffix}
      </div>
      <div className="font-semibold text-[#3e2b1e] mt-3 mb-2 text-sm">
        {label}
      </div>
      <p className="text-[#6b5a4e] text-xs leading-relaxed">{desc}</p>
    </div>
  );
}

const processSteps = [
  {
    icon: "📋",
    title: "Raw Material Inspection",
    desc: "Every incoming raw material is rigorously assessed for purity, botanical identity, and compliance with strict sourcing standards before entering production.",
  },
  {
    icon: "⚙️",
    title: "Production Monitoring",
    desc: "Real-time monitoring throughout distillation ensures consistent temperature, pressure, and yield parameters are maintained batch to batch.",
  },
  {
    icon: "🔬",
    title: "Laboratory Testing",
    desc: "In-house and accredited third-party labs conduct comprehensive physico-chemical and organoleptic analysis on every product.",
  },
  {
    icon: "📦",
    title: "Packaging Verification",
    desc: "Seal integrity, label accuracy, fill levels, and material compatibility are verified before any product is approved for dispatch.",
  },
  {
    icon: "✅",
    title: "Final QA Approval",
    desc: "A dedicated QA team issues final approval only when all parameters meet specification — no exceptions, no compromises.",
  },
];

const testingMethods = [
  {
    title: "GC-MS Testing",
    desc: "Gas Chromatography–Mass Spectrometry identifies and quantifies individual chemical constituents, confirming authenticity and detecting adulterants.",
  },
  {
    title: "Purity Analysis",
    desc: "Multi-parameter purity testing ensures no synthetic extenders, carrier oils, or foreign substances are present in our essential oils.",
  },
  {
    title: "Refractive Index",
    desc: "Optical purity is measured against international reference standards to verify the unique refractive signature of each oil.",
  },
  {
    title: "Specific Gravity",
    desc: "Density measurement at calibrated temperatures confirms composition consistency and flags deviations across production batches.",
  },
  {
    title: "Microbiological Testing",
    desc: "Total plate count, yeast & mould, and pathogen screening ensure every product is safe for cosmetic, therapeutic, and food applications.",
  },
  {
    title: "Stability Testing",
    desc: "Accelerated and real-time stability studies validate shelf life and confirm quality is preserved through the product's entire lifecycle.",
  },
];

const docs = [
  {
    abbr: "COA",
    title: "Certificate of Analysis",
    desc: "Full batch-specific analytical results covering all quality parameters.",
    img: img_coa,
  },
  {
    abbr: "GC/MS",
    title: "GC-MS Report",
    desc: "Detailed constituent breakdown via gas chromatography-mass spectrometry.",
    img: img_mgms,
  },
  {
    abbr: "MSDS",
    title: "Safety Data Sheet",
    desc: "Complete handling, hazard classification, and transport information.",
    img: img_msds,
  },
  //   {
  //     abbr: "SPEC",
  //     title: "Product Specification",
  //     desc: "Defined acceptance criteria and parameter ranges per product.",
  //   },
  //   {
  //     abbr: "ALLG",
  //     title: "Allergen Declaration",
  //     desc: "Known allergen status disclosure for regulatory compliance.",
  //   },
  //   {
  //     abbr: "TDS",
  //     title: "Technical Data Sheet",
  //     desc: "Application guidance, properties, and recommended usage.",
  //   },
];

const certs = [
  { title: "USDA Organic", color: "#2d7a4f" },
  { title: "Kosher Certified", color: "#1a1a1a" },
  { title: "Halal Certified", color: "#1a7a3f" },
  { title: "WHO GMP", color: "#1a4a7a" },
  { title: "HACCP Certified", color: "#b8962e" },
  { title: "Spices Board India", color: "#2a4a8a" },
  { title: "GMP Quality", color: "#2a5a9a" },
  { title: "ISO 9001:2008", color: "#1a4a8a" },
];

export default function QualityAssurance() {
  return (
    <div
      className="bg-[#f8f5f2] text-[#1a0f0a]"
      style={{ fontFamily: "'Outfit',sans-serif" }}
    >
      {/* HERO */}
      <section className="relative min-h-[600px] flex items-center overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="/images/Quality.jpg"
            alt="Quality lab"
            className="w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#2a1a10]/90 via-[#3e2b1e]/80 to-[#3e2b1e]/60" />
        </div>
        <div className="relative z-10 max-w-6xl mx-auto px-6 py-24 w-full">
          <FadeIn>
            <div className="inline-flex items-center gap-2 bg-[#c4a882]/20 border border-[#c4a882]/40 text-[#c4a882] rounded-full px-5 py-2 text-xs font-semibold tracking-widest uppercase mb-6">
              ✦ Quality Assurance & Standards
            </div>
            <h1
              style={{ fontFamily: "'Playfair Display',serif" }}
              className="text-5xl lg:text-6xl font-semibold text-white leading-tight mb-6 max-w-2xl"
            >
              Quality Assurance &<br />
              <span className="text-[#c4a882]">Product Excellence</span>
            </h1>
            <p className="text-white/75 text-lg max-w-xl leading-relaxed mb-10">
              Ensuring purity, authenticity, and consistency through rigorous
              testing and international quality standards from source to
              shipment.
            </p>
            <a
              href="mailto:info@naturesnaturalindia.com?subject=Product Documentation Request"
              className="inline-flex items-center gap-3 bg-gradient-to-r from-[#c4a882] to-[#a8896c] text-[#1a0f0a] font-bold rounded-full px-8 py-4 text-sm hover:shadow-2xl hover:-translate-y-0.5 transition-all duration-200"
            >
              Request Product Documentation →
            </a>
          </FadeIn>
        </div>
      </section>

      {/* COMMITMENT */}
      <section className="py-24">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <FadeIn>
              <div className="relative rounded-3xl overflow-hidden shadow-2xl">
                <img
                  src="/images/quality assurance.jpg"
                  alt="Quality assurance laboratory"
                  className="w-full h-[520px] object-cover object-center"
                />
                <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-[#1a0f0a]/80 to-transparent">
                  <div className="bg-white/90 backdrop-blur-sm rounded-2xl px-5 py-4 inline-block border border-[#c4a882]/30">
                    <div
                      style={{ fontFamily: "'Playfair Display',serif" }}
                      className="text-[#3e2b1e] font-semibold text-lg"
                    >
                      ISO Certified Lab
                    </div>
                    <div className="text-[#7a5544] text-xs mt-1">
                      In-house & Third-party Testing
                    </div>
                  </div>
                </div>
              </div>
            </FadeIn>
            <FadeIn delay={120}>
              <div>
                <div className="flex items-center gap-3 text-[#7a5544] text-xs font-bold tracking-widest uppercase mb-4">
                  <span className="w-7 h-px bg-[#c4a882]" />
                  OUR COMMITMENT
                </div>
                <h2
                  style={{ fontFamily: "'Playfair Display',serif" }}
                  className="text-4xl font-semibold text-[#3e2b1e] leading-tight mb-5"
                >
                  Built on a Foundation of
                  <br />
                  <span className="text-[#7a5544]">Uncompromising Quality</span>
                </h2>
                <p className="text-[#6b5a4e] leading-relaxed mb-8">
                  At Nature's Natural India, quality is not a checkpoint — it is
                  woven into every decision, from the farms we source from to
                  the seal on your shipment.
                </p>
                <ul className="space-y-3 mb-8">
                  {[
                    "Premium quality raw materials sourced directly from cultivators",
                    "Strict botanical and geographical sourcing standards",
                    "Advanced steam distillation and cold-press processing",
                    "Continuous in-process quality monitoring at every stage",
                    "Customer-focused commitment — specifications met, not averaged",
                  ].map((pt, i) => (
                    <li
                      key={i}
                      className="flex items-start gap-3 bg-white border border-[#ede8e3] rounded-2xl px-5 py-4 text-[#3e2b1e] text-sm font-medium hover:border-[#c4a882] hover:shadow-md transition-all duration-200"
                    >
                      <span className="text-[#7a5544] mt-0.5 flex-shrink-0">
                        ✓
                      </span>
                      {pt}
                    </li>
                  ))}
                </ul>
                <div className="bg-gradient-to-r from-[#f8f0e6] to-[#faf8f5] border-l-4 border-[#c4a882] rounded-2xl px-7 py-5">
                  <p
                    style={{ fontFamily: "'Playfair Display',serif" }}
                    className="italic text-[#5c4033] text-lg leading-relaxed"
                  >
                    "Quality is not just a process — it is the foundation of
                    everything we produce."
                  </p>
                  <span className="text-[#a8896c] text-xs font-bold tracking-widest uppercase mt-3 block">
                    — Nature's Natural India QA Charter
                  </span>
                </div>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      <div className="h-px bg-gradient-to-r from-transparent via-[#c4a882]/40 to-transparent" />

      {/* PROCESS */}
      <section className="py-24 bg-gradient-to-b from-[#f0e8de] to-[#f8f5f2]">
        <div className="max-w-6xl mx-auto px-6">
          <FadeIn>
            <div className="text-center max-w-xl mx-auto mb-16">
              <div className="flex items-center justify-center gap-3 text-[#7a5544] text-xs font-bold tracking-widest uppercase mb-4">
                <span className="w-7 h-px bg-[#c4a882]" />
                STEP-BY-STEP
                <span className="w-7 h-px bg-[#c4a882]" />
              </div>
              <h2
                style={{ fontFamily: "'Playfair Display',serif" }}
                className="text-4xl font-semibold text-[#3e2b1e] mb-4"
              >
                Quality Control Process
              </h2>
              <p className="text-[#6b5a4e] leading-relaxed">
                Five disciplined stages ensure every product leaving our
                facility meets the highest global standards.
              </p>
            </div>
          </FadeIn>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5">
            {processSteps.map((step, i) => (
              <FadeIn key={i} delay={i * 80}>
                <div className="bg-white border border-[#ede8e3] rounded-3xl p-7 hover:-translate-y-2 hover:shadow-xl hover:border-[#c4a882] transition-all duration-300 group h-full">
                  <div className="text-[#c4a882] text-xs font-bold tracking-widest uppercase mb-4">
                    Step 0{i + 1}
                  </div>
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#f0e4d4] to-[#ede0cc] flex items-center justify-center text-2xl mb-5 group-hover:bg-gradient-to-br group-hover:from-[#7a5544] group-hover:to-[#5c4033] transition-all duration-300">
                    {step.icon}
                  </div>
                  <h3 className="font-bold text-[#3e2b1e] text-sm mb-3 leading-snug">
                    {step.title}
                  </h3>
                  <p className="text-[#6b5a4e] text-xs leading-relaxed">
                    {step.desc}
                  </p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* TESTING */}
      <section className="py-24">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
            <FadeIn>
              <div>
                <div className="flex items-center gap-3 text-[#7a5544] text-xs font-bold tracking-widest uppercase mb-4">
                  <span className="w-7 h-px bg-[#c4a882]" />
                  LABORATORY
                </div>
                <h2
                  style={{ fontFamily: "'Playfair Display',serif" }}
                  className="text-4xl font-semibold text-[#3e2b1e] leading-tight mb-5"
                >
                  Advanced Testing &<br />
                  Analysis Methods
                </h2>
                <p className="text-[#6b5a4e] leading-relaxed mb-8">
                  Our analytical toolkit matches international pharma and
                  food-grade standards, giving our buyers confidence in every
                  batch.
                </p>
                <div className="rounded-3xl overflow-hidden shadow-xl">
                  <img
                    src={img_mgms}
                    alt="GC-MS Report"
                    className="w-full h-64 object-cover object-center"
                  />
                  <div className="bg-[#3e2b1e] px-6 py-4">
                    <div className="text-[#c4a882] font-bold text-sm">
                      GC-MS Analysis Report
                    </div>
                    <div className="text-white/70 text-xs mt-1">
                      97.42% identified compounds · Conforms to Standard
                    </div>
                  </div>
                </div>
              </div>
            </FadeIn>
            <FadeIn delay={120}>
              <div className="grid grid-cols-1 gap-4">
                {testingMethods.map((t, i) => (
                  <div
                    key={i}
                    className="bg-white border border-[#ede8e3] rounded-2xl p-5 flex gap-4 items-start hover:border-[#c4a882] hover:shadow-lg transition-all duration-200"
                  >
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#ede4d8] to-[#e6ddd0] flex items-center justify-center text-[#7a5544] font-bold text-xs flex-shrink-0">
                      {String(i + 1).padStart(2, "0")}
                    </div>
                    <div>
                      <h3 className="font-bold text-[#3e2b1e] text-sm mb-1">
                        {t.title}
                      </h3>
                      <p className="text-[#6b5a4e] text-xs leading-relaxed">
                        {t.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* DOCUMENTS */}
      <section className="py-24 bg-gradient-to-b from-[#f0e8de] to-[#f8f5f2]">
        <div className="max-w-6xl mx-auto px-6">
          <FadeIn>
            <div className="text-center max-w-xl mx-auto mb-16">
              <div className="flex items-center justify-center gap-3 text-[#7a5544] text-xs font-bold tracking-widest uppercase mb-4">
                <span className="w-7 h-px bg-[#c4a882]" />
                DOCUMENTATION
                <span className="w-7 h-px bg-[#c4a882]" />
              </div>
              <h2
                style={{ fontFamily: "'Playfair Display',serif" }}
                className="text-4xl font-semibold text-[#3e2b1e] mb-4"
              >
                Technical Documentation
                <br />
                Available on Request
              </h2>
              <p className="text-[#6b5a4e] leading-relaxed">
                Full transparency every document your procurement or R&D team
                needs, available for each batch.
              </p>
            </div>
          </FadeIn>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {docs.map((doc, i) => (
              <FadeIn key={i} delay={i * 70}>
                <div className="bg-white border border-[#ede8e3] rounded-2xl overflow-hidden hover:border-[#c4a882] hover:shadow-xl hover:-translate-y-1 transition-all duration-300 h-full flex flex-col">
                  {doc.img && (
                    <div className="h-40 overflow-hidden">
                      <img
                        src={doc.img}
                        alt={doc.title}
                        className="w-full h-full object-cover object-center"
                      />
                    </div>
                  )}
                  {!doc.img && (
                    <div className="h-40 bg-gradient-to-br from-[#f0e4d4] to-[#ede0cc] flex items-center justify-center">
                      <span className="text-[#c4a882] font-bold text-3xl">
                        {doc.abbr}
                      </span>
                    </div>
                  )}
                  <div className="p-5 flex-1 flex flex-col">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-bold text-[#3e2b1e] text-sm">
                        {doc.title}
                      </h3>
                      <span className="text-xs font-bold text-[#c4a882] bg-[#c4a882]/10 rounded-lg px-2 py-1">
                        {doc.abbr}
                      </span>
                    </div>
                    <p className="text-[#6b5a4e] text-xs leading-relaxed flex-1">
                      {doc.desc}
                    </p>
                    <div className="mt-3 text-xs font-semibold text-[#7a5544] flex items-center gap-1">
                      → Available on request
                    </div>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* STATS */}
      <section className="py-24">
        <div className="max-w-6xl mx-auto px-6">
          <FadeIn>
            <div className="text-center max-w-xl mx-auto mb-16">
              <div className="flex items-center justify-center gap-3 text-[#7a5544] text-xs font-bold tracking-widest uppercase mb-4">
                <span className="w-7 h-px bg-[#c4a882]" />
                TRUST & TRACK RECORD
                <span className="w-7 h-px bg-[#c4a882]" />
              </div>
              <h2
                style={{ fontFamily: "'Playfair Display',serif" }}
                className="text-4xl font-semibold text-[#3e2b1e]"
              >
                Why Clients Trust Our Quality
              </h2>
            </div>
          </FadeIn>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
            <StatCard
              value={100}
              suffix="%"
              label="Quality Tested Products"
              desc="No product ships without passing every mandatory quality checkpoint."
              icon="🛡️"
              delay={0}
            />
            <StatCard
              value={40}
              suffix="+"
              label="Export Destinations"
              desc="Consistent quality trusted by buyers across five continents."
              icon="🌍"
              delay={100}
            />
            <StatCard
              value={500}
              suffix="+"
              label="Batch Quality Records"
              desc="Full traceability and documentation maintained for every batch."
              icon="📊"
              delay={200}
            />
            <StatCard
              value={98}
              suffix="%"
              label="Customer Satisfaction"
              desc="Repeat buyers and long-term partnerships built on reliable quality."
              icon="⭐"
              delay={300}
            />
          </div>
        </div>
      </section>

      {/* CERTIFICATIONS */}
      <section className="py-24 bg-gradient-to-b from-[#f0e8de] to-[#f8f5f2]">
        <div className="max-w-6xl mx-auto px-6">
          <FadeIn>
            <div className="text-center max-w-xl mx-auto mb-16">
              <div className="flex items-center justify-center gap-3 text-[#7a5544] text-xs font-bold tracking-widest uppercase mb-4">
                <span className="w-7 h-px bg-[#c4a882]" />
                COMPLIANCE
                <span className="w-7 h-px bg-[#c4a882]" />
              </div>
              <h2
                style={{ fontFamily: "'Playfair Display',serif" }}
                className="text-4xl font-semibold text-[#3e2b1e] mb-4"
              >
                Certifications &<br />
                Global Compliance
              </h2>
              <p className="text-[#6b5a4e] leading-relaxed">
                Our operations and products comply with the world's most
                recognised quality, safety, and ethical standards.
              </p>
            </div>
          </FadeIn>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            <FadeIn>
              <div className="rounded-3xl overflow-hidden shadow-xl">
                <img
                  src={img_cert}
                  alt="Certifications"
                  className="w-full h-auto object-cover"
                />
              </div>
            </FadeIn>
            <FadeIn delay={100}>
              <div className="grid grid-cols-2 gap-4">
                {certs.map((c, i) => (
                  <div
                    key={i}
                    className="bg-white border border-[#ede8e3] rounded-2xl px-5 py-4 hover:border-[#c4a882] hover:shadow-lg hover:-translate-y-1 transition-all duration-200 relative overflow-hidden"
                  >
                    <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-[#c4a882] to-[#a8896c] opacity-0 hover:opacity-100 transition-opacity duration-200" />
                    <div className="font-bold text-[#3e2b1e] text-sm">
                      {c.title}
                    </div>
                    <div className="text-[#7a5544] text-xs mt-1">Certified</div>
                  </div>
                ))}
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* PROMISE */}
      <section className="relative py-32 overflow-hidden text-center">
        <div className="absolute inset-0">
          <img
            src={img_coa}
            alt="COA background"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-[#2a1a10]/92 via-[#3e2b1e]/88 to-[#5c4033]/85" />
        </div>
        <div className="relative z-10 max-w-2xl mx-auto px-6">
          <FadeIn>
            <div className="inline-flex items-center gap-2 bg-[#c4a882]/20 border border-[#c4a882]/40 text-[#c4a882] rounded-full px-5 py-2 text-xs font-semibold tracking-widest uppercase mb-8">
              ✦ Our Promise
            </div>
            <h2
              style={{ fontFamily: "'Playfair Display',serif" }}
              className="text-4xl lg:text-5xl font-semibold text-white mb-6 leading-tight"
            >
              Our Promise of Purity
              <br />
              and <span className="text-[#c4a882]">Excellence</span>
            </h2>
            <p className="text-white/75 text-lg leading-relaxed mb-10">
              Every product undergoes rigorous quality checks before reaching
              our customers. From sourcing to packaging, we maintain
              uncompromising standards — for every order, every time.
            </p>
            <a
              href="mailto:info@naturesnaturalindia.com?subject=Quality Team Enquiry"
              className="inline-flex items-center gap-3 bg-gradient-to-r from-[#c4a882] to-[#a8896c] text-[#1a0f0a] font-bold rounded-full px-9 py-4 text-sm hover:shadow-2xl hover:-translate-y-0.5 transition-all duration-200"
            >
              Contact Our Quality Team →
            </a>
          </FadeIn>
        </div>
      </section>
    </div>
  );
}

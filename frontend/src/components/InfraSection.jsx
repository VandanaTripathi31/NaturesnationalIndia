import { useState } from "react";

const cardPhotos = [
  {
    src: "/images/infra1.jpeg",
    label: "GC-MS Analyser",
    sub: "Analytical Equipment",
    num: "01",
  },
  {
    src: "/images/infra5.jpeg",
    label: "Distillation Unit",
    sub: "Steam Extraction",
    num: "02",
  },
  {
    src: "/images/infra3.jpeg",
    label: "Packaging Line",
    sub: "Final Dispatch",
    num: "03",
  },
  {
    src: "/images/infra6.jpeg",
    label: "CO₂ Extractor",
    sub: "Supercritical System",
    num: "04",
  },
];

const bannerPhoto = {
  src: "/images/infra7.jpeg",
  label: "Steam Distillation Plant",
};

const allPhotos = [
  bannerPhoto,
  ...cardPhotos,
  { src: "/images/infra2.jpeg", label: "GC-2014 Chromatograph" },
  { src: "/images/infra4.jpeg", label: "Warehouse & Storage" },
  { src: "/images/infra8.jpeg", label: "Auto Filling Machine" },
];

const metrics = [
  { val: "5000+", lbl: "MT / Year" },
  { val: "300+", lbl: "Products" },
  { val: "70+", lbl: "Countries" },
  { val: "20+", lbl: "Machines" },
  { val: "GMP", lbl: "Certified" },
];

const features = [
  {
    icon: "⬡",
    title: "Steam Distillation",
    desc: "Stainless steel vessels with precise temperature control and minimal botanical degradation.",
  },
  {
    icon: "◈",
    title: "CO₂ Supercritical",
    desc: "Solvent-free extraction preserving full botanical profiles at controlled pressure.",
  },
  {
    icon: "⊞",
    title: "Automated Filling",
    desc: "High-speed lines from 5ml retail bottles to 200L export drums.",
  },
];

/* ── Lightbox ─────────────────────────────────────────── */
function Lightbox({ photos, idx, onClose, onPrev, onNext }) {
  if (idx === null) return null;
  return (
    <div
      className="fixed inset-0 z-[4000] flex items-center justify-center p-5 cursor-zoom-out"
      style={{ background: "rgba(4,2,1,0.96)", animation: "lbFadeIn .2s ease" }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        className="relative w-full max-w-3xl cursor-default"
        style={{ animation: "lbSlideUp .28s cubic-bezier(.4,0,.2,1)" }}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute -top-10 right-0 text-white/40 hover:text-white text-3xl leading-none bg-transparent border-none cursor-pointer"
        >
          ×
        </button>
        <button
          onClick={onPrev}
          className="absolute top-1/2 -translate-y-1/2 -left-12 sm:-left-14 w-10 h-10 rounded-full flex items-center justify-center text-xl cursor-pointer transition-colors"
          style={{
            background: "rgba(31,18,10,.55)",
            border: "1px solid rgba(196,168,130,.25)",
            color: "#c4a882",
          }}
        >
          ‹
        </button>
        <button
          onClick={onNext}
          className="absolute top-1/2 -translate-y-1/2 -right-12 sm:-right-14 w-10 h-10 rounded-full flex items-center justify-center text-xl cursor-pointer transition-colors"
          style={{
            background: "rgba(31,18,10,.55)",
            border: "1px solid rgba(196,168,130,.25)",
            color: "#c4a882",
          }}
        >
          ›
        </button>
        <img
          src={photos[idx].src}
          alt={photos[idx].label}
          className="w-full max-h-[78vh] object-contain rounded-sm block"
        />
        <div className="flex justify-between pt-3 px-0.5">
          <span
            className="text-[11px] tracking-widest uppercase"
            style={{ color: "rgba(196,168,130,.7)" }}
          >
            {photos[idx].label}
          </span>
          <span
            className="text-[11px] tracking-widest uppercase"
            style={{ color: "rgba(196,168,130,.5)" }}
          >
            {idx + 1} / {photos.length}
          </span>
        </div>
      </div>

      <style>{`
        @keyframes lbFadeIn  { from{opacity:0} to{opacity:1} }
        @keyframes lbSlideUp { from{transform:translateY(18px);opacity:0} to{transform:none;opacity:1} }
      `}</style>
    </div>
  );
}

/* ── Main ─────────────────────────────────────────────── */
export default function OurInfrastructure() {
  const [lbIdx, setLbIdx] = useState(null);
  const open = (i) => setLbIdx(i);
  const close = () => setLbIdx(null);
  const prev = () =>
    setLbIdx((i) => (i - 1 + allPhotos.length) % allPhotos.length);
  const next = () => setLbIdx((i) => (i + 1) % allPhotos.length);

  return (
    <section
      className="relative overflow-hidden"
      style={{ background: "var(--color-brown-deep, #3e2b1e)" }}
    >
      {/* ── BANNER ──────────────────────────────────────── */}
      <div
        className="relative cursor-pointer overflow-hidden"
        style={{ height: "clamp(190px, 24vw, 300px)" }}
        onClick={() => open(0)}
      >
        <img
          src={bannerPhoto.src}
          alt="Production facility"
          className="w-full h-full object-cover"
          style={{ objectPosition: "center 35%", filter: "brightness(0.42)" }}
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to bottom, transparent 15%, rgba(31,18,10,.4) 60%, #3e2b1e 100%)",
          }}
        />

        {/* Banner text */}
        <div
          className="absolute inset-0 flex flex-col justify-end"
          style={{
            padding:
              "clamp(14px,2.5vw,32px) clamp(20px,5vw,60px) clamp(18px,2.8vw,32px)",
          }}
        >
          {/* Eyebrow — much larger & bolder */}
          <div className="flex items-center gap-3 mb-2">
            <span
              className="font-bold uppercase rounded-full px-4 py-[6px]"
              style={{
                fontSize: "clamp(11px, 1.1vw, 14px)",
                letterSpacing: ".2em",
                color: "#e8c98a",
                border: "1.5px solid rgba(232,201,138,.55)",
                fontFamily: "'DM Sans',system-ui,sans-serif",
                background: "rgba(196,168,130,.1)",
              }}
            >
              Manufacturing &amp; Infrastructure
            </span>
            <span
              className="h-px flex-1"
              style={{
                maxWidth: 32,
                background: "linear-gradient(90deg,#c4a882,transparent)",
              }}
            />
          </div>

          <h2
            className="m-0 mb-1.5 leading-[1.05]"
            style={{
              fontFamily: "'Cormorant Garamond',Georgia,serif",
              fontSize: "clamp(24px, 3.8vw, 46px)",
              fontWeight: 600,
              color: "#f8f5f2",
              letterSpacing: "-0.01em",
              textShadow: "0 2px 20px rgba(0,0,0,0.55)",
            }}
          >
            Built for{" "}
            <em
              style={{ fontStyle: "italic", fontWeight: 300, color: "#c4a882" }}
            >
              Scale &amp; Precision
            </em>
          </h2>

          <p
            className="m-0 font-light"
            style={{
              fontFamily: "'DM Sans',system-ui,sans-serif",
              fontSize: "clamp(11px,1vw,12.5px)",
              color: "rgba(255,255,255,.55)",
              maxWidth: 380,
              lineHeight: 1.6,
            }}
          >
            Vertically integrated — from raw botanical processing through
            extraction, testing, filling, and export-ready packaging.
          </p>
        </div>
      </div>

      {/* ── BODY ────────────────────────────────────────── */}
      <div className="max-w-[1160px] mx-auto px-4 sm:px-6 pb-0">
        {/* ── 4-CARD GRID — landscape ratio, brighter ────── */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-[3px] relative z-10">
          {cardPhotos.map((p, i) => (
            <div
              key={p.src}
              className="relative overflow-hidden cursor-pointer group"
              style={{ aspectRatio: "4/3", background: "#1a0f0a" }}
              onClick={() => open(i + 1)}
            >
              {/* brightness .75 — clearly visible */}
              <img
                src={p.src}
                alt={p.label}
                loading="lazy"
                className="w-full h-full object-cover block transition-transform duration-700 ease-out group-hover:scale-[1.07]"
                style={{ filter: "brightness(.75) saturate(.92)" }}
              />

              {/* lighter gradient — only darkens bottom third */}
              <div
                className="absolute inset-0"
                style={{
                  background:
                    "linear-gradient(to top, rgba(8,4,2,.85) 0%, rgba(8,4,2,.15) 35%, transparent 55%)",
                }}
              />

              {/* top gold accent line on hover */}
              <div
                className="absolute top-0 left-0 right-0 h-[2.5px] origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500"
                style={{ background: "linear-gradient(90deg,#e8c98a,#a8896c)" }}
              />

              {/* num badge */}
              <span
                className="absolute top-2.5 left-3 text-[11px] font-semibold tracking-widest"
                style={{
                  fontFamily: "'Cormorant Garamond',Georgia,serif",
                  color: "rgba(232,201,138,.85)",
                }}
              >
                {p.num}
              </span>

              {/* label */}
              <div className="absolute bottom-0 left-0 right-0 px-3.5 pb-3 group-hover:-translate-y-1 transition-transform duration-400">
                <span
                  className="block font-semibold mb-0.5"
                  style={{
                    fontFamily: "'DM Sans',system-ui,sans-serif",
                    fontSize: "clamp(12px,1.05vw,14px)",
                    color: "#fff",
                    letterSpacing: ".03em",
                  }}
                >
                  {p.label}
                </span>
                <span
                  className="block font-normal tracking-[.14em] uppercase"
                  style={{ fontSize: 9.5, color: "#e8c98a" }}
                >
                  {p.sub}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* ── METRICS ─────────────────────────────────────── */}
        <div
          className="grid grid-cols-3 sm:grid-cols-5"
          style={{ borderTop: "1px solid rgba(196,168,130,.2)" }}
        >
          {metrics.map((m, i) => (
            <div
              key={m.lbl}
              className="relative px-4 py-4"
              style={{
                borderRight:
                  i < metrics.length - 1
                    ? "1px solid rgba(196,168,130,.12)"
                    : "none",
              }}
            >
              <span
                className="block leading-none mb-1"
                style={{
                  fontFamily: "'Cormorant Garamond',Georgia,serif",
                  fontSize: "clamp(18px,2vw,26px)",
                  fontWeight: 600,
                  color: "#f8f5f2",
                }}
              >
                {m.val}
              </span>
              <span
                className="block text-[9.5px] tracking-[.12em] uppercase"
                style={{
                  color: "rgba(196,168,130,.65)",
                  fontFamily: "'DM Sans',system-ui,sans-serif",
                }}
              >
                {m.lbl}
              </span>
              <div
                className="absolute bottom-0 left-4 h-[2px] w-6 rounded"
                style={{ background: "#c4a882" }}
              />
            </div>
          ))}
        </div>

        {/* ── FEATURES ────────────────────────────────────── */}
        <div
          className="grid grid-cols-1 sm:grid-cols-3"
          style={{ borderTop: "1px solid rgba(196,168,130,.12)" }}
        >
          {features.map((f, i) => (
            <div
              key={f.title}
              className="px-5 py-5"
              style={{
                borderRight:
                  i < features.length - 1
                    ? "1px solid rgba(196,168,130,.12)"
                    : "none",
              }}
            >
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center mb-3 text-sm font-bold"
                style={{
                  border: "1px solid rgba(196,168,130,.35)",
                  color: "#c4a882",
                }}
              >
                {f.icon}
              </div>
              <h4
                className="text-[12.5px] font-semibold tracking-[.03em]"
                style={{
                  fontFamily: "'DM Sans',system-ui,sans-serif",
                  color: "#f8f5f2",
                  margin: "0 0 5px",
                }}
              >
                {f.title}
              </h4>
              <p
                className="text-[11.5px] font-light leading-[1.68] m-0"
                style={{
                  fontFamily: "'DM Sans',system-ui,sans-serif",
                  color: "rgba(255,255,255,.4)",
                }}
              >
                {f.desc}
              </p>
            </div>
          ))}
        </div>
      </div>

      <Lightbox
        photos={allPhotos}
        idx={lbIdx}
        onClose={close}
        onPrev={prev}
        onNext={next}
      />
    </section>
  );
}

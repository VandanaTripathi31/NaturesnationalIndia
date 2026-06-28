import { useState } from "react";

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,600;1,400;1,600&family=DM+Sans:wght@300;400;500;600&display=swap');

.lab2-section {
  background: var(--color-off-white, #faf8f5);
  padding: 88px 0 0;
  overflow: hidden;
}

.lab2-header {
  padding: 0 60px 64px;
  display: grid;
  grid-template-columns: 1fr 1fr;
  align-items: end;
  gap: 40px;
  max-width: 1200px;
  margin: 0 auto;
}
@media (max-width: 860px) {
  .lab2-header { grid-template-columns: 1fr; padding: 0 28px 44px; gap: 16px; }
}
.lab2-eyebrow {
  display: flex; align-items: center; gap: 10px; margin-bottom: 16px;
}
.lab2-eyebrow-line { flex:1; max-width:32px; height:1px; background:var(--color-brown-muted,#a8896c); }
.lab2-eyebrow span {
  font-family:'DM Sans',sans-serif; font-size:10px; font-weight:600;
  letter-spacing:0.22em; text-transform:uppercase; color:var(--color-brown-muted,#a8896c);
}
.lab2-h1 {
  font-family:'Cormorant Garamond',Georgia,serif;
  font-size:clamp(30px,4vw,48px); font-weight:600;
  color:var(--color-text-primary,#1a0f0a); line-height:1.1; margin:0; letter-spacing:-0.01em;
}
.lab2-h1 em { font-style:italic; font-weight:300; color:var(--color-brown-mid,#7a5544); }
.lab2-header-right p {
  font-family:'DM Sans',sans-serif; font-size:14px; line-height:1.85;
  color:var(--color-text-muted,#6b5a4e); margin:0 0 28px; max-width:380px;
}
.lab2-stat-row { display:flex; gap:36px; }
.lab2-stat-val {
  font-family:'Cormorant Garamond',Georgia,serif; font-size:36px; font-weight:600;
  color:var(--color-brown-deep,#3e2b1e); line-height:1; display:block;
}
.lab2-stat-lbl {
  font-family:'DM Sans',sans-serif; font-size:10px; font-weight:600;
  letter-spacing:0.14em; text-transform:uppercase; color:var(--color-text-muted,#6b5a4e);
  display:block; margin-top:3px;
}

.lab2-body {
  display: grid;
  grid-template-columns: 1.15fr 0.85fr;
  grid-template-rows: auto auto;
  gap: 0;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 60px;
}
@media (max-width: 960px) {
  .lab2-body { grid-template-columns:1fr; padding:0 28px; }
}

.lab2-hero-wrap {
  grid-column:1; grid-row:1/3;
  position:relative; overflow:hidden; border-radius:2px;
  padding-right:10px; cursor:pointer;
}
@media (max-width:960px) { .lab2-hero-wrap { grid-row:auto; height:340px; padding-right:0; } }
.lab2-hero-img {
  width:100%; height:100%; min-height:560px;
  object-fit:cover; object-position:center; display:block;
  transition:transform 0.8s cubic-bezier(0.25,0.46,0.45,0.94);
}
.lab2-hero-wrap:hover .lab2-hero-img { transform:scale(1.04); }
.lab2-hero-badge {
  position:absolute; bottom:20px; left:20px;
  background:rgba(31,18,10,0.72); backdrop-filter:blur(6px);
  color:var(--color-brown-light,#c4a882);
  font-family:'DM Sans',sans-serif; font-size:10px; font-weight:600;
  letter-spacing:0.18em; text-transform:uppercase;
  padding:7px 14px; border-radius:20px;
  border:1px solid rgba(196,168,130,0.3);
}
@media (max-width:960px) { .lab2-hero-img { min-height:unset; } }

.lab2-pair {
  grid-column:2; grid-row:1;
  display:grid; grid-template-columns:1fr 1fr; gap:10px;
  padding-left:10px; height:280px;
}
@media (max-width:960px) { .lab2-pair { grid-column:1; grid-row:auto; padding-left:0; height:220px; } }
.lab2-pair-wrap { overflow:hidden; border-radius:2px; cursor:pointer; position:relative; }
.lab2-pair-img {
  width:100%; height:100%; object-fit:cover; display:block;
  transition:transform 0.7s ease;
}
.lab2-pair-wrap:hover .lab2-pair-img { transform:scale(1.07); }
.lab2-pair-cap {
  position:absolute; bottom:0; left:0; right:0;
  background:linear-gradient(to top,rgba(31,18,10,0.75),transparent);
  padding:20px 12px 10px; opacity:0; transition:opacity 0.3s ease;
}
.lab2-pair-wrap:hover .lab2-pair-cap { opacity:1; }
.lab2-pair-cap span {
  font-family:'DM Sans',sans-serif; font-size:10px; font-weight:600;
  letter-spacing:0.14em; text-transform:uppercase; color:rgba(255,255,255,0.88);
}

.lab2-callout {
  grid-column:2; grid-row:2;
  padding:28px 0 0 20px;
  display:flex; flex-direction:column;
}
@media (max-width:960px) { .lab2-callout { grid-column:1; grid-row:auto; padding:28px 0 0; } }
.lab2-callout-quote {
  font-family:'Cormorant Garamond',Georgia,serif;
  font-size:clamp(17px,2vw,22px); font-style:italic; font-weight:400;
  color:var(--color-brown-deep,#3e2b1e); line-height:1.55;
  margin:0 0 20px; padding-left:16px;
  border-left:2px solid var(--color-brown-light,#c4a882);
}
.lab2-items { display:flex; flex-direction:column; gap:9px; margin-bottom:24px; }
.lab2-item {
  display:flex; align-items:center; gap:10px;
  font-family:'DM Sans',sans-serif; font-size:12px;
  color:var(--color-text-muted,#6b5a4e); letter-spacing:0.03em;
}
.lab2-dot { width:4px; height:4px; border-radius:50%; background:var(--color-brown-muted,#a8896c); flex-shrink:0; }
.lab2-btn {
  display:inline-flex; align-items:center; gap:8px;
  border:1.5px solid var(--color-brown-deep,#3e2b1e);
  color:var(--color-brown-deep,#3e2b1e); background:transparent;
  padding:10px 24px;
  font-family:'DM Sans',sans-serif; font-size:11px; font-weight:600;
  letter-spacing:0.12em; text-transform:uppercase;
  cursor:pointer; border-radius:1px;
  transition:all 0.25s ease; align-self:flex-start;
}
.lab2-btn:hover { background:var(--color-brown-deep,#3e2b1e); color:var(--color-cream-white,#f8f5f2); }

.lab2-strip {
  display:grid; grid-template-columns:repeat(4,1fr);
  max-width:1200px; margin:48px auto 0; padding:0 60px;
}
@media (max-width:860px) { .lab2-strip { grid-template-columns:repeat(2,1fr); padding:0 28px; } }
.lab2-strip-item {
  display:flex; align-items:center; gap:12px;
  padding:22px 20px;
  border-top:1px solid var(--color-warm-gray,#d6d0ca);
  border-right:1px solid var(--color-warm-gray,#d6d0ca);
}
.lab2-strip-item:last-child { border-right:none; }
@media (max-width:860px) {
  .lab2-strip-item:nth-child(2) { border-right:none; }
  .lab2-strip-item:nth-child(3) { border-top:1px solid var(--color-warm-gray,#d6d0ca); }
}
.lab2-snum {
  font-family:'Cormorant Garamond',Georgia,serif; font-size:30px; font-weight:600;
  color:var(--color-brown-deep,#3e2b1e); line-height:1; flex-shrink:0;
}
.lab2-sinfo strong {
  display:block; font-family:'DM Sans',sans-serif; font-size:12px; font-weight:600;
  color:var(--color-text-primary,#1a0f0a); margin-bottom:2px;
}
.lab2-sinfo span {
  font-family:'DM Sans',sans-serif; font-size:11px; color:var(--color-text-muted,#6b5a4e);
}

.lab2-foot {
  margin-top:56px; height:4px;
  background:linear-gradient(90deg,
    var(--color-brown-deep,#3e2b1e),
    var(--color-brown-mid,#7a5544),
    var(--color-brown-light,#c4a882),
    var(--color-brown-muted,#a8896c)
  );
}

.lab2-lb {
  position:fixed; inset:0; background:rgba(8,4,2,0.92);
  z-index:3000; display:flex; align-items:center; justify-content:center;
  padding:20px; animation:lb2In 0.2s ease; cursor:zoom-out;
}
@keyframes lb2In { from{opacity:0} to{opacity:1} }
.lab2-lb-inner {
  position:relative; max-width:900px; width:100%;
  cursor:default; animation:lb2Up 0.3s cubic-bezier(0.4,0,0.2,1);
}
@keyframes lb2Up { from{transform:translateY(20px);opacity:0} to{transform:none;opacity:1} }
.lab2-lb-inner img { width:100%; max-height:80vh; object-fit:contain; border-radius:2px; display:block; }
.lab2-lb-close {
  position:absolute; top:-40px; right:0;
  background:none; border:none; color:rgba(255,255,255,0.5); font-size:26px; cursor:pointer;
}
.lab2-lb-close:hover { color:#fff; }
.lab2-lb-cap { padding:12px 2px 0; display:flex; justify-content:space-between; }
.lab2-lb-cap span {
  font-family:'DM Sans',sans-serif; font-size:11px; letter-spacing:0.12em;
  text-transform:uppercase; color:rgba(196,168,130,0.75);
}
.lab2-lb-nav {
  position:absolute; top:45%; transform:translateY(-50%);
  background:rgba(31,18,10,0.6); border:1px solid rgba(196,168,130,0.25);
  color:var(--color-brown-light,#c4a882);
  width:40px; height:40px; border-radius:50%;
  display:flex; align-items:center; justify-content:center;
  cursor:pointer; font-size:18px; transition:background 0.2s;
}
.lab2-lb-nav:hover { background:rgba(92,64,51,0.8); }
.lab2-lb-prev { left:-52px; } .lab2-lb-next { right:-52px; }
@media (max-width:700px) { .lab2-lb-prev{left:0} .lab2-lb-next{right:0} }
`;

const photos = [
  {
    src: "/images/Lab1.jpeg",
    label: "Chemical Titration",
    tag: "Analysis",
  },
  {
    src: "/images/Lab2.jpeg",
    label: "Sterilisation Unit",
    tag: "Equipment",
  },
  { src: "/images/Lab3.jpeg", label: "Oil Sample Testing", tag: "QC" },
  { src: "/images/Lab4.jpeg", label: "Emulsion Research", tag: "R&D" },
  { src: "/images/Lab5.jpeg", label: "Microscopy", tag: "Microscopy" },
  { src: "/images/Lab6.jpeg", label: "Purity Inspection", tag: "Purity" },
];

const capabilities = [
  "GC-MS Fatty Acid Profiling",
  "Microbial & Yeast / Mould Testing",
  "Refractive Index & Specific Gravity",
  "Peroxide Value & Acid Value",
  "Heavy Metals Screening",
];

const stripStats = [
  { num: "15+", title: "Years Active", sub: "In-house research" },
  { num: "6", title: "Lab Stations", sub: "Specialised units" },
  { num: "200+", title: "SKUs Tested", sub: "Per quarter" },
  { num: "100%", title: "Batch Verified", sub: "Before dispatch" },
];

function Lightbox({ photos, idx, onClose, onPrev, onNext }) {
  if (idx === null) return null;
  return (
    <div
      className="lab2-lb"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="lab2-lb-inner" onClick={(e) => e.stopPropagation()}>
        <button className="lab2-lb-close" onClick={onClose}>
          ×
        </button>
        <button className="lab2-lb-nav lab2-lb-prev" onClick={onPrev}>
          ‹
        </button>
        <button className="lab2-lb-nav lab2-lb-next" onClick={onNext}>
          ›
        </button>
        <img src={photos[idx].src} alt={photos[idx].label} />
        <div className="lab2-lb-cap">
          <span>{photos[idx].label}</span>
          <span>
            {idx + 1} / {photos.length}
          </span>
        </div>
      </div>
    </div>
  );
}

export default function OurLaboratory() {
  const [lbIdx, setLbIdx] = useState(null);
  return (
    <section className="lab2-section">
      <style>{CSS}</style>
      <div className="lab2-header">
        <div>
          <div className="lab2-eyebrow">
            <span className="lab2-eyebrow-line" />
            <span>Quality & Science</span>
            <span className="lab2-eyebrow-line" />
          </div>
          <h2 className="lab2-h1">
            Our <em>In-House</em>
            <br />
            Laboratory
          </h2>
        </div>
        <div className="lab2-header-right">
          <p>
            Every oil we produce passes through rigorous in-house testing — from
            raw botanical intake to final batch release — ensuring purity,
            potency, and full compliance with international standards.
          </p>
          <div className="lab2-stat-row">
            {[
              ["ISO", "17025 Aligned"],
              ["GMP", "Certified Facility"],
              ["3rd", "Party Audited"],
            ].map(([v, l]) => (
              <div key={l}>
                <span className="lab2-stat-val">{v}</span>
                <span className="lab2-stat-lbl">{l}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="lab2-body">
        <div className="lab2-hero-wrap" onClick={() => setLbIdx(0)}>
          <img
            className="lab2-hero-img"
            src={photos[0].src}
            alt={photos[0].label}
          />
          <span className="lab2-hero-badge">{photos[0].tag}</span>
        </div>
        <div className="lab2-pair">
          {[2, 4].map((i) => (
            <div key={i} className="lab2-pair-wrap" onClick={() => setLbIdx(i)}>
              <img
                className="lab2-pair-img"
                src={photos[i].src}
                alt={photos[i].label}
              />
              <div className="lab2-pair-cap">
                <span>{photos[i].label}</span>
              </div>
            </div>
          ))}
        </div>
        <div className="lab2-callout">
          <p className="lab2-callout-quote">
            "From botanical intake to finished batch — every parameter is
            tested, logged, and verified."
          </p>
          <div className="lab2-items">
            {capabilities.map((c) => (
              <div key={c} className="lab2-item">
                <span className="lab2-dot" />
                {c}
              </div>
            ))}
          </div>
          <button className="lab2-btn" onClick={() => setLbIdx(0)}>
            View Lab Gallery →
          </button>
        </div>
      </div>

      <div className="lab2-strip">
        {stripStats.map((s) => (
          <div key={s.title} className="lab2-strip-item">
            <span className="lab2-snum">{s.num}</span>
            <div className="lab2-sinfo">
              <strong>{s.title}</strong>
              <span>{s.sub}</span>
            </div>
          </div>
        ))}
      </div>
      <div className="lab2-foot" />
      <Lightbox
        photos={photos}
        idx={lbIdx}
        onClose={() => setLbIdx(null)}
        onPrev={() => setLbIdx((i) => (i - 1 + photos.length) % photos.length)}
        onNext={() => setLbIdx((i) => (i + 1) % photos.length)}
      />
    </section>
  );
}

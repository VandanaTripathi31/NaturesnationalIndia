import { useState, useMemo } from "react";

// ── PALETTE ─────────────────────────────────────────────────────────────────
// ink:#0F0D0B | bark:#2C1A0E | wood:#5C3A1E | caramel:#9C6B3C
// sand:#C9A87C | parch:#F5EFE6 | cream:#FBF7F2 | white:#FFFFFF
// accent-green:#3B7D4A | accent-teal:#1A6B6B
// ────────────────────────────────────────────────────────────────────────────

const ALL_PRODUCTS = [
  // A-C
  {
    id: 1,
    name: "Ajwain Essential Oil",
    botanical: "Trachyspermum ammi",
    origin: "India",
    method: "Steam Distilled",
    moq: "1 kg",
    grade: "Export",
    cat: "A-C",
    tags: ["Pharmaceutical", "Personal Care"],
    img: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&auto=format&fit=crop",
    featured: false,
  },
  {
    id: 2,
    name: "Allspice Essential Oil",
    botanical: "Pimenta dioica",
    origin: "Jamaica",
    method: "Steam Distilled",
    moq: "1 kg",
    grade: "Export",
    cat: "A-C",
    tags: ["Fragrance", "Food"],
    img: "https://images.unsplash.com/photo-1599599810694-a5f323ae2d7f?w=400&auto=format&fit=crop",
    featured: false,
  },
  {
    id: 3,
    name: "Ambrette Seed Oil",
    botanical: "Abelmoschus moschatus",
    origin: "India",
    method: "Steam Distilled",
    moq: "500 g",
    grade: "Premium",
    cat: "A-C",
    tags: ["Perfumery", "Cosmetics"],
    img: "https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?w=400&auto=format&fit=crop",
    featured: false,
  },
  {
    id: 4,
    name: "Amyris Essential Oil",
    botanical: "Amyris balsamifera",
    origin: "Haiti",
    method: "Steam Distilled",
    moq: "1 kg",
    grade: "Export",
    cat: "A-C",
    tags: ["Fragrance", "Aromatherapy"],
    img: "https://images.unsplash.com/photo-1518621736915-f3b1c41bfd00?w=400&auto=format&fit=crop",
    featured: false,
  },
  {
    id: 5,
    name: "Angelica Root Oil",
    botanical: "Angelica archangelica",
    origin: "France",
    method: "Steam Distilled",
    moq: "250 g",
    grade: "Premium",
    cat: "A-C",
    tags: ["Pharmaceutical", "Spa"],
    img: "https://images.unsplash.com/photo-1515377905703-c4788e51af15?w=400&auto=format&fit=crop",
    featured: true,
  },
  {
    id: 6,
    name: "Basil Essential Oil",
    botanical: "Ocimum basilicum",
    origin: "India",
    method: "Steam Distilled",
    moq: "1 kg",
    grade: "Export",
    cat: "A-C",
    tags: ["Aromatherapy", "Food"],
    img: "https://images.unsplash.com/photo-1444731961956-751ed90465a5?w=400&auto=format&fit=crop",
    featured: false,
  },
  {
    id: 7,
    name: "Bay Laurel Essential Oil",
    botanical: "Laurus nobilis",
    origin: "Morocco",
    method: "Steam Distilled",
    moq: "1 kg",
    grade: "Export",
    cat: "A-C",
    tags: ["Cosmetics", "Personal Care"],
    img: "https://images.unsplash.com/photo-1594736797933-d0501ba2fe65?w=400&auto=format&fit=crop",
    featured: false,
  },
  {
    id: 8,
    name: "Bergamot Essential Oil",
    botanical: "Citrus bergamia",
    origin: "Italy",
    method: "Cold Pressed",
    moq: "1 kg",
    grade: "Premium",
    cat: "A-C",
    tags: ["Fragrance", "Aromatherapy"],
    img: "https://images.unsplash.com/photo-1611909023032-2d6b3134ecba?w=400&auto=format&fit=crop",
    featured: true,
  },
  {
    id: 9,
    name: "Black Pepper Essential Oil",
    botanical: "Piper nigrum",
    origin: "India",
    method: "Steam Distilled",
    moq: "1 kg",
    grade: "Export",
    cat: "A-C",
    tags: ["Food", "Pharmaceutical"],
    img: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&auto=format&fit=crop",
    featured: false,
  },
  {
    id: 10,
    name: "Cajeput Essential Oil",
    botanical: "Melaleuca cajuputi",
    origin: "Indonesia",
    method: "Steam Distilled",
    moq: "1 kg",
    grade: "Export",
    cat: "A-C",
    tags: ["Pharmaceutical", "Spa"],
    img: "https://images.unsplash.com/photo-1518495973542-4542c06a5843?w=400&auto=format&fit=crop",
    featured: false,
  },
  {
    id: 11,
    name: "Camphor Essential Oil",
    botanical: "Cinnamomum camphora",
    origin: "China",
    method: "Steam Distilled",
    moq: "5 kg",
    grade: "Industrial",
    cat: "A-C",
    tags: ["Pharmaceutical", "Home Care"],
    img: "https://images.unsplash.com/photo-1426604966848-d7adac402bff?w=400&auto=format&fit=crop",
    featured: false,
  },
  {
    id: 12,
    name: "Cardamom Essential Oil",
    botanical: "Elettaria cardamomum",
    origin: "Guatemala",
    method: "Steam Distilled",
    moq: "500 g",
    grade: "Premium",
    cat: "A-C",
    tags: ["Food", "Fragrance"],
    img: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop",
    featured: true,
  },
  // D-K
  {
    id: 13,
    name: "Davana Essential Oil",
    botanical: "Artemisia pallens",
    origin: "India",
    method: "Steam Distilled",
    moq: "500 g",
    grade: "Premium",
    cat: "D-K",
    tags: ["Perfumery", "Cosmetics"],
    img: "https://images.unsplash.com/photo-1464207687429-7505649dae38?w=400&auto=format&fit=crop",
    featured: false,
  },
  {
    id: 14,
    name: "Dill Seed Essential Oil",
    botanical: "Anethum graveolens",
    origin: "India",
    method: "Steam Distilled",
    moq: "1 kg",
    grade: "Export",
    cat: "D-K",
    tags: ["Food", "Pharmaceutical"],
    img: "https://images.unsplash.com/photo-1515377905703-c4788e51af15?w=400&auto=format&fit=crop",
    featured: false,
  },
  {
    id: 15,
    name: "Eucalyptus Essential Oil",
    botanical: "Eucalyptus globulus",
    origin: "India",
    method: "Steam Distilled",
    moq: "5 kg",
    grade: "Export",
    cat: "D-K",
    tags: ["Pharmaceutical", "Home Care"],
    img: "https://images.unsplash.com/photo-1592921870789-04563d55041c?w=400&auto=format&fit=crop",
    featured: true,
  },
  {
    id: 16,
    name: "Fennel Sweet Essential Oil",
    botanical: "Foeniculum vulgare",
    origin: "Bulgaria",
    method: "Steam Distilled",
    moq: "1 kg",
    grade: "Export",
    cat: "D-K",
    tags: ["Food", "Pharmaceutical"],
    img: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&auto=format&fit=crop",
    featured: false,
  },
  {
    id: 17,
    name: "Frankincense Essential Oil",
    botanical: "Boswellia carterii",
    origin: "Somalia",
    method: "Steam Distilled",
    moq: "500 g",
    grade: "Premium",
    cat: "D-K",
    tags: ["Aromatherapy", "Spa"],
    img: "https://images.unsplash.com/photo-1596178065887-cf1c47ae3a99?w=400&auto=format&fit=crop",
    featured: true,
  },
  {
    id: 18,
    name: "Geranium Essential Oil",
    botanical: "Pelargonium graveolens",
    origin: "Egypt",
    method: "Steam Distilled",
    moq: "1 kg",
    grade: "Export",
    cat: "D-K",
    tags: ["Cosmetics", "Fragrance"],
    img: "https://images.unsplash.com/photo-1490750967868-88df5691cc8b?w=400&auto=format&fit=crop",
    featured: false,
  },
  {
    id: 19,
    name: "Ginger Essential Oil",
    botanical: "Zingiber officinale",
    origin: "India",
    method: "Steam Distilled",
    moq: "1 kg",
    grade: "Export",
    cat: "D-K",
    tags: ["Food", "Pharmaceutical"],
    img: "https://images.unsplash.com/photo-1563746098251-d35aef196e83?w=400&auto=format&fit=crop",
    featured: false,
  },
  {
    id: 20,
    name: "Juniper Berry Essential Oil",
    botanical: "Juniperus communis",
    origin: "Hungary",
    method: "Steam Distilled",
    moq: "1 kg",
    grade: "Export",
    cat: "D-K",
    tags: ["Fragrance", "Spa"],
    img: "https://images.unsplash.com/photo-1518621736915-f3b1c41bfd00?w=400&auto=format&fit=crop",
    featured: false,
  },
  // L-S
  {
    id: 21,
    name: "Lavender Essential Oil",
    botanical: "Lavandula angustifolia",
    origin: "Bulgaria",
    method: "Steam Distilled",
    moq: "1 kg",
    grade: "Premium",
    cat: "L-S",
    tags: ["Cosmetics", "Aromatherapy", "Spa"],
    img: "https://images.unsplash.com/photo-1611909023032-2d6b3134ecba?w=400&auto=format&fit=crop",
    featured: true,
  },
  {
    id: 22,
    name: "Lemon Essential Oil",
    botanical: "Citrus limon",
    origin: "Italy",
    method: "Cold Pressed",
    moq: "1 kg",
    grade: "Export",
    cat: "L-S",
    tags: ["Food", "Cosmetics"],
    img: "https://images.unsplash.com/photo-1587478769787-31a5e1ec0697?w=400&auto=format&fit=crop",
    featured: false,
  },
  {
    id: 23,
    name: "Lemongrass Essential Oil",
    botanical: "Cymbopogon citratus",
    origin: "India",
    method: "Steam Distilled",
    moq: "5 kg",
    grade: "Export",
    cat: "L-S",
    tags: ["Aromatherapy", "Home Care"],
    img: "https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?w=400&auto=format&fit=crop",
    featured: false,
  },
  {
    id: 24,
    name: "Neroli Essential Oil",
    botanical: "Citrus aurantium",
    origin: "Morocco",
    method: "Steam Distilled",
    moq: "250 g",
    grade: "Luxury",
    cat: "L-S",
    tags: ["Perfumery", "Cosmetics"],
    img: "https://images.unsplash.com/photo-1490750967868-88df5691cc8b?w=400&auto=format&fit=crop",
    featured: true,
  },
  {
    id: 25,
    name: "Patchouli Essential Oil",
    botanical: "Pogostemon cablin",
    origin: "Indonesia",
    method: "Steam Distilled",
    moq: "5 kg",
    grade: "Export",
    cat: "L-S",
    tags: ["Perfumery", "Cosmetics"],
    img: "https://images.unsplash.com/photo-1515377905703-c4788e51af15?w=400&auto=format&fit=crop",
    featured: false,
  },
  {
    id: 26,
    name: "Peppermint Essential Oil",
    botanical: "Mentha piperita",
    origin: "USA",
    method: "Steam Distilled",
    moq: "5 kg",
    grade: "Export",
    cat: "L-S",
    tags: ["Food", "Pharmaceutical", "Cosmetics"],
    img: "https://images.unsplash.com/photo-1604480132736-44c188fe4d20?w=400&auto=format&fit=crop",
    featured: true,
  },
  {
    id: 27,
    name: "Rose Absolute Oil",
    botanical: "Rosa damascena",
    origin: "Bulgaria",
    method: "Solvent Extracted",
    moq: "50 g",
    grade: "Luxury",
    cat: "L-S",
    tags: ["Perfumery", "Cosmetics"],
    img: "https://images.unsplash.com/photo-1559181567-c3190bcc0696?w=400&auto=format&fit=crop",
    featured: true,
  },
  {
    id: 28,
    name: "Rosemary Essential Oil",
    botanical: "Rosmarinus officinalis",
    origin: "Morocco",
    method: "Steam Distilled",
    moq: "1 kg",
    grade: "Export",
    cat: "L-S",
    tags: ["Cosmetics", "Food", "Aromatherapy"],
    img: "https://images.unsplash.com/photo-1527424155816-68e23aedc6c9?w=400&auto=format&fit=crop",
    featured: false,
  },
  {
    id: 29,
    name: "Sandalwood Essential Oil",
    botanical: "Santalum album",
    origin: "India",
    method: "Steam Distilled",
    moq: "250 g",
    grade: "Luxury",
    cat: "L-S",
    tags: ["Perfumery", "Spa"],
    img: "https://images.unsplash.com/photo-1561154464-82e9adf32764?w=400&auto=format&fit=crop",
    featured: true,
  },
  // T-Z
  {
    id: 30,
    name: "Tea Tree Essential Oil",
    botanical: "Melaleuca alternifolia",
    origin: "Australia",
    method: "Steam Distilled",
    moq: "1 kg",
    grade: "Export",
    cat: "T-Z",
    tags: ["Pharmaceutical", "Cosmetics"],
    img: "https://images.unsplash.com/photo-1540206395-68808572332f?w=400&auto=format&fit=crop",
    featured: false,
  },
  {
    id: 31,
    name: "Thyme Essential Oil",
    botanical: "Thymus vulgaris",
    origin: "Spain",
    method: "Steam Distilled",
    moq: "1 kg",
    grade: "Export",
    cat: "T-Z",
    tags: ["Pharmaceutical", "Food"],
    img: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&auto=format&fit=crop",
    featured: false,
  },
  {
    id: 32,
    name: "Turmeric Essential Oil",
    botanical: "Curcuma longa",
    origin: "India",
    method: "Steam Distilled",
    moq: "1 kg",
    grade: "Export",
    cat: "T-Z",
    tags: ["Pharmaceutical", "Cosmetics"],
    img: "https://images.unsplash.com/photo-1615485500704-8e990f9900f7?w=400&auto=format&fit=crop",
    featured: false,
  },
  {
    id: 33,
    name: "Vetiver Essential Oil",
    botanical: "Vetiveria zizanoides",
    origin: "Haiti",
    method: "Steam Distilled",
    moq: "500 g",
    grade: "Premium",
    cat: "T-Z",
    tags: ["Perfumery", "Aromatherapy"],
    img: "https://images.unsplash.com/photo-1518495973542-4542c06a5843?w=400&auto=format&fit=crop",
    featured: false,
  },
  {
    id: 34,
    name: "Wintergreen Essential Oil",
    botanical: "Gaultheria procumbens",
    origin: "Nepal",
    method: "Steam Distilled",
    moq: "1 kg",
    grade: "Export",
    cat: "T-Z",
    tags: ["Pharmaceutical", "Personal Care"],
    img: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&auto=format&fit=crop",
    featured: false,
  },
  {
    id: 35,
    name: "Ylang Ylang Essential Oil",
    botanical: "Cananga odorata",
    origin: "Madagascar",
    method: "Steam Distilled",
    moq: "1 kg",
    grade: "Premium",
    cat: "T-Z",
    tags: ["Perfumery", "Cosmetics", "Spa"],
    img: "https://images.unsplash.com/photo-1490750967868-88df5691cc8b?w=400&auto=format&fit=crop",
    featured: false,
  },
  {
    id: 36,
    name: "Spearmint Essential Oil",
    botanical: "Mentha spicata",
    origin: "India",
    method: "Steam Distilled",
    moq: "1 kg",
    grade: "Export",
    cat: "T-Z",
    tags: ["Food", "Personal Care"],
    img: "https://images.unsplash.com/photo-1604480132736-44c188fe4d20?w=400&auto=format&fit=crop",
    featured: false,
  },
];

const CATEGORIES = [
  { id: "all", label: "All Products", count: ALL_PRODUCTS.length },
  {
    id: "A-C",
    label: "Natural Oils (A – C)",
    count: ALL_PRODUCTS.filter((p) => p.cat === "A-C").length,
  },
  {
    id: "D-K",
    label: "Natural Oils (D – K)",
    count: ALL_PRODUCTS.filter((p) => p.cat === "D-K").length,
  },
  {
    id: "L-S",
    label: "Natural Oils (L – S)",
    count: ALL_PRODUCTS.filter((p) => p.cat === "L-S").length,
  },
  {
    id: "T-Z",
    label: "Natural Oils (T – Z)",
    count: ALL_PRODUCTS.filter((p) => p.cat === "T-Z").length,
  },
];

const ALL_TAGS = [
  "Aromatherapy",
  "Cosmetics",
  "Food",
  "Fragrance",
  "Home Care",
  "Perfumery",
  "Personal Care",
  "Pharmaceutical",
  "Spa",
];
const GRADES = ["Export", "Premium", "Luxury", "Industrial"];
const METHODS = ["Steam Distilled", "Cold Pressed", "Solvent Extracted"];

const GRADE_COLORS = {
  Export: { bg: "#EAF3DE", text: "#3B6D11", border: "#97C459" },
  Premium: { bg: "#FAEEDA", text: "#854F0B", border: "#EF9F27" },
  Luxury: { bg: "#FBEAF0", text: "#993556", border: "#ED93B1" },
  Industrial: { bg: "#F1EFE8", text: "#5F5E5A", border: "#B4B2A9" },
};

// ── INQUIRY MODAL ─────────────────────────────────────────────────────────────
function InquiryModal({ product, onClose }) {
  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "1rem",
        background: "rgba(15,13,11,0.75)",
      }}
    >
      <div
        style={{
          background: "#FBF7F2",
          borderRadius: "20px",
          width: "100%",
          maxWidth: "460px",
          padding: "28px",
          boxShadow: "0 40px 80px rgba(15,13,11,0.35)",
          border: "1px solid rgba(201,168,124,0.3)",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: "20px",
          }}
        >
          <div>
            <p
              style={{
                fontFamily: "Georgia,serif",
                fontWeight: "700",
                fontSize: "17px",
                color: "#0F0D0B",
                margin: 0,
              }}
            >
              Send Inquiry
            </p>
            <p
              style={{
                fontSize: "11px",
                color: "#9C6B3C",
                fontStyle: "italic",
                margin: "3px 0 0",
                fontFamily: "sans-serif",
              }}
            >
              {product.name}
            </p>
          </div>
          <button
            onClick={onClose}
            style={{
              background: "transparent",
              border: "none",
              cursor: "pointer",
              fontSize: "20px",
              color: "#9C6B3C",
              lineHeight: 1,
            }}
          >
            ✕
          </button>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          {[
            "Full Name",
            "Company / Brand",
            "Email Address",
            "Phone / WhatsApp",
          ].map((ph) => (
            <input
              key={ph}
              placeholder={ph}
              style={{
                width: "100%",
                border: "1px solid rgba(201,168,124,0.5)",
                borderRadius: "10px",
                padding: "11px 14px",
                fontSize: "13px",
                outline: "none",
                background: "white",
                color: "#0F0D0B",
                fontFamily: "sans-serif",
                boxSizing: "border-box",
              }}
            />
          ))}
          <select
            style={{
              width: "100%",
              border: "1px solid rgba(201,168,124,0.5)",
              borderRadius: "10px",
              padding: "11px 14px",
              fontSize: "13px",
              outline: "none",
              background: "white",
              color: "#0F0D0B",
              fontFamily: "sans-serif",
              boxSizing: "border-box",
            }}
          >
            <option>Select Quantity / Grade</option>
            <option>Sample (10ml – 100ml)</option>
            <option>Small Batch (1 kg – 5 kg)</option>
            <option>Bulk (10 kg – 50 kg)</option>
            <option>Large Bulk (50 kg+)</option>
          </select>
          <textarea
            rows={3}
            placeholder="Additional requirements — packaging, private label, COA, certifications…"
            style={{
              width: "100%",
              border: "1px solid rgba(201,168,124,0.5)",
              borderRadius: "10px",
              padding: "11px 14px",
              fontSize: "13px",
              outline: "none",
              background: "white",
              resize: "none",
              color: "#0F0D0B",
              fontFamily: "sans-serif",
              boxSizing: "border-box",
            }}
          />
          <button
            style={{
              width: "100%",
              padding: "14px",
              background: "#2C1A0E",
              color: "#C9A87C",
              borderRadius: "10px",
              fontWeight: "700",
              fontSize: "12px",
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              border: "none",
              cursor: "pointer",
              fontFamily: "sans-serif",
            }}
          >
            Submit Inquiry
          </button>
        </div>
        <p
          style={{
            textAlign: "center",
            fontSize: "11px",
            color: "rgba(156,107,60,0.6)",
            marginTop: "12px",
            fontFamily: "sans-serif",
          }}
        >
          Response within 24 business hours · 100% Confidential
        </p>
      </div>
    </div>
  );
}

// ── PRODUCT CARD ──────────────────────────────────────────────────────────────
function ProductCard({ product, onInquire }) {
  const [hovered, setHovered] = useState(false);
  const gc = GRADE_COLORS[product.grade] || GRADE_COLORS.Export;
  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: "white",
        borderRadius: "18px",
        overflow: "hidden",
        border: hovered
          ? "1px solid rgba(156,107,60,0.6)"
          : "1px solid rgba(201,168,124,0.25)",
        transform: hovered ? "translateY(-4px)" : "translateY(0)",
        transition: "all 0.25s ease",
        boxShadow: hovered
          ? "0 16px 40px rgba(44,26,14,0.12)"
          : "0 2px 8px rgba(44,26,14,0.04)",
        display: "flex",
        flexDirection: "column",
        position: "relative",
      }}
    >
      {/* Featured badge */}
      {product.featured && (
        <div
          style={{
            position: "absolute",
            top: "12px",
            left: "12px",
            zIndex: 2,
            background: "#2C1A0E",
            color: "#C9A87C",
            fontSize: "9px",
            fontWeight: "700",
            letterSpacing: "0.15em",
            textTransform: "uppercase",
            padding: "4px 10px",
            borderRadius: "100px",
            fontFamily: "sans-serif",
          }}
        >
          ★ Featured
        </div>
      )}

      {/* Image */}
      <div
        style={{
          position: "relative",
          height: "180px",
          overflow: "hidden",
          background: "#F5EFE6",
        }}
      >
        <img
          src={product.img}
          alt={product.name}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            transform: hovered ? "scale(1.06)" : "scale(1)",
            transition: "transform 0.4s ease",
          }}
          onError={(e) => {
            e.target.style.display = "none";
          }}
        />
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: hovered ? "rgba(15,13,11,0.15)" : "rgba(15,13,11,0)",
            transition: "background 0.3s",
          }}
        />
        {/* Quick inquiry overlay */}
        <div
          style={{
            position: "absolute",
            bottom: "0",
            left: "0",
            right: "0",
            padding: "12px",
            transform: hovered ? "translateY(0)" : "translateY(100%)",
            transition: "transform 0.3s ease",
          }}
        >
          <button
            onClick={() => onInquire(product)}
            style={{
              width: "100%",
              padding: "10px",
              background: "rgba(44,26,14,0.92)",
              color: "#C9A87C",
              border: "none",
              borderRadius: "10px",
              fontSize: "11px",
              fontWeight: "700",
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              fontFamily: "sans-serif",
              cursor: "pointer",
            }}
          >
            Get Quote
          </button>
        </div>
      </div>

      {/* Content */}
      <div
        style={{
          padding: "16px 18px",
          flex: 1,
          display: "flex",
          flexDirection: "column",
          gap: "8px",
        }}
      >
        {/* Grade badge */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <span
            style={{
              fontSize: "9px",
              fontWeight: "700",
              letterSpacing: "0.15em",
              textTransform: "uppercase",
              padding: "3px 10px",
              borderRadius: "100px",
              background: gc.bg,
              color: gc.text,
              border: `1px solid ${gc.border}`,
              fontFamily: "sans-serif",
            }}
          >
            {product.grade}
          </span>
          <span
            style={{
              fontSize: "10px",
              color: "#9C6B3C",
              fontFamily: "sans-serif",
              display: "flex",
              alignItems: "center",
              gap: "3px",
            }}
          >
            <span style={{ fontSize: "10px" }}>🌍</span> {product.origin}
          </span>
        </div>

        {/* Name */}
        <h3
          style={{
            fontFamily: "Georgia,serif",
            fontSize: "15px",
            fontWeight: "700",
            color: "#0F0D0B",
            lineHeight: "1.3",
            margin: 0,
          }}
        >
          {product.name}
        </h3>
        <p
          style={{
            fontSize: "11px",
            color: "#9C6B3C",
            fontStyle: "italic",
            margin: 0,
            fontFamily: "sans-serif",
          }}
        >
          {product.botanical}
        </p>

        {/* Specs row */}
        <div
          style={{
            display: "flex",
            gap: "6px",
            flexWrap: "wrap",
            marginTop: "2px",
          }}
        >
          <span
            style={{
              fontSize: "10px",
              padding: "3px 8px",
              background: "#F5EFE6",
              color: "#5C3A1E",
              borderRadius: "6px",
              fontFamily: "sans-serif",
              fontWeight: "600",
            }}
          >
            {product.method}
          </span>
          <span
            style={{
              fontSize: "10px",
              padding: "3px 8px",
              background: "#F5EFE6",
              color: "#5C3A1E",
              borderRadius: "6px",
              fontFamily: "sans-serif",
              fontWeight: "600",
            }}
          >
            MOQ: {product.moq}
          </span>
        </div>

        {/* Tags */}
        <div
          style={{
            display: "flex",
            gap: "5px",
            flexWrap: "wrap",
            marginTop: "2px",
          }}
        >
          {product.tags.slice(0, 3).map((t) => (
            <span
              key={t}
              style={{
                fontSize: "9px",
                padding: "2px 7px",
                border: "1px solid rgba(201,168,124,0.4)",
                borderRadius: "4px",
                color: "#9C6B3C",
                fontFamily: "sans-serif",
                fontWeight: "600",
              }}
            >
              {t}
            </span>
          ))}
        </div>

        {/* Footer */}
        <div
          style={{
            marginTop: "auto",
            paddingTop: "12px",
            borderTop: "1px solid rgba(201,168,124,0.2)",
            display: "flex",
            gap: "8px",
          }}
        >
          <button
            onClick={() => onInquire(product)}
            style={{
              flex: 1,
              padding: "9px",
              background: "#2C1A0E",
              color: "#C9A87C",
              border: "none",
              borderRadius: "8px",
              fontSize: "11px",
              fontWeight: "700",
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              fontFamily: "sans-serif",
              cursor: "pointer",
            }}
          >
            Inquire
          </button>
          <button
            style={{
              padding: "9px 12px",
              background: "transparent",
              border: "1px solid rgba(201,168,124,0.4)",
              borderRadius: "8px",
              fontSize: "11px",
              color: "#5C3A1E",
              fontFamily: "sans-serif",
              cursor: "pointer",
            }}
          >
            COA ↓
          </button>
        </div>
      </div>
    </div>
  );
}

// ── MAIN COMPONENT ────────────────────────────────────────────────────────────
export default function EssentialOilsListingPage() {
  const [activeCategory, setActiveCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTags, setSelectedTags] = useState([]);
  const [selectedGrades, setSelectedGrades] = useState([]);
  const [selectedMethods, setSelectedMethods] = useState([]);
  const [showFeaturedOnly, setShowFeaturedOnly] = useState(false);
  const [sortBy, setSortBy] = useState("default");
  const [inquiryProduct, setInquiryProduct] = useState(null);
  const [viewMode, setViewMode] = useState("grid");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleTag = (tag) =>
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag],
    );
  const toggleGrade = (g) =>
    setSelectedGrades((prev) =>
      prev.includes(g) ? prev.filter((x) => x !== g) : [...prev, g],
    );
  const toggleMethod = (m) =>
    setSelectedMethods((prev) =>
      prev.includes(m) ? prev.filter((x) => x !== m) : [...prev, m],
    );
  const clearAll = () => {
    setSelectedTags([]);
    setSelectedGrades([]);
    setSelectedMethods([]);
    setShowFeaturedOnly(false);
    setSearchQuery("");
    setSortBy("default");
  };

  const filtered = useMemo(() => {
    let r = ALL_PRODUCTS;
    if (activeCategory !== "all") r = r.filter((p) => p.cat === activeCategory);
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      r = r.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.botanical.toLowerCase().includes(q) ||
          p.origin.toLowerCase().includes(q) ||
          p.tags.some((t) => t.toLowerCase().includes(q)),
      );
    }
    if (selectedTags.length)
      r = r.filter((p) => selectedTags.every((t) => p.tags.includes(t)));
    if (selectedGrades.length)
      r = r.filter((p) => selectedGrades.includes(p.grade));
    if (selectedMethods.length)
      r = r.filter((p) => selectedMethods.includes(p.method));
    if (showFeaturedOnly) r = r.filter((p) => p.featured);
    if (sortBy === "name-az")
      r = [...r].sort((a, b) => a.name.localeCompare(b.name));
    if (sortBy === "name-za")
      r = [...r].sort((a, b) => b.name.localeCompare(a.name));
    if (sortBy === "origin")
      r = [...r].sort((a, b) => a.origin.localeCompare(b.origin));
    return r;
  }, [
    activeCategory,
    searchQuery,
    selectedTags,
    selectedGrades,
    selectedMethods,
    showFeaturedOnly,
    sortBy,
  ]);

  const activeFiltersCount =
    selectedTags.length +
    selectedGrades.length +
    selectedMethods.length +
    (showFeaturedOnly ? 1 : 0);

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#FBF7F2",
        fontFamily: "Georgia,'Times New Roman',serif",
      }}
    >
      {/* ── HERO BANNER ──────────────────────────────────────────────────────── */}
      <div
        style={{
          background: "#0F0D0B",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: "-120px",
            right: "-120px",
            width: "500px",
            height: "500px",
            borderRadius: "50%",
            background: "rgba(156,107,60,0.07)",
            pointerEvents: "none",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: "-80px",
            left: "10%",
            width: "300px",
            height: "300px",
            borderRadius: "50%",
            background: "rgba(201,168,124,0.05)",
            pointerEvents: "none",
          }}
        />
        <div
          style={{
            maxWidth: "1280px",
            margin: "0 auto",
            padding: "clamp(32px,5vw,60px) 24px",
            position: "relative",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "flex-end",
              justifyContent: "space-between",
              flexWrap: "wrap",
              gap: "20px",
            }}
          >
            <div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  marginBottom: "14px",
                }}
              >
                <div
                  style={{
                    height: "1px",
                    width: "28px",
                    background: "#C9A87C",
                  }}
                />
                <span
                  style={{
                    fontSize: "10px",
                    fontWeight: "700",
                    letterSpacing: "0.25em",
                    color: "#9C6B3C",
                    fontFamily: "sans-serif",
                    textTransform: "uppercase",
                  }}
                >
                  Manufacturer & Exporter
                </span>
              </div>
              <h1
                style={{
                  fontSize: "clamp(28px,5vw,52px)",
                  fontWeight: "700",
                  color: "white",
                  lineHeight: "1.15",
                  margin: "0 0 10px",
                }}
              >
                Natural Essential Oils
              </h1>
              <p
                style={{
                  fontSize: "14px",
                  color: "rgba(201,168,124,0.75)",
                  fontFamily: "sans-serif",
                  maxWidth: "540px",
                  lineHeight: "1.7",
                  margin: 0,
                }}
              >
                100% pure, GC/MS verified essential oils for bulk wholesale &
                private label. Trusted by 500+ global B2B buyers across 45+
                countries.
              </p>
              <div
                style={{
                  display: "flex",
                  gap: "10px",
                  marginTop: "20px",
                  flexWrap: "wrap",
                }}
              >
                {[
                  ["36+", "Products"],
                  ["45+", "Countries"],
                  ["25+", "Years"],
                  ["500+", "Clients"],
                ].map(([n, l]) => (
                  <div
                    key={l}
                    style={{
                      textAlign: "center",
                      padding: "10px 20px",
                      border: "1px solid rgba(201,168,124,0.2)",
                      borderRadius: "12px",
                      background: "rgba(44,26,14,0.4)",
                    }}
                  >
                    <p
                      style={{
                        fontFamily: "Georgia,serif",
                        fontSize: "22px",
                        fontWeight: "700",
                        color: "#C9A87C",
                        margin: 0,
                      }}
                    >
                      {n}
                    </p>
                    <p
                      style={{
                        fontSize: "9px",
                        fontWeight: "700",
                        letterSpacing: "0.15em",
                        color: "rgba(201,168,124,0.5)",
                        textTransform: "uppercase",
                        fontFamily: "sans-serif",
                        margin: 0,
                      }}
                    >
                      {l}
                    </p>
                  </div>
                ))}
              </div>
            </div>
            <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
              <button
                style={{
                  padding: "13px 24px",
                  background: "#C9A87C",
                  color: "#0F0D0B",
                  border: "none",
                  borderRadius: "10px",
                  fontWeight: "700",
                  fontSize: "12px",
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  fontFamily: "sans-serif",
                  cursor: "pointer",
                }}
              >
                Request Catalog
              </button>
              <button
                style={{
                  padding: "13px 24px",
                  background: "transparent",
                  color: "#C9A87C",
                  border: "1px solid rgba(201,168,124,0.4)",
                  borderRadius: "10px",
                  fontWeight: "700",
                  fontSize: "12px",
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  fontFamily: "sans-serif",
                  cursor: "pointer",
                }}
              >
                Bulk Pricing
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ── BREADCRUMB + TRUST STRIP ──────────────────────────────────────────── */}
      <div
        style={{
          background: "white",
          borderBottom: "1px solid rgba(201,168,124,0.2)",
        }}
      >
        <div
          style={{
            maxWidth: "1280px",
            margin: "0 auto",
            padding: "10px 24px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: "8px",
          }}
        >
          <nav
            style={{
              display: "flex",
              alignItems: "center",
              gap: "6px",
              fontSize: "11px",
              color: "#9C6B3C",
              fontFamily: "sans-serif",
            }}
          >
            {["Home", "Products"].map((item, i) => (
              <span
                key={i}
                style={{ display: "flex", alignItems: "center", gap: "6px" }}
              >
                <a
                  href="#"
                  style={{ color: "#9C6B3C", textDecoration: "none" }}
                >
                  {item}
                </a>
                <span style={{ opacity: 0.5 }}>›</span>
              </span>
            ))}
            <span style={{ color: "#0F0D0B", fontWeight: "600" }}>
              Natural Essential Oils
            </span>
          </nav>
          <div style={{ display: "flex", gap: "16px", alignItems: "center" }}>
            {[
              "ISO 9001:2015",
              "GMP Certified",
              "GC/MS Verified",
              "IFRA Compliant",
            ].map((b) => (
              <span
                key={b}
                style={{
                  fontSize: "10px",
                  fontWeight: "600",
                  color: "#5C3A1E",
                  fontFamily: "sans-serif",
                  display: "flex",
                  alignItems: "center",
                  gap: "4px",
                }}
              >
                <span style={{ color: "#9C6B3C", fontSize: "12px" }}>✓</span>{" "}
                {b}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* ── MAIN LAYOUT: SIDEBAR + CONTENT ───────────────────────────────────── */}
      <div
        style={{
          maxWidth: "1280px",
          margin: "0 auto",
          padding: "28px 24px",
          display: "grid",
          gridTemplateColumns: "260px 1fr",
          gap: "28px",
          alignItems: "start",
        }}
      >
        {/* ── SIDEBAR ────────────────────────────────────────────────────────── */}
        <aside>
          {/* Categories */}
          <div
            style={{
              background: "white",
              borderRadius: "16px",
              border: "1px solid rgba(201,168,124,0.25)",
              overflow: "hidden",
              marginBottom: "16px",
            }}
          >
            <div
              style={{
                padding: "14px 18px",
                background: "#2C1A0E",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <span
                style={{
                  fontFamily: "Georgia,serif",
                  fontSize: "14px",
                  fontWeight: "700",
                  color: "#C9A87C",
                }}
              >
                Categories
              </span>
              <span style={{ fontSize: "18px" }}>🌿</span>
            </div>
            <div style={{ padding: "8px 0" }}>
              {CATEGORIES.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  style={{
                    width: "100%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "11px 18px",
                    background:
                      activeCategory === cat.id ? "#F5EFE6" : "transparent",
                    border: "none",
                    borderLeft:
                      activeCategory === cat.id
                        ? "3px solid #9C6B3C"
                        : "3px solid transparent",
                    cursor: "pointer",
                    transition: "all 0.15s",
                  }}
                >
                  <span
                    style={{
                      fontSize: "13px",
                      fontWeight: activeCategory === cat.id ? "700" : "500",
                      color: activeCategory === cat.id ? "#2C1A0E" : "#5C3A1E",
                      fontFamily: "sans-serif",
                    }}
                  >
                    {cat.label}
                  </span>
                  <span
                    style={{
                      fontSize: "11px",
                      padding: "2px 8px",
                      borderRadius: "100px",
                      background:
                        activeCategory === cat.id ? "#2C1A0E" : "#F5EFE6",
                      color: activeCategory === cat.id ? "#C9A87C" : "#9C6B3C",
                      fontFamily: "sans-serif",
                      fontWeight: "700",
                    }}
                  >
                    {cat.count}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Grade Filter */}
          <div
            style={{
              background: "white",
              borderRadius: "16px",
              border: "1px solid rgba(201,168,124,0.25)",
              overflow: "hidden",
              marginBottom: "16px",
            }}
          >
            <div
              style={{
                padding: "12px 18px",
                borderBottom: "1px solid rgba(201,168,124,0.15)",
              }}
            >
              <span
                style={{
                  fontFamily: "Georgia,serif",
                  fontSize: "13px",
                  fontWeight: "700",
                  color: "#0F0D0B",
                }}
              >
                Grade
              </span>
            </div>
            <div
              style={{
                padding: "12px 18px",
                display: "flex",
                flexDirection: "column",
                gap: "8px",
              }}
            >
              {GRADES.map((g) => {
                const gc = GRADE_COLORS[g];
                const active = selectedGrades.includes(g);
                return (
                  <label
                    key={g}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                      cursor: "pointer",
                    }}
                  >
                    <div
                      onClick={() => toggleGrade(g)}
                      style={{
                        width: "18px",
                        height: "18px",
                        borderRadius: "5px",
                        border: active
                          ? `2px solid ${gc.border}`
                          : "1.5px solid rgba(201,168,124,0.4)",
                        background: active ? gc.bg : "white",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0,
                        cursor: "pointer",
                      }}
                    >
                      {active && (
                        <span style={{ fontSize: "10px", color: gc.text }}>
                          ✓
                        </span>
                      )}
                    </div>
                    <span
                      onClick={() => toggleGrade(g)}
                      style={{
                        fontSize: "12px",
                        color: "#5C3A1E",
                        fontFamily: "sans-serif",
                        fontWeight: "600",
                      }}
                    >
                      {g}
                    </span>
                    <span
                      style={{
                        marginLeft: "auto",
                        fontSize: "10px",
                        padding: "2px 7px",
                        borderRadius: "100px",
                        background: gc.bg,
                        color: gc.text,
                        fontFamily: "sans-serif",
                        fontWeight: "700",
                        border: `1px solid ${gc.border}`,
                      }}
                    >
                      {ALL_PRODUCTS.filter((p) => p.grade === g).length}
                    </span>
                  </label>
                );
              })}
            </div>
          </div>

          {/* Method Filter */}
          <div
            style={{
              background: "white",
              borderRadius: "16px",
              border: "1px solid rgba(201,168,124,0.25)",
              overflow: "hidden",
              marginBottom: "16px",
            }}
          >
            <div
              style={{
                padding: "12px 18px",
                borderBottom: "1px solid rgba(201,168,124,0.15)",
              }}
            >
              <span
                style={{
                  fontFamily: "Georgia,serif",
                  fontSize: "13px",
                  fontWeight: "700",
                  color: "#0F0D0B",
                }}
              >
                Extraction Method
              </span>
            </div>
            <div
              style={{
                padding: "12px 18px",
                display: "flex",
                flexDirection: "column",
                gap: "8px",
              }}
            >
              {METHODS.map((m) => {
                const active = selectedMethods.includes(m);
                return (
                  <label
                    key={m}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                      cursor: "pointer",
                    }}
                  >
                    <div
                      onClick={() => toggleMethod(m)}
                      style={{
                        width: "18px",
                        height: "18px",
                        borderRadius: "5px",
                        border: active
                          ? "2px solid #9C6B3C"
                          : "1.5px solid rgba(201,168,124,0.4)",
                        background: active ? "#F5EFE6" : "white",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0,
                        cursor: "pointer",
                      }}
                    >
                      {active && (
                        <span style={{ fontSize: "10px", color: "#5C3A1E" }}>
                          ✓
                        </span>
                      )}
                    </div>
                    <span
                      onClick={() => toggleMethod(m)}
                      style={{
                        fontSize: "12px",
                        color: "#5C3A1E",
                        fontFamily: "sans-serif",
                      }}
                    >
                      {m}
                    </span>
                  </label>
                );
              })}
            </div>
          </div>

          {/* Industry/Application Filter */}
          <div
            style={{
              background: "white",
              borderRadius: "16px",
              border: "1px solid rgba(201,168,124,0.25)",
              overflow: "hidden",
              marginBottom: "16px",
            }}
          >
            <div
              style={{
                padding: "12px 18px",
                borderBottom: "1px solid rgba(201,168,124,0.15)",
              }}
            >
              <span
                style={{
                  fontFamily: "Georgia,serif",
                  fontSize: "13px",
                  fontWeight: "700",
                  color: "#0F0D0B",
                }}
              >
                Industry / Application
              </span>
            </div>
            <div
              style={{
                padding: "12px 18px",
                display: "flex",
                flexWrap: "wrap",
                gap: "7px",
              }}
            >
              {ALL_TAGS.map((tag) => {
                const active = selectedTags.includes(tag);
                return (
                  <button
                    key={tag}
                    onClick={() => toggleTag(tag)}
                    style={{
                      fontSize: "10px",
                      fontWeight: "700",
                      padding: "5px 11px",
                      borderRadius: "100px",
                      border: active
                        ? "1.5px solid #9C6B3C"
                        : "1px solid rgba(201,168,124,0.35)",
                      background: active ? "#2C1A0E" : "white",
                      color: active ? "#C9A87C" : "#5C3A1E",
                      cursor: "pointer",
                      fontFamily: "sans-serif",
                      transition: "all 0.15s",
                    }}
                  >
                    {tag}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Featured Toggle */}
          <div
            style={{
              background: "white",
              borderRadius: "16px",
              border: "1px solid rgba(201,168,124,0.25)",
              padding: "14px 18px",
              marginBottom: "16px",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <span
              style={{
                fontSize: "13px",
                fontWeight: "700",
                color: "#0F0D0B",
                fontFamily: "Georgia,serif",
              }}
            >
              Featured Only
            </span>
            <div
              onClick={() => setShowFeaturedOnly((v) => !v)}
              style={{
                width: "44px",
                height: "24px",
                borderRadius: "100px",
                background: showFeaturedOnly
                  ? "#2C1A0E"
                  : "rgba(201,168,124,0.3)",
                cursor: "pointer",
                position: "relative",
                transition: "background 0.2s",
                flexShrink: 0,
              }}
            >
              <div
                style={{
                  width: "18px",
                  height: "18px",
                  borderRadius: "50%",
                  background: "white",
                  position: "absolute",
                  top: "3px",
                  left: showFeaturedOnly ? "23px" : "3px",
                  transition: "left 0.2s",
                  boxShadow: "0 1px 4px rgba(0,0,0,0.2)",
                }}
              />
            </div>
          </div>

          {/* Enquiry CTA */}
          <div
            style={{
              background: "#2C1A0E",
              borderRadius: "16px",
              padding: "20px",
              textAlign: "center",
              border: "1px solid rgba(201,168,124,0.2)",
            }}
          >
            <div style={{ fontSize: "28px", marginBottom: "10px" }}>📩</div>
            <p
              style={{
                fontFamily: "Georgia,serif",
                fontSize: "14px",
                fontWeight: "700",
                color: "white",
                margin: "0 0 6px",
              }}
            >
              Need Custom Quote?
            </p>
            <p
              style={{
                fontSize: "11px",
                color: "rgba(201,168,124,0.7)",
                fontFamily: "sans-serif",
                lineHeight: "1.6",
                margin: "0 0 14px",
              }}
            >
              Our export team responds within 24 hours.
            </p>
            <button
              onClick={() =>
                setInquiryProduct({ name: "General Inquiry — Essential Oils" })
              }
              style={{
                width: "100%",
                padding: "11px",
                background: "#C9A87C",
                color: "#0F0D0B",
                border: "none",
                borderRadius: "9px",
                fontWeight: "700",
                fontSize: "11px",
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                fontFamily: "sans-serif",
                cursor: "pointer",
              }}
            >
              Send Enquiry
            </button>
          </div>
        </aside>

        {/* ── PRODUCTS CONTENT ───────────────────────────────────────────────── */}
        <div>
          {/* Toolbar */}
          <div
            style={{
              background: "white",
              borderRadius: "14px",
              padding: "14px 18px",
              marginBottom: "20px",
              border: "1px solid rgba(201,168,124,0.25)",
              display: "flex",
              alignItems: "center",
              gap: "12px",
              flexWrap: "wrap",
            }}
          >
            {/* Search */}
            <div
              style={{
                flex: 1,
                minWidth: "200px",
                position: "relative",
                display: "flex",
                alignItems: "center",
              }}
            >
              <span
                style={{
                  position: "absolute",
                  left: "12px",
                  fontSize: "16px",
                  pointerEvents: "none",
                }}
              >
                🔍
              </span>
              <input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by name, botanical, origin…"
                style={{
                  width: "100%",
                  border: "1px solid rgba(201,168,124,0.4)",
                  borderRadius: "9px",
                  padding: "10px 12px 10px 36px",
                  fontSize: "13px",
                  outline: "none",
                  background: "#FBF7F2",
                  color: "#0F0D0B",
                  fontFamily: "sans-serif",
                  boxSizing: "border-box",
                }}
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  style={{
                    position: "absolute",
                    right: "10px",
                    background: "transparent",
                    border: "none",
                    cursor: "pointer",
                    fontSize: "14px",
                    color: "#9C6B3C",
                  }}
                >
                  ✕
                </button>
              )}
            </div>

            {/* Sort */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              style={{
                padding: "10px 12px",
                border: "1px solid rgba(201,168,124,0.4)",
                borderRadius: "9px",
                fontSize: "12px",
                background: "#FBF7F2",
                color: "#5C3A1E",
                fontFamily: "sans-serif",
                outline: "none",
                cursor: "pointer",
              }}
            >
              <option value="default">Sort: Default</option>
              <option value="name-az">Name A – Z</option>
              <option value="name-za">Name Z – A</option>
              <option value="origin">Origin</option>
            </select>

            {/* View toggle */}
            <div
              style={{
                display: "flex",
                border: "1px solid rgba(201,168,124,0.4)",
                borderRadius: "9px",
                overflow: "hidden",
              }}
            >
              {[
                ["grid", "⊞"],
                ["list", "☰"],
              ].map(([mode, icon]) => (
                <button
                  key={mode}
                  onClick={() => setViewMode(mode)}
                  style={{
                    padding: "9px 14px",
                    background: viewMode === mode ? "#2C1A0E" : "transparent",
                    border: "none",
                    color: viewMode === mode ? "#C9A87C" : "#9C6B3C",
                    cursor: "pointer",
                    fontSize: "14px",
                  }}
                >
                  {icon}
                </button>
              ))}
            </div>

            {/* Clear filters */}
            {activeFiltersCount > 0 && (
              <button
                onClick={clearAll}
                style={{
                  padding: "9px 14px",
                  background: "#F5EFE6",
                  border: "1px solid rgba(201,168,124,0.4)",
                  borderRadius: "9px",
                  fontSize: "11px",
                  fontWeight: "700",
                  color: "#5C3A1E",
                  fontFamily: "sans-serif",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "5px",
                }}
              >
                ✕ Clear ({activeFiltersCount})
              </button>
            )}

            {/* Result count */}
            <span
              style={{
                fontSize: "12px",
                color: "#9C6B3C",
                fontFamily: "sans-serif",
                marginLeft: "auto",
                whiteSpace: "nowrap",
              }}
            >
              Showing{" "}
              <strong style={{ color: "#0F0D0B" }}>{filtered.length}</strong> of{" "}
              {ALL_PRODUCTS.length}
            </span>
          </div>

          {/* Active filter chips */}
          {(selectedTags.length > 0 ||
            selectedGrades.length > 0 ||
            selectedMethods.length > 0 ||
            showFeaturedOnly) && (
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: "7px",
                marginBottom: "16px",
              }}
            >
              {showFeaturedOnly && (
                <span
                  style={{
                    fontSize: "11px",
                    padding: "4px 12px",
                    borderRadius: "100px",
                    background: "#2C1A0E",
                    color: "#C9A87C",
                    fontFamily: "sans-serif",
                    fontWeight: "600",
                    display: "flex",
                    alignItems: "center",
                    gap: "5px",
                  }}
                >
                  ★ Featured{" "}
                  <button
                    onClick={() => setShowFeaturedOnly(false)}
                    style={{
                      background: "transparent",
                      border: "none",
                      color: "#C9A87C",
                      cursor: "pointer",
                      fontSize: "12px",
                      lineHeight: 1,
                      padding: "0 0 0 2px",
                    }}
                  >
                    ✕
                  </button>
                </span>
              )}
              {[...selectedTags, ...selectedGrades, ...selectedMethods].map(
                (f) => (
                  <span
                    key={f}
                    style={{
                      fontSize: "11px",
                      padding: "4px 12px",
                      borderRadius: "100px",
                      background: "#F5EFE6",
                      color: "#5C3A1E",
                      border: "1px solid rgba(201,168,124,0.4)",
                      fontFamily: "sans-serif",
                      fontWeight: "600",
                      display: "flex",
                      alignItems: "center",
                      gap: "5px",
                    }}
                  >
                    {f}{" "}
                    <button
                      onClick={() => {
                        toggleTag(f);
                        toggleGrade(f);
                        toggleMethod(f);
                      }}
                      style={{
                        background: "transparent",
                        border: "none",
                        color: "#9C6B3C",
                        cursor: "pointer",
                        fontSize: "12px",
                        lineHeight: 1,
                      }}
                    >
                      ✕
                    </button>
                  </span>
                ),
              )}
            </div>
          )}

          {/* Products Grid */}
          {filtered.length === 0 ? (
            <div
              style={{
                textAlign: "center",
                padding: "64px 24px",
                background: "white",
                borderRadius: "16px",
                border: "1px solid rgba(201,168,124,0.25)",
              }}
            >
              <div style={{ fontSize: "48px", marginBottom: "16px" }}>🌿</div>
              <p
                style={{
                  fontFamily: "Georgia,serif",
                  fontSize: "18px",
                  color: "#0F0D0B",
                  marginBottom: "8px",
                }}
              >
                No products found
              </p>
              <p
                style={{
                  fontSize: "13px",
                  color: "#9C6B3C",
                  fontFamily: "sans-serif",
                }}
              >
                Try adjusting your filters or search query
              </p>
              <button
                onClick={clearAll}
                style={{
                  marginTop: "16px",
                  padding: "11px 24px",
                  background: "#2C1A0E",
                  color: "#C9A87C",
                  border: "none",
                  borderRadius: "9px",
                  fontWeight: "700",
                  fontSize: "12px",
                  fontFamily: "sans-serif",
                  cursor: "pointer",
                }}
              >
                Clear All Filters
              </button>
            </div>
          ) : viewMode === "grid" ? (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill,minmax(240px,1fr))",
                gap: "16px",
              }}
            >
              {filtered.map((p) => (
                <ProductCard
                  key={p.id}
                  product={p}
                  onInquire={setInquiryProduct}
                />
              ))}
            </div>
          ) : (
            <div
              style={{ display: "flex", flexDirection: "column", gap: "12px" }}
            >
              {filtered.map((p) => {
                const gc = GRADE_COLORS[p.grade] || GRADE_COLORS.Export;
                return (
                  <div
                    key={p.id}
                    style={{
                      background: "white",
                      borderRadius: "14px",
                      border: "1px solid rgba(201,168,124,0.25)",
                      padding: "16px 20px",
                      display: "flex",
                      gap: "16px",
                      alignItems: "center",
                    }}
                  >
                    <div
                      style={{
                        width: "80px",
                        height: "80px",
                        borderRadius: "12px",
                        overflow: "hidden",
                        flexShrink: 0,
                        background: "#F5EFE6",
                      }}
                    >
                      <img
                        src={p.img}
                        alt={p.name}
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                        }}
                        onError={(e) => {
                          e.target.style.display = "none";
                        }}
                      />
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "8px",
                          marginBottom: "4px",
                          flexWrap: "wrap",
                        }}
                      >
                        <h3
                          style={{
                            fontFamily: "Georgia,serif",
                            fontSize: "15px",
                            fontWeight: "700",
                            color: "#0F0D0B",
                            margin: 0,
                          }}
                        >
                          {p.name}
                        </h3>
                        <span
                          style={{
                            fontSize: "9px",
                            padding: "2px 8px",
                            borderRadius: "100px",
                            background: gc.bg,
                            color: gc.text,
                            border: `1px solid ${gc.border}`,
                            fontFamily: "sans-serif",
                            fontWeight: "700",
                          }}
                        >
                          {p.grade}
                        </span>
                        {p.featured && (
                          <span
                            style={{
                              fontSize: "9px",
                              padding: "2px 8px",
                              borderRadius: "100px",
                              background: "#2C1A0E",
                              color: "#C9A87C",
                              fontFamily: "sans-serif",
                              fontWeight: "700",
                            }}
                          >
                            ★ Featured
                          </span>
                        )}
                      </div>
                      <p
                        style={{
                          fontSize: "11px",
                          color: "#9C6B3C",
                          fontStyle: "italic",
                          margin: "0 0 6px",
                          fontFamily: "sans-serif",
                        }}
                      >
                        {p.botanical} · {p.origin}
                      </p>
                      <div
                        style={{
                          display: "flex",
                          gap: "6px",
                          flexWrap: "wrap",
                        }}
                      >
                        <span
                          style={{
                            fontSize: "10px",
                            padding: "2px 8px",
                            background: "#F5EFE6",
                            color: "#5C3A1E",
                            borderRadius: "5px",
                            fontFamily: "sans-serif",
                            fontWeight: "600",
                          }}
                        >
                          {p.method}
                        </span>
                        <span
                          style={{
                            fontSize: "10px",
                            padding: "2px 8px",
                            background: "#F5EFE6",
                            color: "#5C3A1E",
                            borderRadius: "5px",
                            fontFamily: "sans-serif",
                            fontWeight: "600",
                          }}
                        >
                          MOQ: {p.moq}
                        </span>
                        {p.tags.slice(0, 2).map((t) => (
                          <span
                            key={t}
                            style={{
                              fontSize: "10px",
                              padding: "2px 7px",
                              border: "1px solid rgba(201,168,124,0.35)",
                              borderRadius: "4px",
                              color: "#9C6B3C",
                              fontFamily: "sans-serif",
                            }}
                          >
                            {t}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div style={{ display: "flex", gap: "8px", flexShrink: 0 }}>
                      <button
                        onClick={() => setInquiryProduct(p)}
                        style={{
                          padding: "9px 18px",
                          background: "#2C1A0E",
                          color: "#C9A87C",
                          border: "none",
                          borderRadius: "8px",
                          fontSize: "11px",
                          fontWeight: "700",
                          letterSpacing: "0.1em",
                          textTransform: "uppercase",
                          fontFamily: "sans-serif",
                          cursor: "pointer",
                        }}
                      >
                        Inquire
                      </button>
                      <button
                        style={{
                          padding: "9px 12px",
                          background: "transparent",
                          border: "1px solid rgba(201,168,124,0.4)",
                          borderRadius: "8px",
                          fontSize: "11px",
                          color: "#5C3A1E",
                          fontFamily: "sans-serif",
                          cursor: "pointer",
                        }}
                      >
                        COA
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Bottom CTA banner */}
          {filtered.length > 0 && (
            <div
              style={{
                marginTop: "32px",
                background: "#2C1A0E",
                borderRadius: "20px",
                padding: "32px",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                flexWrap: "wrap",
                gap: "20px",
                border: "1px solid rgba(201,168,124,0.15)",
                position: "relative",
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  position: "absolute",
                  top: "-40px",
                  right: "-40px",
                  width: "200px",
                  height: "200px",
                  borderRadius: "50%",
                  background: "rgba(156,107,60,0.08)",
                  pointerEvents: "none",
                }}
              />
              <div>
                <p
                  style={{
                    fontFamily: "Georgia,serif",
                    fontSize: "20px",
                    fontWeight: "700",
                    color: "white",
                    margin: "0 0 6px",
                  }}
                >
                  Can't find what you're looking for?
                </p>
                <p
                  style={{
                    fontSize: "13px",
                    color: "rgba(201,168,124,0.75)",
                    fontFamily: "sans-serif",
                    margin: 0,
                  }}
                >
                  We manufacture 200+ essential oils. Contact us for custom
                  sourcing.
                </p>
              </div>
              <div style={{ display: "flex", gap: "10px" }}>
                <button
                  onClick={() =>
                    setInquiryProduct({ name: "Custom Sourcing Request" })
                  }
                  style={{
                    padding: "13px 24px",
                    background: "#C9A87C",
                    color: "#0F0D0B",
                    border: "none",
                    borderRadius: "10px",
                    fontWeight: "700",
                    fontSize: "12px",
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                    fontFamily: "sans-serif",
                    cursor: "pointer",
                  }}
                >
                  Custom Request
                </button>
                <button
                  style={{
                    padding: "13px 24px",
                    background: "transparent",
                    color: "#C9A87C",
                    border: "1px solid rgba(201,168,124,0.35)",
                    borderRadius: "10px",
                    fontWeight: "700",
                    fontSize: "12px",
                    fontFamily: "sans-serif",
                    cursor: "pointer",
                  }}
                >
                  📥 Download Catalog
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ── CERTIFICATIONS FOOTER STRIP ──────────────────────────────────────── */}
      <div
        style={{
          background: "white",
          borderTop: "1px solid rgba(201,168,124,0.2)",
          padding: "20px 24px",
          marginTop: "8px",
        }}
      >
        <div
          style={{
            maxWidth: "1280px",
            margin: "0 auto",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "32px",
            flexWrap: "wrap",
          }}
        >
          {[
            "ISO 9001:2015 Certified",
            "GMP Certified",
            "GC/MS Verified",
            "HACCP Compliant",
            "IFRA Certified",
            "FDA Compliant",
            "EU Cosmetics Reg.",
          ].map((b) => (
            <span
              key={b}
              style={{
                fontSize: "11px",
                fontWeight: "600",
                color: "#5C3A1E",
                fontFamily: "sans-serif",
                display: "flex",
                alignItems: "center",
                gap: "5px",
              }}
            >
              <span style={{ color: "#9C6B3C" }}>✓</span> {b}
            </span>
          ))}
        </div>
      </div>

      {/* ── INQUIRY MODAL ─────────────────────────────────────────────────────── */}
      {inquiryProduct && (
        <InquiryModal
          product={inquiryProduct}
          onClose={() => setInquiryProduct(null)}
        />
      )}
    </div>
  );
}

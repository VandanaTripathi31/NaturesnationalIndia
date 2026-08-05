/**
 * Long-form SEO content shown beneath the product listing on category pages,
 * keyed by the category's canonical slug. This mirrors the live site, where
 * each category has editorial copy (headings, paragraphs, lists, FAQ) below
 * the grid.
 *
 * CategoryPageView renders CATEGORY_CONTENT[slug] when present; otherwise it
 * falls back to the plain `category.description` from MongoDB. To make this
 * dashboard-editable later, this map can be promoted to a database collection
 * without changing the renderer — it only consumes the block shape below.
 *
 * Block types: { type: "heading" | "subheading" | "paragraph" | "list" | "faq" }
 */

export const CATEGORY_CONTENT = {
  "pure-and-natural-essential-oils": {
    title:
      "Pure Natural Essential Oils: Elixirs of Aroma, Health, and Flavor From Nature's Natural India!",
    blocks: [
      {
        type: "paragraph",
        text: "Nature's Natural India spearheads natural essential oil bulk manufacturers and suppliers. It offers 100% pure essential oils extracted from diverse botanicals such as flowers, fruit and fruit peels, beans, grass, resin, leaves, roots, wood, and bark. Natural essential oils are volatile and contain different molecules. They are named after the plant name and parts from which they are derived.",
      },
      { type: "heading", text: "Aromatherapy Oil Manufacturers" },
      {
        type: "paragraph",
        text: "Aromatherapy oil manufacturers are specialized producers of essential oils and aromatic compounds designed for therapeutic and holistic wellness applications. These manufacturers source high-quality botanical ingredients from around the world to create a diverse range of products that cater to various health and wellness needs. The production process involves meticulous extraction techniques, such as steam distillation or cold pressing, to preserve the natural essence and potency of the oils. Quality control is a critical aspect, ensuring that each batch meets stringent standards for purity and efficacy. As the demand for natural and holistic health solutions grows, aromatherapy oil manufacturers continue to innovate, offering blends that target specific physical, emotional, and psychological benefits. Their products are widely used in spas, wellness centers, and by individuals seeking natural remedies to enhance their well-being.",
      },
      { type: "heading", text: "Aromatherapy Oil Suppliers" },
      {
        type: "paragraph",
        text: "Aromatherapy oil suppliers play a crucial role in the wellness and healthcare industries by providing a wide range of essential oils and aromatic products to various markets. These suppliers source their oils from reputable manufacturers who use high-quality botanical ingredients and advanced extraction techniques to ensure purity and potency. They cater to diverse clients, including spas, wellness centres, retailers, and individual consumers, offering products that support physical, emotional, and mental well-being. Aromatherapy oil suppliers also provide valuable information and guidance on essential oils' proper use and benefits, helping customers make informed choices. By maintaining robust supply chains and adhering to strict quality standards, they consistently provide premium aromatherapy products that meet the growing demand for natural and holistic health solutions.",
      },
      { type: "heading", text: "Use of essential oils?" },
      {
        type: "paragraph",
        text: "Pure natural essential oils offer woody, herbaceous, medicinal, resinous, minty, spicy, floral, citrus, or smoky aromas with top, middle, or base notes. They enhance the taste of food and beverage items. They offer great therapeutic and wellness benefits. Some natural essential oils act as insecticides, germicides, and insect repellents.",
      },
      {
        type: "paragraph",
        text: "Several plant parts have been used as folk medicines in different civilizations. Essential oils offer the essence of those medicinally and aromatically useful botanicals in concentrated form. Essential oil manufacturers obtain essential oils by different extraction methods, depending on the nature of plant material and viability. They generally deploy a steam distillation process followed by cold-press, solvent extraction, CO2 extraction, and hot-fat or cold-fat extraction.",
      },
      {
        type: "paragraph",
        text: "Though essential oils find wide application in aromatherapy, they are used as components in many end products. The end products include perfumes, cosmetics, nutraceutical products, food and beverage items, diffuser blends, scented candles, massage oils, insect repellents, herbal formulations, cleaning solutions, detergents, toiletries, hair care products, and many others. The essential oil wholesale suppliers essential oils to users for aroma, wellness, flavor, insect-repelling, and cleaning purposes in end products.",
      },
      { type: "heading", text: "Use of Essential Oils in Aromatherapy" },
      {
        type: "paragraph",
        text: "Essential oils are integral to aromatherapy, harnessing the natural potency of plant extracts to enhance physical, emotional, and mental well-being. By diffusing essential oils like lavender and chamomile, individuals can create a calming atmosphere that alleviates stress and promotes relaxation. Oils such as peppermint and rosemary invigorate the senses, boosting mental clarity and concentration. Additionally, essential oils like eucalyptus and ginger provide relief from muscle tension and respiratory issues, while tea tree and geranium address skin concerns with their therapeutic properties. Through various methods like diffusion, topical application, and baths, aromatherapy utilizes these concentrated oils to offer a holistic approach to wellness, improving mood, alleviating pain, and supporting overall health.",
      },
      { type: "heading", text: "Use of Essential oils in the Cosmetic industry" },
      {
        type: "paragraph",
        text: "Essential oils play a significant role in the cosmetic industry, offering a range of benefits and applications. Here's how they are used:",
      },
      {
        type: "list",
        items: [
          "Aromatherapy and Fragrance: Essential oils are widely used to add natural scents to cosmetic products, enhancing their sensory appeal — perfumes, body lotions, and shampoos.",
          "Skin Care: Oils such as tea tree, lavender, and rose hip help address acne, aging, and dryness with anti-inflammatory, antiseptic, and antioxidant benefits.",
          "Hair Care: Peppermint, rosemary, and chamomile are used for stimulating and conditioning effects — promoting hair growth, reducing dandruff, and improving scalp health.",
          "Anti-aging: Frankincense, geranium, and sandalwood promote skin regeneration, reduce the appearance of wrinkles, and improve skin elasticity.",
          "Custom Formulations: Essential oils are blended into custom formulations tailored to calming, invigorating, or moisturizing needs.",
        ],
      },
      { type: "heading", text: "Use of Essential Oil in Foods and Beverages" },
      {
        type: "paragraph",
        text: "Essential oils are concentrated extracts derived from various parts of plants, including leaves, flowers, fruits, and roots. Their vibrant flavors and therapeutic properties make them valuable in the culinary world — for natural flavoring, intense concentration, and consistency of flavor across batches, as well as enhancing aroma and offering digestive, antimicrobial, and natural-preservative benefits across baking, beverages, and confectionery.",
      },
      {
        type: "heading",
        text: "Essential Oils Categorized by Aroma: A Guide to Fragrance-Based Classification",
      },
      {
        type: "list",
        items: [
          "Medicinal Essential Oil: eucalyptus, ravintsara, ravensara, camphor, thuja, thyme, basil — ease respiratory disorders and feature in inhalers, rubs, and blends.",
          "Citrus Essential Oil: lime, lemon, bergamot, grapefruit, orange, tangerine, mandarin, lemongrass — refreshing, deodorizing, germicidal.",
          "Floral Essential Oil: lavender, rose otto, frangipani, chamomile, ylang-ylang, orange blossom — sweet floral aromas for perfumery and cosmetics.",
          "Herbaceous / Leafy Essential Oil: rosemary, tea tree, betel leaf, cypriol, oregano, marjoram, cypress — wellness benefits for skin, hair, and digestion.",
          "Woody Essential Oil: cedarwood, guaiac wood, palo santo, rosewood, birch, sandalwood, agarwood, hinoki — masculine perfumery and herbal formulations.",
          "Minty Essential Oil: peppermint, spearmint, corn mint — cooling, refreshing, used in dental care, confectionery, and toiletries.",
        ],
      },
      { type: "heading", text: "Service Areas to Supply Essential Oil" },
      {
        type: "paragraph",
        text: "At Natures Natural India, we take pride in offering the best natural essential oil collection that is pure, authentic, and carefully sourced from nature's finest botanicals. Whether you are looking for aromatherapy, skincare, or wellness solutions, our range ensures unmatched quality and therapeutic benefits. As a trusted supplier and exporter, we provide premium-grade oils to meet both personal and bulk requirements.",
      },
      {
        type: "paragraph",
        text: "For those seeking the best essential oil wholesaler and supplier, we proudly serve the United States, Canada, the United Kingdom, Saudi Arabia, Germany, South Korea, Brazil, Romania, Poland, Turkey, Spain, Thailand, Egypt, Japan, China, Ukraine, Armenia, Nigeria, Vietnam, Iran, and many other countries around the globe.",
      },
      { type: "heading", text: "Frequently Asked Questions" },
      {
        type: "faq",
        q: "Q1: Who is the best essential oil manufacturer and exporter in India?",
        a: "Natures Natural India is widely recognized as a leading and among the best essential oil manufacturers and exporters in India, specialising in pure essential oil wholesale and 100% pure, authentic oils that meet stringent international standards.",
      },
      {
        type: "faq",
        q: "Q2: Are you among the leading essential oils suppliers in India for wholesale and bulk purchases?",
        a: "Yes. We specialise in essential oil wholesale India solutions for businesses worldwide, whether you need pure essential oils wholesale or natural essential oils in large quantities.",
      },
      {
        type: "faq",
        q: "Q3: Can I buy organic essential oils online from Natures Natural India?",
        a: "Absolutely — you can purchase our certified organic essential oils and a wide range of other essential oils online directly through our website.",
      },
      {
        type: "faq",
        q: "Q4: Do you supply aroma oils in addition to pure essential oils?",
        a: "Yes. Alongside pure essential oils, we serve as dedicated aroma oil suppliers, offering high-quality aroma oil options for various aromatic needs.",
      },
      {
        type: "faq",
        q: "Q5: What makes Natures Natural India one of the best essential oil manufacturers for aromatherapy?",
        a: "Our focus on purity, potency, and natural therapeutic properties makes our oils ideal for therapeutic applications and holistic health practices.",
      },
      {
        type: "faq",
        q: "Q6: What popular essential oils does Natures Natural India offer?",
        a: "Lavender, tea tree, peppermint, eucalyptus, lemon, basil, rosemary, and bergamot oils — all known for their therapeutic benefits and versatility.",
      },
    ],
  },
};

// IMPORTANT: files must sit at  public/images/<filename>  exactly, with
// matching case (linux hosting is case-sensitive — "Drum.jpg" !== "drum.jpg").
// If a tab still shows a "Image not found" placeholder after this change,
// the filename below doesn't match a real file in that folder.
const IMG = "/images";

export const COMPANY_INFO_TABS = [
  {
    id: "order-processing",
    label: "Order Processing",
    blocks: [
      {
        type: "image",
        src: `${IMG}/oil-processing.png`,
        alt: "Order processing steps",
      },
      {
        type: "paragraph",
        text: "Natures Natural India acknowledges the reputation that its clients bear in the market and our well-trained workforce have dedicated itself to sustain it with a mode of service that is centered on the requirements of our clients. The sole urge to serve our clients in the best possible way, along with our years-long experience, made us the first choice of many leading companies across the globe to whom we have successfully delivered essential oils and fragrances.",
      },
      {
        type: "paragraph",
        text: "We are aware of the market competition our clients are in, which pushes us to provide them essential oils at the most affordable prices — notably lower rates than several other contenders — without making any compromise with the quality.",
      },
    ],
  },
  {
    id: "packaging",
    label: "Packaging",
    blocks: [
      {
        type: "paragraph",
        text: "Our packaging facilities are well-equipped, well-designed and automated, giving maximum flexibility to ensure not only the timely dispatch of consignments but also to accommodate last-minute orders. Our expertise in managing both large & bulk orders as well as small retail-based or individual orders in pinch-of-time makes us the preferred essential oils and allied products supplier across the globe.",
      },
      {
        type: "image",
        src: `${IMG}/labelling-img1.png`,
        alt: "Our bottle packaging range",
      },
      {
        type: "heading",
        text: "Bottles Packaging",
      },
      {
        type: "imageText",
        image: {
          src: `${IMG}/labelling-img2.png`,
          alt: "5 ml bottle packaging",
        },
        heading: "Essential Oils / Blends in 5 ML",
        text: [
          "Packed in a 5 ml Amber glass / Cobalt Blue bottle.",
          "Euro dropper and sealable cap.",
          "Label of your design, complete labelling and filling.",
        ],
      },
      {
        type: "imageText",
        image: {
          src: `${IMG}/labelling-img3.png`,
          alt: "10 ml bottle packaging",
        },
        heading: "Essential Oils / Blends in 10 ML",
        text: [
          "Packed in a 10 ml Amber glass / Cobalt Blue bottle.",
          "Euro dropper and sealable cap.",
          "Label of your design and 10 ml outer box of your design.",
          "Complete labelling and filling.",
        ],
        reverse: true,
      },
      {
        type: "imageText",
        image: {
          src: `${IMG}/labelling-img4.png`,
          alt: "15 ml bottle packaging",
        },
        heading: "Essential Oils / Blends in 15 ML",
        text: [
          "Packed in a 15 ml Amber glass / Cobalt Blue bottle.",
          "Euro dropper and sealable cap.",
          "Label of your design and 15 ml outer box of your design.",
          "Complete labelling and filling.",
        ],
      },
      {
        type: "imageText",
        image: {
          src: `${IMG}/labelling-img5.png`,
          alt: "30 ml bottle packaging",
        },
        heading: "Essential Oils / Blends in 30 ML",
        text: [
          "Packed in a 30 ml Amber glass / Cobalt Blue / Amber or Clear PET bottle.",
          "Euro dropper and sealable / disk cap.",
          "Label of your design and outer box of your design.",
          "Complete labelling and filling.",
        ],
        reverse: true,
      },
      {
        type: "image",
        src: `${IMG}/drum.jpg`,
        alt: "Bulk packaging drums",
      },
      {
        type: "paragraph",
        text: "All our products are packed in tamper-proof, sealed and air-tight aluminium bottles of various sizes, further contained in hard-bound corrugated cardboard packaging — neatly and tightly packed to prevent any damage to the consignment during transit.",
      },
    ],
  },
  {
    id: "private-labelling",
    label: "Private Labelling",
    blocks: [
      {
        type: "imageText",
        image: {
          src: `${IMG}/labelling-img1.png`,
          alt: "Private labelling bottles",
        },
        text: [
          "It is a universally accepted fact that a 'Brand' is the medium of connecting a product with its target consumers and hence an integral part of the Sales & Marketing strategy for every enterprise.",
          "We understand how important it is for you to project the image of your esteemed brand with every sale and with each of your marketing campaigns.",
          "You want to reach out to people and want them to remember you — and we help you do exactly that.",
        ],
      },
      {
        type: "heading",
        text: "Top 6 Essential Oil Gift Sets",
      },
      {
        type: "imageText",
        image: {
          src: `${IMG}/labelling-img6.png`,
          alt: "Top 6 essential oil gift set",
        },
        text: [
          "1. Lavender Oil",
          "2. Tea Tree Oil",
          "3. Orange Oil",
          "4. Peppermint Oil",
          "5. Eucalyptus Oil",
          "6. Lemongrass",
        ],
        reverse: true,
      },
      {
        type: "grid",
        items: [
          {
            image: {
              src: `${IMG}/labelling-img6-2.jpg`,
              alt: "Box packaging with foam insert",
            },
            heading: "Box Packaging with Foam Insert",
            text: [
              "Top 4 / 6 / 8 / 10 / 12 / 14 bottles of oil, 10 ml each.",
              "Packed in 10 ml Amber glass bottles with euro dropper and sealable cap.",
              "Label of your design, plain black or printed box, foam insert with printed wrist band.",
            ],
          },
          {
            image: {
              src: `${IMG}/labelling-img7.png`,
              alt: "Essential oil gift set",
            },
            heading:
              "Essential Oil Gift Sets (4 / 6 / 8 / 10 / 12 / 14 pieces)",
            text: [
              "12 / 14 / 24 bottles of oil, 10 ml each.",
              "Packed in 10 ml Amber glass bottles with euro dropper and sealable cap.",
              "Label of your design, boxed as a kit, complete labelling and filling.",
            ],
          },
        ],
      },
    ],
  },
  {
    id: "shipping-preferences",
    label: "Shipping Preferences",
    blocks: [
      {
        type: "paragraph",
        text: "We have partnered with major freight and shipping stalwarts like DHL, FedEx and UPS to meet our delivery-time standards. As per the client's requirement, we dispatch consignments either by sea or by air.",
      },
      {
        type: "paragraph",
        text: "From the moment we receive a patron's order, we are aligned to dispatch it within the next 24 hours and commit to 4–5 working days as the delivery TAT (turn-around time).",
      },
      {
        type: "image",
        src: `${IMG}/shipping.png`,
        alt: "Shipping partners: FedEx, UPS, DHL, EMS",
      },
    ],
  },
  {
    id: "payment-method",
    label: "Payment Method",
    blocks: [
      {
        type: "paragraph",
        text: "Naturesnaturalindia.com is a popular and reputable e-commerce store from where you can purchase organic essential and natural oils at your convenience. Customers can make payments through debit / credit card, PayPal and wire transfer.",
      },
      {
        type: "paragraph",
        text: "Manufacturers and wholesale suppliers can make a safe and secure payment for the desired products. Our shipping options are absolutely secure, ensuring both the safety and privacy of the contents in every consignment sent across the globe, within the promised turn-around time.",
      },
      {
        type: "image",
        src: `${IMG}/payment.png`,
        alt: "Accepted payment methods",
      },
    ],
  },
];

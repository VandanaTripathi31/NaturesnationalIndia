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
      { type: "image", src: `${IMG}/range-img.png`, alt: "Bottle range" },
      { type: "image", src: `${IMG}/drum.jpg`, alt: "Bulk packaging drums" },
      {
        type: "heading",
        text: "Bottles Packaging",
      },
      {
        type: "list",
        items: [
          "5 ML — Essential Oil / Blend packed in a 5 ml Amber glass / Cobalt Blue bottle, with euro dropper and sealable cap, label of your design, complete labelling and filling.",
          "10 ML — Packed in a 10 ml Amber glass / Cobalt Blue bottle, euro dropper and sealable cap, label of your design, 10 ml outer box of your design, complete labelling and filling.",
          "15 ML — Packed in a 15 ml Amber glass / Cobalt Blue bottle, euro dropper and sealable cap, label of your design, 15 ml outer box of your design, complete labelling and filling.",
          "30 ML — Packed in a 30 ml Amber glass / Cobalt Blue / Amber or Clear PET bottle, euro dropper and sealable / disk cap, label of your design, outer box of your design, complete labelling and filling.",
        ],
      },
      {
        type: "heading",
        text: "Packaging Options",
      },
      {
        type: "paragraph",
        text: "Our packaging facilities are well-equipped, well-designed and automated, giving maximum flexibility to ensure not only the timely dispatch of consignments but also to accommodate last-minute orders. Our expertise in managing both large & bulk orders as well as small retail-based or individual orders in pinch-of-time makes us the preferred essential oils and allied products supplier across the globe.",
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
        type: "image",
        src: `${IMG}/labelling-img1.png`,
        alt: "Private labelling bottles",
      },
      {
        type: "paragraph",
        text: "It is a universally accepted fact that a 'Brand' is the medium of connecting a product with its target consumers and hence an integral part of the Sales & Marketing strategy for every enterprise. We understand how important it is for you to project the image of your esteemed brand with every sale and with each of your marketing campaigns.",
      },
      {
        type: "paragraph",
        text: "You want to reach out to people and want them to remember you — and we help you do exactly that. From custom bottles and labels of your design to complete branded outer packaging, our private-labelling service lets you sell our premium oils under your own brand identity.",
      },
    ],
  },
  {
    id: "shipping-preferences",
    label: "Shipping Preferences",
    blocks: [
      {
        type: "image",
        src: `${IMG}/shipping.png`,
        alt: "Shipping partners: FedEx, UPS, DHL, EMS",
      },
      {
        type: "paragraph",
        text: "We have partnered with major freight and shipping stalwarts like DHL, FedEx and UPS to meet our delivery-time standards. As per the client's requirement, we dispatch consignments either by sea or by air.",
      },
      {
        type: "paragraph",
        text: "From the moment we receive a patron's order, we are aligned to dispatch it within the next 24 hours and commit to 4–5 working days as the delivery TAT (turn-around time).",
      },
    ],
  },
  {
    id: "payment-method",
    label: "Payment Method",
    blocks: [
      {
        type: "image",
        src: `${IMG}/payment.png`,
        alt: "Accepted payment methods",
      },
      {
        type: "paragraph",
        text: "Naturesnaturalindia.com is a popular and reputable e-commerce store from where you can purchase organic essential and natural oils at your convenience. Customers can make payments through debit / credit card, PayPal and wire transfer.",
      },
      {
        type: "paragraph",
        text: "Manufacturers and wholesale suppliers can make a safe and secure payment for the desired products. Our shipping options are absolutely secure, ensuring both the safety and privacy of the contents in every consignment sent across the globe, within the promised turn-around time.",
      },
    ],
  },
];

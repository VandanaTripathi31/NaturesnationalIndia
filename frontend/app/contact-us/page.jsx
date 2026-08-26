import Contact from "../../src/views/ContactUs.jsx";

// Page-level metadata for /contact-us. This file must stay a server
// component for Next.js to read the export, so the "use client" directive
// lives on src/views/ContactUs.jsx (which uses hooks) instead.
export const metadata = {
  title: "Contact us - Natures Natural India",
};

export default function Page() {
  return <Contact />;
}

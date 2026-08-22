import { getCategories } from "../src/services/categoryService";
import "./globals.css";
import SiteShell from "../src/components/SiteShell";

export const metadata = {
  title: {
    default: "Natures National",
  },
  description:
    "Premium essential oils, carrier oils, herbal extracts, and natural products for global export.",
  icons: {
    icon: [
      { url: "/images/logo.jpeg" },
      { url: "/images/logo.jpeg", sizes: "16x16", type: "image/png" },
      { url: "/images/logo.jpeg", sizes: "32x32", type: "image/png" },
    ],
    apple: "/apple-touch-icon.png",
  },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export default async function RootLayout({ children }) {
  let categories = [];

  try {
    categories = await getCategories();
  } catch {
    categories = [];
  }

  return (
    <html lang="en">
      <head>
        {/* Google Tag Manager */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
            new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
            j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
            'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
            })(window,document,'script','dataLayer','GTM-NRGQGPXN');`,
          }}
        />
        {/* End Google Tag Manager */}
      </head>
      <body>
        {/* Google Tag Manager (noscript) */}
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-NRGQGPXN"
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}
          />
        </noscript>
        {/* End Google Tag Manager (noscript) */}

        <SiteShell categories={categories}>{children}</SiteShell>
      </body>
    </html>
  );
}

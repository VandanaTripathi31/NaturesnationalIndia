/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
  compress: false,
  async headers() {
    return [
      {
        source: "/_next/static/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable, no-transform",
          },
        ],
      },
    ];
  },
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "res.cloudinary.com" },
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "www.naturesnaturalindia.com" },
      { protocol: "https", hostname: "naturesnaturalindia.com" },
      { protocol: "https", hostname: "*.naturesnaturalindia.com" },
    ],
  },
};

export default nextConfig;

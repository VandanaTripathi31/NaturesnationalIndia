/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "www.naturesnaturalindia.com",
      },
      {
        protocol: "https",
        hostname: "naturesnaturalindia.com",
      },
      {
        protocol: "https",
        hostname: "*.naturesnaturalindia.com",
      },
    ],
  },
};

export default nextConfig;
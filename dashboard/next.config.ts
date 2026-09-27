import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
      {
        protocol: "https",
        hostname: "www.naturesnaturalindia.com",
      },
      {
        protocol: "https",
        hostname: "naturesnaturalindia.com",
      },
    ],
  },
};

export default nextConfig;

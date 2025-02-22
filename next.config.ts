import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */

  async rewrites() {
    return [
      {
        source: "/api/product", // The URL path in your app
        destination:
          "https://glore-bd-backend-node-mongo.vercel.app/api/product", // The external API URL
      },
    ];
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        pathname: "**",
      },
    ],
  },
};

export default nextConfig;

import type { NextConfig } from "next";

/**
 * The portfolio has no backend, so it builds to a fully static `out/` folder.
 * That folder can be served anywhere or deployed straight to Vercel.
 */
const nextConfig: NextConfig = {
  output: "export",
  images: {
    unoptimized: true,
  },
};

export default nextConfig;

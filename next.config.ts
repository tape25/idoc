import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  /* config options here */
  typescript: {
    ignoreBuildErrors: true,
  },
  reactStrictMode: false,
  // Configuration pour Vercel + Supabase
  serverExternalPackages: ["@prisma/client", "bcryptjs"],
};

export default nextConfig;

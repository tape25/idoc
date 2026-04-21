import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  /* config options here */
  typescript: {
    ignoreBuildErrors: true,
  },
  reactStrictMode: false,
  // Configuration pour Vercel + Supabase
  experimental: {
    // Optimisation pour serverless
    serverComponentsExternalPackages: ["@prisma/client", "bcryptjs"],
  },
  // Variables d'environnement exposées au client
  env: {
    NEXTAUTH_URL: process.env.NEXTAUTH_URL,
  },
};

export default nextConfig;

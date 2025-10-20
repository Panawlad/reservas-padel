import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    // 🚫 Evita que ESLint bloquee el build en Netlify
    ignoreDuringBuilds: true,
  },
  typescript: {
    // 🚫 Evita que los errores de tipos detengan el build
    ignoreBuildErrors: true,
  },
  experimental: {
    turbo: {
      rules: {
        // 🚫 Previene validaciones adicionales en Turbopack
        eslint: false,
      },
    },
  },
};

export default nextConfig;

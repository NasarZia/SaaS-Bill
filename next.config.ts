import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Turbopack configuration for proper workspace detection
  // Use absolute path to avoid resolution issues
  turbopack: {
    root: process.cwd(),
  },
};

export default nextConfig;

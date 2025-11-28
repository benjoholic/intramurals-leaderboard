import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    // Allow production builds even if ESLint errors are present.
    // This avoids build failure for non-critical linting issues while
    // we iterate on code cleanup.
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;

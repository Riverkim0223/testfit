import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  poweredByHeader: false,
  reactStrictMode: true,
  outputFileTracingIncludes: {
    "/*": ["./content/test-packs/**/*"],
  },
};

export default nextConfig;

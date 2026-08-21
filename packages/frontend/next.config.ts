import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["@shared/dto"],
};

export default nextConfig;

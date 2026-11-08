import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // Cloud preview host for this VM. Replace when the VM hostname changes.
  allowedDevOrigins: ["pv-6f57eb8110d2-b7c3efcc-45ca-439e-9b4c-493b25de0d0b.style.dev"],
};

export default nextConfig;

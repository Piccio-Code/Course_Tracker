import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  // Specify the root directory to avoid multiple lockfiles warning
  outputFileTracingRoot: path.join(__dirname, ".."),
};

export default nextConfig;

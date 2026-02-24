import type { NextConfig } from "next";

const nextConfig: NextConfig & { turbopack?: { root?: string } } = {
  // Ensure Turbopack uses this folder as the project root (silences lockfile/root warnings)
  // turbopack: {
  //   root: ".",
  // },
};

export default nextConfig;

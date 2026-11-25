// NEXT.JS CONFIG: pins the project root so Next doesn't pick up unrelated lockfiles in parent folders.
import type { NextConfig } from "next";
import path from "node:path";

const nextConfig: NextConfig = {
  turbopack: { root: path.resolve(__dirname) },
};

export default nextConfig;

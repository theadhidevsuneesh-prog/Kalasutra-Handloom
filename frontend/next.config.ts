// NEXT.JS CONFIG: sets the Turbopack root to the repo root so Next can also compile the ../backend folder.
import type { NextConfig } from "next";
import path from "node:path";

const nextConfig: NextConfig = {
  turbopack: { root: path.resolve(__dirname, "..") },
};

export default nextConfig;

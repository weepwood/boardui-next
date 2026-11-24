import type { NextConfig } from "next";
const pages = process.env.PAGES_EXPORT === "1";
const basePath = pages ? (process.env.PAGES_BASE_PATH ?? "/boardui-next") : "";
const nextConfig: NextConfig = {
  reactStrictMode: true,
  ...(pages ? { output: "export", basePath, trailingSlash: true, images: { unoptimized: true } } : {}),
  env: { NEXT_PUBLIC_BASE_PATH: basePath },
  experimental: { optimizePackageImports: ["react-aria-components"] },
};
export default nextConfig;

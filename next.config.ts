import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Turbopack 설정 (Next.js 16+)
  turbopack: {},
  // Docker/Cloud Run 배포용 standalone 출력
  output: "standalone",
};

export default nextConfig;

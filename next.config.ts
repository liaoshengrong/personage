import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  cacheMaxMemorySize: 50,
  eslint: {
    ignoreDuringBuilds: false, // 确保ESLint在构建时生效并且使用项目中的配置
  },
};

export default nextConfig;

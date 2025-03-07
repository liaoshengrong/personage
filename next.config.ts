import type { NextConfig } from "next";
const XlsxWatcherPlugin = require("./plugins/XlsxWatcherPlugin");
const nextConfig: NextConfig = {
  /* config options here */
  cacheMaxMemorySize: 50,
  eslint: {
    ignoreDuringBuilds: false, // 确保ESLint在构建时生效并且使用项目中的配置
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.xxapi.cn",
      },
    ],
  },
  webpack: (config, options) => {
    if (options.dev) {
      config.plugins.push(
        new XlsxWatcherPlugin({
          filePath: "src/config/datalist.xlsx", // 修改为你的 XLSX 文件路径
        })
      );
    }

    return config;
  },
};

export default nextConfig;

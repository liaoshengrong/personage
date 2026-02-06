import type { NextConfig } from "next";
// [已弃用 datalist.xlsx] 不再监听 xlsx 文件变化
// const XlsxWatcherPlugin = require("./plugins/XlsxWatcherPlugin");

const nextConfig: NextConfig = {
  // 设置 Webpack 内存缓存的最大大小（以字节为单位）
  // 默认值为 50 MB，如果设置为 0，则禁用内存缓存
  cacheMaxMemorySize: 50,

  // ESLint 配置
  eslint: {
    // 确保 ESLint 在构建时生效并且使用项目中的配置
    ignoreDuringBuilds: false,
  },
  // 实验性功能配置
  experimental: {
    // 启用 CSS 优化
    optimizeCss: true,
    // 启用客户端分段缓存
    clientSegmentCache: true,
    // 在启动时预加载条目
    preloadEntriesOnStart: true,
    // 启用乐观客户端缓存
    optimisticClientCache: true,
    // 将 ISR（增量静态再生）结果写入磁盘
    isrFlushToDisk: true,
    // 自动优化指定包的导入
    optimizePackageImports: ["react", "lodash", "@react-spring/web"],
    // 优化服务器端 React 构建
    optimizeServerReact: true,
    // 启用服务器代码最小化
    serverMinification: true,
  },

  // 图片配置
  images: {
    // 配置远程图片的允许模式
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.xxapi.cn",
      },
      {
        protocol: "http",
        hostname: "mdrs.yuanjin.tech",
      },
    ],
    // 图片格式优化
    formats: ['image/avif', 'image/webp'],
    // 图片尺寸配置
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    // 最小化图片优化
    minimumCacheTTL: 60,
    // 禁用静态图片导入优化（如果需要）
    // dangerouslyAllowSVG: true,
    // contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },

  // 自定义 Webpack 配置
  webpack: (config, options) => {
    // [已弃用 datalist.xlsx] 不再在开发模式监听 xlsx 热更新
    // 如果当前处于开发模式
    // if (options.dev) {
    //   // 添加 XlsxWatcherPlugin 插件以监视 XLSX 文件的变化
    //   config.plugins.push(
    //     new XlsxWatcherPlugin({
    //       filePath: "src/config/datalist.xlsx", // 修改为你的 XLSX 文件路径
    //     })
    //   );
    // }

    // 返回修改后的 Webpack 配置
    return config;
  },
};

export default nextConfig;

/** @type {import('next').NextConfig} */
const path = require("path");
const nextConfig = {
  sassOptions: {
    includePaths: [path.join(__dirname, "styles")],
  },
  output: "export",
  reactStrictMode: false,
  // Enable source map if needed
  productionBrowserSourceMaps: true,
  images: {
    domains: [
      "cdn.waifu.im",
      "power-api.cretinzp.com",
      "images.wallpaperscraft.com",
    ],
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "Access-Control-Allow-Origin",
            value: "*",
          },
          {
            key: "Referrer",
            value: "origin-when-cross-origin",
          },
        ],
      },
    ];
  },
  // async rewrites() {
  //   return [
  //     {
  //       source: '/api',
  //       destination: '/',
  //     },
  //   ]
  // },

  // i18n: {
  //   defaultLocale: 'en',
  //   locales: ['en', 'zh'],
  //   localePath: path.resolve('./public/locales'),
  // },
};

module.exports = nextConfig;

/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: "https://shengrong.netlify.app",
  generateRobotsTxt: true, // 自动生成 robots.txt
  sitemapSize: 5000,
  //   exclude: ["/private-page", "/admin/*"],
  //   changefreq: "daily",
  autoLastmod: true,
  priority: 1,
};

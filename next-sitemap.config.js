/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: "https://your-blog-domain.com",
  generateRobotsTxt: true, // 自动生成 robots.txt
  sitemapSize: 5000,
  exclude: ["/private-page", "/admin/*"],
  // changefreq: 'daily',
  // priority: 0.7,
};

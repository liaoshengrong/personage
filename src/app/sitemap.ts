import { MetadataRoute } from "next";
import data from "@/config/data.json";

const siteUrl = "https://shengrong.netlify.app";

export default function sitemap(): MetadataRoute.Sitemap {
  // 静态页面
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: siteUrl,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: `${siteUrl}/chat`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${siteUrl}/resume`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${siteUrl}/demo`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.6,
    },
    {
      url: `${siteUrl}/tag`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.7,
    },
  ];

  // 动态文章页面
  const articlePages: MetadataRoute.Sitemap = data.map((item, index) => {
    // 解析日期字符串，支持 "YYYY/M/D" 格式
    const dateStr = item.date;
    const [year, month, day] = dateStr.split("/").map(Number);
    const lastModified = new Date(year, month - 1, day); // month 是 0-based
    
    return {
      url: `${siteUrl}/detail/${index}`,
      lastModified: lastModified,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    };
  });

  return [...staticPages, ...articlePages];
}

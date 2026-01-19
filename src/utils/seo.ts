/**
 * SEO 结构化数据工具函数
 */

const SITE_URL = "https://shengrong.netlify.app";
const SITE_NAME = "Mark's space";
const AUTHOR_NAME = "廖声荣";
const AUTHOR_EN_NAME = "Mark Liao";
const AUTHOR_EMAIL = "14796743426@163.com";

/**
 * 生成网站的结构化数据（Person Schema）
 */
export function generatePersonSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    name: AUTHOR_NAME,
    alternateName: AUTHOR_EN_NAME,
    email: AUTHOR_EMAIL,
    url: SITE_URL,
    jobTitle: "高级前端开发工程师",
    worksFor: {
      "@type": "Organization",
      name: "自由职业者",
    },
    alumniOf: {
      "@type": "EducationalOrganization",
      name: "西南科技大学",
    },
    sameAs: [SITE_URL],
    description: "5年前端开发经验，专注于 Next.js、React、TypeScript 等技术栈",
  };
}

/**
 * 生成网站的结构化数据（WebSite Schema）
 */
export function generateWebsiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE_NAME,
    url: SITE_URL,
    description: "Mark的个人博客 - 前端技术分享与学习",
    author: {
      "@type": "Person",
      name: AUTHOR_NAME,
    },
    inLanguage: "zh-CN",
  };
}

/**
 * 生成博客文章的结构化数据（BlogPosting Schema）
 */
export function generateBlogPostSchema({
  title,
  description,
  date,
  url,
}: {
  title: string;
  description: string;
  date: string;
  url: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: title,
    description: description,
    datePublished: new Date(date).toISOString(),
    dateModified: new Date(date).toISOString(),
    author: {
      "@type": "Person",
      name: AUTHOR_NAME,
      email: AUTHOR_EMAIL,
    },
    publisher: {
      "@type": "Person",
      name: AUTHOR_NAME,
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": url,
    },
    url: url,
    inLanguage: "zh-CN",
  };
}

/**
 * 生成面包屑导航的结构化数据（BreadcrumbList Schema）
 */
export function generateBreadcrumbSchema(items: Array<{ name: string; url: string }>) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

/**
 * 生成文章列表页的结构化数据（CollectionPage Schema）
 */
export function generateCollectionPageSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: `${SITE_NAME} - 文章列表`,
    description: "前端技术文章集合",
    url: SITE_URL,
    inLanguage: "zh-CN",
  };
}

import type { Metadata } from "next";
import "./globals.css";
import "animate.css/animate.min.css";
import "tdesign-react/dist/tdesign.css"; // 全局引入所有组件样式代码
import { generatePersonSchema, generateWebsiteSchema } from "@/utils/seo";

const logo = "https://cdn-digital.ssv.qq.com/upload//s2024/s-logo.png";
const siteUrl = "https://shengrong.netlify.app";

export const metadata: Metadata = {
  title: {
    default: "Mark's space",
    template: "%s | Mark's space",
  },
  description: "Mark的个人博客 - 前端技术分享与学习，专注于 Next.js、React、TypeScript 等技术栈",
  keywords: [
    "shengrong",
    "blog",
    "前端",
    "博客",
    "前端开发",
    "Next.js",
    "React",
    "TypeScript",
    "shengrong的个人博客",
    "Mark的个人博客",
    "前端技术",
    "前端学习",
  ],
  authors: [{ name: "廖声荣", nameAlternate: "Mark Liao" }],
  creator: "廖声荣",
  publisher: "Mark Liao",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(siteUrl),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "zh_CN",
    url: siteUrl,
    title: "Mark's space - 个人博客",
    description: "前端人员进入就能学习到新知识的个人网站，欢迎来到我的博客！",
    siteName: "Mark's space",
    images: [
      {
        url: logo,
        width: 1200,
        height: 630,
        alt: "Mark's space logo",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Mark's space - 个人博客",
    description: "前端技术分享与学习",
    images: [logo],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    // 如果需要验证，可以添加
    // google: "your-google-verification-code",
    // yandex: "your-yandex-verification-code",
  },
};

type Props = Readonly<{
  children: React.ReactNode;
}>;

export default function RootLayout({ children }: Props) {
  const personSchema = generatePersonSchema();
  const websiteSchema = generateWebsiteSchema();

  return (
    <html lang="zh-CN">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
        />
      </head>
      <body>{children}</body>
    </html>
  );
}

import type { Metadata } from "next";
import "./globals.css";
import "animate.css/animate.min.css";
import "tdesign-react/dist/tdesign.css"; // 全局引入所有组件样式代码
import { generatePersonSchema, generateWebsiteSchema } from "@/utils/seo";

const logo = "https://cdn-digital.ssv.qq.com/upload//s2024/s-logo.png";
const siteUrl = "https://shengrong.netlify.app";

export const metadata: Metadata = {
  title: {
    default: "Mark's space - 前端技术博客 | 5年前端开发经验分享",
    template: "%s | Mark's space",
  },
  description: "Mark的个人技术博客 - 5年前端开发经验分享，专注 Next.js、React、TypeScript、Taro 等技术栈。涵盖前端工程化、浏览器原理、小程序开发、性能优化等实战经验与学习心得。",
  keywords: [
    "前端开发",
    "前端技术博客",
    "Next.js",
    "React",
    "TypeScript",
    "Taro",
    "前端工程化",
    "浏览器原理",
    "小程序开发",
    "前端性能优化",
    "Mark的个人博客",
    "廖声荣",
    "前端学习",
    "技术分享",
    "前端面试",
    "前端实战",
  ],
  authors: [{ name: "廖声荣" }],
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
    title: "Mark's space - 前端技术博客 | 5年前端开发经验分享",
    description: "5年前端开发工程师的技术博客，分享 Next.js、React、TypeScript、Taro 等前端技术实战经验。涵盖工程化实践、浏览器原理、小程序开发、性能优化等深度内容，助力前端开发者成长。",
    siteName: "Mark's space",
    images: [
      {
        url: logo,
        width: 1200,
        height: 630,
        alt: "Mark's space - 前端技术博客",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Mark's space - 前端技术博客",
    description: "5年前端开发经验分享，专注 Next.js、React、TypeScript、Taro 等技术栈实战经验",
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

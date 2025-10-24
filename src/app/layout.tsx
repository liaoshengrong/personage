import type { Metadata } from "next";
import "./globals.css";
import "animate.css/animate.min.css";
import "tdesign-react/dist/tdesign.css";

const logo = "https://cdn-digital.ssv.qq.com/upload//s2024/s-logo.png";

export const metadata: Metadata = {
  title: "廖声荣的数字空间 - 技术未来",
  description: "通过代码探索技术与创意的边界。廖声荣的现代技术博客，涵盖AI、前端开发和数字创新。",
  keywords: "廖声荣, 技术博客, AI, 前端开发, React, TypeScript, JavaScript, 网页开发, 编程, 数字创新, 技术",
  authors: [{ name: "廖声荣", url: "https://shengrong.netlify.app" }],
  openGraph: {
    type: "website",
    url: "https://shengrong.netlify.app",
    title: "廖声荣的数字空间 - 技术未来",
    description: "通过代码探索技术与创意的边界。现代技术博客，涵盖AI、前端开发和数字创新。",
    siteName: "廖声荣的数字空间",
    images: [{ 
      url: logo,
      width: 1200,
      height: 630,
      alt: "廖声荣的数字空间"
    }],
  },
  twitter: {
    card: "summary_large_image",
    title: "廖声荣的数字空间 - 技术未来",
    description: "通过代码探索技术与创意的边界。",
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
    google: "google-site-verification-code",
  },
};

type Props = Readonly<{
  children: React.ReactNode;
}>;

export default function RootLayout({ children }: Props) {
  return (
    <html lang="zh-CN">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link 
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=JetBrains+Mono:wght@300;400;500;600;700&display=swap" 
          rel="stylesheet" 
        />
        <meta name="theme-color" content="#0f0f23" />
        <meta name="msapplication-TileColor" content="#0f0f23" />
        <link rel="icon" type="image/svg+xml" href="/favicon.ico" />
      </head>
      <body className="gradient-bg">
        <div className="grid-pattern fixed inset-0 pointer-events-none z-0"></div>
        <div className="relative z-10">
          {children}
        </div>
      </body>
    </html>
  );
}

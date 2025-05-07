import type { Metadata } from "next";
import "./globals.css";
import "animate.css/animate.min.css";
import "tdesign-react/dist/tdesign.css"; // 全局引入所有组件样式代码
const logo = "https://cdn-digital.ssv.qq.com/upload//s2024/s-logo.png";

export const metadata: Metadata = {
  title: "Mark's space",
  description: "Mark的个人博客",
  openGraph: {
    type: "website",
    url: "https://shengrong.netlify.app",
    title: "Mark的个人博客",
    description: "前端人员进入就能学习到新知识的个人网站，欢迎来到我的博客！",
    siteName: "Mark",
    images: [{ url: logo }],
  },
};

type Props = Readonly<{
  children: React.ReactNode;
}>;

export default function RootLayout({ children }: Props) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}

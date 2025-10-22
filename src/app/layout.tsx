import type { Metadata } from "next";
import "./globals.css";
import "animate.css/animate.min.css";
import "tdesign-react/dist/tdesign.css";

const logo = "https://cdn-digital.ssv.qq.com/upload//s2024/s-logo.png";

export const metadata: Metadata = {
  title: "Mark's Digital Space - Future of Technology",
  description: "Exploring the frontiers of technology and creativity through code. A modern tech blog by Mark Liao featuring AI, frontend development, and digital innovation.",
  keywords: "Mark Liao, tech blog, AI, frontend development, React, TypeScript, JavaScript, web development, programming, digital innovation, technology",
  authors: [{ name: "Mark Liao", url: "https://shengrong.netlify.app" }],
  openGraph: {
    type: "website",
    url: "https://shengrong.netlify.app",
    title: "Mark's Digital Space - Future of Technology",
    description: "Exploring the frontiers of technology and creativity through code. A modern tech blog featuring AI, frontend development, and digital innovation.",
    siteName: "Mark's Digital Space",
    images: [{ 
      url: logo,
      width: 1200,
      height: 630,
      alt: "Mark's Digital Space"
    }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Mark's Digital Space - Future of Technology",
    description: "Exploring the frontiers of technology and creativity through code.",
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
    <html lang="en">
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

import React, { use } from "react";
import List from "./_components/List";
import Navbar from "./_components/Navbar";
import PageContainer from "./_components/PageContainer";
import FloatingToc from "./_components/FloatingToc";
import { headers } from "next/headers";
import { generateCollectionPageSchema } from "@/utils/seo";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "首页",
  description: "Mark的个人技术博客首页 - 精选前端技术文章集合，涵盖 Next.js、React、TypeScript、Taro、前端工程化、浏览器原理、小程序开发等20+篇深度技术文章，5年前端开发实战经验分享。",
  openGraph: {
    title: "Mark's space - 前端技术博客 | 技术文章集合",
    description: "精选前端技术文章集合，涵盖 Next.js、React、TypeScript、Taro、前端工程化、浏览器原理等深度内容，5年前端开发实战经验分享。",
    type: "website",
  },
};

const Index = () => {
  const { get } = use(headers());
  const ua = get("user-agent") ?? "";
  console.log(ua);

  // 判断是否为移动端
  const isMobile = ua.includes("Mobile");

  // 生成文章列表页的结构化数据
  const collectionPageSchema = generateCollectionPageSchema();

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(collectionPageSchema, null, 0),
        }}
        suppressHydrationWarning
      />
      <PageContainer>
        <Navbar />
        <List />
        <FloatingToc />
      </PageContainer>
    </>
  );
};

export default Index;

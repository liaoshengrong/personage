import React, { use } from "react";
import List from "./_components/List";
import Navbar from "./_components/Navbar";
import PageContainer from "./_components/PageContainer";
import FloatingToc from "./_components/FloatingToc";
import StructuredDataServer from "./_components/StructuredDataServer";
import { headers } from "next/headers";
import { generateCollectionPageSchema } from "@/utils/seo";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "首页",
  description: "Mark的个人博客 - 前端技术文章集合，包含 Next.js、React、TypeScript、Taro 等技术分享",
  openGraph: {
    title: "Mark's space - 前端技术博客",
    description: "前端技术文章集合，包含 Next.js、React、TypeScript、Taro 等技术分享",
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
      <StructuredDataServer data={collectionPageSchema} />
      <PageContainer>
        <Navbar />
        <List />
        <FloatingToc />
      </PageContainer>
    </>
  );
};

export default Index;

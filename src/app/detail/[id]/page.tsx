import React, { use } from "react";
import PageContainer from "../../_components/PageContainer";
import Navbar from "../../_components/Navbar";
import FloatingToc from "../../_components/FloatingToc";
import data from "@/config/data.json";
import { getDetail } from "../../common/api";
import MDRender from "@/app/_components/MDRender";
import StructuredDataServer from "@/app/_components/StructuredDataServer";
import { Metadata } from "next";
import { generateBlogPostSchema, generateBreadcrumbSchema } from "@/utils/seo";

interface Props {
  params: Promise<{ id: string }>;
}

const Index = ({ params }: Props) => {
  const { id } = use(params) ?? {};
  const { tag, title } = data[+id];
  const content = use(getDetail(tag, title));
  const articleUrl = `https://shengrong.netlify.app/detail/${id}`;

  // 生成结构化数据
  const blogPostSchema = generateBlogPostSchema({
    title,
    description: data[+id].desc,
    date: data[+id].date,
    url: articleUrl,
  });

  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: "首页", url: "https://shengrong.netlify.app" },
    { name: title, url: articleUrl },
  ]);

  return (
    <>
      <StructuredDataServer data={[blogPostSchema, breadcrumbSchema]} />
      <PageContainer>
        <Navbar />
        <div className="max-w-screen-xl w-full mx-auto animate__animated animate__fadeInUp">
          <article>
            <h1 className="text-2xl font-600 py-5 text-[#6c32fe] border-b-2 border-[#6c32fe] mb-5">
              {title}
            </h1>
            <MDRender content={content} />
          </article>
        </div>
        <FloatingToc currentId={+id} />
      </PageContainer>
    </>
  );
};

export default Index;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const { title, desc, date, tag } = data[+id];
  const articleUrl = `https://shengrong.netlify.app/detail/${id}`;
  const logo = "https://cdn-digital.ssv.qq.com/upload//s2024/s-logo.png";

  return {
    title: title,
    description: desc,
    keywords: [title, tag, "前端", "技术博客", "Mark's space"],
    authors: [{ name: "廖声荣" }],
    openGraph: {
      type: "article",
      locale: "zh_CN",
      url: articleUrl,
      title: title,
      description: desc,
      siteName: "Mark's space",
      publishedTime: new Date(date).toISOString(),
      modifiedTime: new Date(date).toISOString(),
      authors: ["廖声荣"],
      tags: [tag],
      images: [
        {
          url: logo,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: title,
      description: desc,
      images: [logo],
    },
    alternates: {
      canonical: articleUrl,
    },
  };
}

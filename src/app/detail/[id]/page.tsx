import React, { use } from "react";
import PageContainer from "../../_components/PageContainer";
import Navbar from "../../_components/Navbar";
import FloatingToc from "../../_components/FloatingToc";
import ArticleNavigation from "../../_components/ArticleNavigation";
import RelatedArticles from "../../_components/RelatedArticles";
import ReadingProgress from "../../_components/ReadingProgress";
import ArticleMeta from "@/app/_components/ArticleMeta";
import Breadcrumb from "../../_components/Breadcrumb";
import data from "@/config/data.json";
import { getDetail } from "../../common/api";
import MDRender from "@/app/_components/MDRender";
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
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(blogPostSchema, null, 0),
        }}
        suppressHydrationWarning
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbSchema, null, 0),
        }}
        suppressHydrationWarning
      />
      <PageContainer>
        <Navbar />
        <ReadingProgress />
        <div className="max-w-screen-xl w-full mx-auto animate__animated animate__fadeInUp">
          {/* 面包屑导航 */}
          <Breadcrumb articleTitle={title} articleId={+id} />
          
          {/* 文章内容 */}
          <article>
            <h1 className="text-2xl font-600 py-5 text-[#6c32fe] border-b-2 border-[#6c32fe] mb-5">
              {title}
            </h1>
            
            {/* 文章元信息 */}
            <ArticleMeta
              date={data[+id].date}
              tag={tag}
              content={content}
            />
            
              <MDRender content={content} />
          </article>
          
          {/* 上一篇/下一篇导航 */}
          <div className="mt-8">
            <ArticleNavigation currentId={+id} />
            
            {/* 相关文章推荐 */}
            <RelatedArticles currentId={+id} currentTag={tag} />
          </div>
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

  // 根据标签生成相关关键词
  const tagKeywords: Record<string, string[]> = {
    Taro: ["Taro", "微信小程序", "小程序开发", "小程序组件", "Taro框架"],
    engineer: ["前端工程化", "工程化", "自动化", "前端工具", "开发效率"],
    Browser: ["浏览器原理", "浏览器", "浏览器渲染", "浏览器缓存", "事件循环"],
    ajax: ["Ajax", "HTTP", "请求头", "响应头", "流式传输", "SSE"],
    download: ["PDF", "图片下载", "文件下载", "HTML转PDF", "HTML转图片"],
    general: ["前端技术", "前端开发", "前端学习", "技术分享"],
    TS: ["TypeScript", "TS", "类型系统", "TypeScript语法"],
  };

  // 从标题中提取关键词
  const titleKeywords = title
    .replace(/[的|中|与|和]/g, " ")
    .split(/\s+/)
    .filter((word) => word.length > 1);

  // 组合关键词
  const keywords = [
    title,
    ...titleKeywords,
    tag,
    ...(tagKeywords[tag] || []),
    "前端",
    "前端开发",
    "前端技术",
    "技术博客",
    "Mark's space",
    "廖声荣",
    "Next.js",
    "React",
    "TypeScript",
  ];

  // 优化描述：确保包含搜索关键词
  const enhancedDescription = `${desc} 本文详细讲解${title}的实现原理和最佳实践，适合前端开发者学习和参考。`;

  return {
    title: `${title} | Mark's space - 前端技术博客`,
    description: enhancedDescription,
    keywords: [...new Set(keywords)], // 去重
    authors: [{ name: "廖声荣" }],
    openGraph: {
      type: "article",
      locale: "zh_CN",
      url: articleUrl,
      title: `${title} | Mark's space`,
      description: enhancedDescription,
      siteName: "Mark's space",
      publishedTime: new Date(date).toISOString(),
      modifiedTime: new Date(date).toISOString(),
      authors: ["廖声荣"],
      tags: [tag, ...titleKeywords],
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
      title: `${title} | Mark's space`,
      description: enhancedDescription,
      images: [logo],
    },
    alternates: {
      canonical: articleUrl,
    },
  };
}

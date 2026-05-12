import React from "react";
import type { Metadata } from "next";
import { headers } from "next/headers";
import { unstable_cache } from "next/cache";
import Navbar from "../../_components/Navbar";
import PageContainer from "../../_components/PageContainer";
import Breadcrumb from "../../_components/Breadcrumb";
import CacheLabActions from "./_components/CacheLabActions";
import { readCacheLabData } from "./dataSource";

export const metadata: Metadata = {
  title: "缓存实验室",
  description:
    "通过可运行示例理解 Next.js 的 revalidate、revalidateTag、unstable_cache 三种缓存策略。",
};

type SourceData = {
  label: string;
  version: number;
  updatedAt: string;
};

const getUnstableCachedData = unstable_cache(
  async () => {
    return readCacheLabData("unstable_cache");
  },
  ["cache-lab-unstable-key"],
  { revalidate: 3600, tags: ["cache-lab-unstable-tag"] }
);

const getBaseUrl = async () => {
  const headerStore = await headers();
  const host = headerStore.get("host") ?? "localhost:8200";
  const protocol = headerStore.get("x-forwarded-proto") ?? "http";
  return `${protocol}://${host}`;
};

const getFetchWithRevalidate = async (baseUrl: string) => {
  const res = await fetch(`${baseUrl}/study/cache-lab/api/source?label=fetch-revalidate`, {
    next: { revalidate: 15 },
  });
  return (await res.json()) as SourceData;
};

const getFetchWithTag = async (baseUrl: string) => {
  const res = await fetch(`${baseUrl}/study/cache-lab/api/source?label=fetch-tag`, {
    next: { tags: ["cache-lab-fetch-tag"] },
  });
  return (await res.json()) as SourceData;
};

const CacheLabPage = async () => {
  const baseUrl = await getBaseUrl();
  const [fetchRevalidateData, fetchTagData, unstableCachedData] = await Promise.all([
    getFetchWithRevalidate(baseUrl),
    getFetchWithTag(baseUrl),
    getUnstableCachedData(),
  ]);

  const renderedAt = new Date().toLocaleString("zh-CN", { hour12: false });

  return (
    <PageContainer className="bg-gradient-to-br from-slate-50 via-white to-indigo-50 min-h-screen">
      <Navbar />
      <main className="max-w-5xl mx-auto px-4 sm:px-6 pb-12 pt-4 sm:pt-6">
        <div className="max-w-screen-xl mx-auto">
          <Breadcrumb />
        </div>

        <section className="mt-4 rounded-2xl border border-indigo-100 bg-white p-5 sm:p-7 shadow-sm">
          <p className="text-xs sm:text-sm text-indigo-600 font-semibold tracking-wide">
            NEXT.JS CACHE LAB
          </p>
          <h1 className="mt-2 text-2xl sm:text-3xl font-bold text-slate-900">
            revalidate / revalidateTag / unstable_cache 实验室
          </h1>
          <p className="mt-3 text-sm sm:text-base text-slate-600 leading-7">
            当前页面渲染时间：{renderedAt}。先点击“更新数据源”，再观察三个卡片是否变化，
            你会看到三种缓存策略在失效时机上的明显差异。
          </p>
        </section>

        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          <article className="rounded-xl border border-indigo-100 bg-indigo-50 p-4">
            <p className="text-xs font-semibold text-indigo-600">fetch + next.revalidate</p>
            <h2 className="mt-2 text-sm font-semibold text-slate-900">
              每 15 秒自动过期（时间驱动）
            </h2>
            <p className="mt-3 text-sm text-slate-700">version: {fetchRevalidateData.version}</p>
            <p className="mt-1 text-xs text-slate-600">
              data.updatedAt: {fetchRevalidateData.updatedAt}
            </p>
          </article>

          <article className="rounded-xl border border-cyan-100 bg-cyan-50 p-4">
            <p className="text-xs font-semibold text-cyan-600">fetch + next.tags</p>
            <h2 className="mt-2 text-sm font-semibold text-slate-900">
              只有触发 revalidateTag 才更新（标签驱动）
            </h2>
            <p className="mt-3 text-sm text-slate-700">version: {fetchTagData.version}</p>
            <p className="mt-1 text-xs text-slate-600">data.updatedAt: {fetchTagData.updatedAt}</p>
          </article>

          <article className="rounded-xl border border-emerald-100 bg-emerald-50 p-4">
            <p className="text-xs font-semibold text-emerald-600">unstable_cache</p>
            <h2 className="mt-2 text-sm font-semibold text-slate-900">
              缓存任意异步函数（不局限 fetch）
            </h2>
            <p className="mt-3 text-sm text-slate-700">version: {unstableCachedData.version}</p>
            <p className="mt-1 text-xs text-slate-600">
              data.updatedAt: {unstableCachedData.updatedAt}
            </p>
          </article>
        </div>

        <div className="mt-6">
          <CacheLabActions />
        </div>
      </main>
    </PageContainer>
  );
};

export default CacheLabPage;

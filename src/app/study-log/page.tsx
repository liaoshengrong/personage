import React from "react";
import type { Metadata } from "next";
import Navbar from "../_components/Navbar";
import PageContainer from "../_components/PageContainer";
import { studyChatRecords } from "./data";

export const metadata: Metadata = {
  title: "学习对话记录",
  description: "记录学习清单相关问答的结构化页面，便于复盘与持续学习。",
};

const highlightKeywords = [
  "CSR",
  "SSR",
  "RSC",
  "Server Components",
  "Server Component",
  "Client Components",
  "Client Component",
  "App Router",
  "use client",
  "迁移",
  "区别",
  "作用",
  "时间线",
  "性能",
  "首屏",
  "SEO",
  "hydration",
  "SSE",
  "缓存",
];

const escapeRegExp = (value: string) =>
  value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const highlightText = (text: string) => {
  const pattern = new RegExp(
    `(${highlightKeywords.map((item) => escapeRegExp(item)).join("|")})`,
    "gi"
  );
  const segments = text.split(pattern);
  return segments.map((segment, index) => {
    const isKeyword = highlightKeywords.some(
      (keyword) => keyword.toLowerCase() === segment.toLowerCase()
    );
    if (!isKeyword) {
      return <React.Fragment key={`${segment}-${index}`}>{segment}</React.Fragment>;
    }
    return (
      <span
        key={`${segment}-${index}`}
        className="font-semibold text-amber-700 underline decoration-amber-300 decoration-2 underline-offset-2"
      >
        {segment}
      </span>
    );
  });
};

const StudyLogPage = () => {
  return (
    <PageContainer className="bg-gradient-to-br from-slate-50 via-white to-cyan-50 min-h-screen">
      <Navbar />
      <main className="max-w-5xl mx-auto px-4 sm:px-6 pb-12 pt-4 sm:pt-6">
        <section className="rounded-2xl border border-cyan-100 bg-white p-5 sm:p-7 shadow-sm">
          <p className="text-xs sm:text-sm text-cyan-700 font-semibold tracking-wide">
            LEARNING CHAT LOG
          </p>
          <h1 className="mt-2 text-2xl sm:text-3xl font-bold text-slate-900">
            学习对话记录页
          </h1>
          <p className="mt-3 text-sm sm:text-base text-slate-600 leading-7">
            这个页面用于沉淀你和我的学习对话。当你在聊天中发送
            <span className="mx-1 px-2 py-0.5 rounded bg-slate-100 text-slate-800 font-medium">
              --记录
            </span>
            ，我会把该问题的关键结论整理成结构化记录追加到这里。
          </p>
        </section>

        <section className="mt-6 rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-900">使用约定</h2>
          <ul className="mt-3 space-y-2 text-sm text-slate-600">
            <li>- 你正常提问学习问题，我给出解答和练习建议。</li>
            <li>- 你发送 `--记录`，我将总结当次问题并追加到本页。</li>
            <li>- 每条记录都包含：问题、总结、下一步行动。</li>
          </ul>
        </section>

        <section className="mt-6">
          <h2 className="text-lg sm:text-xl font-semibold text-slate-900 mb-3">
            对话记录（{studyChatRecords.length}）
          </h2>
          <div className="space-y-3">
            {studyChatRecords.map((record) => (
              <article
                key={record.id}
                className="rounded-xl border border-slate-100 bg-white p-4 sm:p-5 shadow-sm border-l-4 border-l-cyan-400"
              >
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                  <p className="text-xs text-slate-500">记录时间：{record.date}</p>
                  <span className="w-fit text-xs rounded-full border border-cyan-200 bg-cyan-50 text-cyan-700 px-2.5 py-1">
                    触发词：{record.trigger}
                  </span>
                </div>
                <div className="mt-3">
                  <p className="text-xs inline-flex rounded-full border border-indigo-200 bg-indigo-50 text-indigo-700 px-2 py-0.5 font-semibold">
                    问题
                  </p>
                  <p className="mt-2 text-sm text-slate-700 leading-[1.5] font-medium">
                    {highlightText(record.question)}
                  </p>
                </div>
                <div className="mt-4 rounded-lg border border-sky-100 bg-sky-50 p-3">
                  <p className="text-xs inline-flex rounded-full border border-sky-200 bg-white text-sky-700 px-2 py-0.5 font-semibold">
                    重点总结
                  </p>
                  <ul className="mt-2 space-y-1.5 text-sm text-slate-700 leading-[2]">
                    {record.summary.map((item) => (
                      <li className="leading-[1.3]" key={item}>- {highlightText(item)}</li>
                    ))}
                  </ul>
                </div>
                <div className="mt-4 rounded-lg border border-emerald-100 bg-emerald-50 p-3">
                  <p className="text-xs inline-flex rounded-full border border-emerald-200 bg-white text-emerald-700 px-2 py-0.5 font-semibold">
                    下一步行动
                  </p>
                  <ul className="mt-2 space-y-1.5 text-sm text-emerald-800 leading-[2]">
                    {record.nextActions.map((item) => (
                      <li className="leading-[1.3]" key={item}>- {highlightText(item)}</li>
                    ))}
                  </ul>
                </div>
              </article>
            ))}
          </div>
        </section>
      </main>
    </PageContainer>
  );
};

export default StudyLogPage;

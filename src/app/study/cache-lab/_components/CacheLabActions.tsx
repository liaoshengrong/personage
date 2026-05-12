"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";

const CacheLabActions = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("点击按钮开始实验");

  const run = async (handler: () => Promise<void>) => {
    try {
      setLoading(true);
      await handler();
      router.refresh();
    } catch (error) {
      const text = error instanceof Error ? error.message : "请求失败";
      setMessage(text);
    } finally {
      setLoading(false);
    }
  };

  const mutateSource = () =>
    run(async () => {
      const res = await fetch("/study/cache-lab/api/mutate", { method: "POST" });
      const json = (await res.json()) as {
        ok: boolean;
        data?: { version: number; updatedAt: string };
      };
      if (!json.ok || !json.data) throw new Error("更新数据源失败");
      setMessage(`数据源已更新 -> version: ${json.data.version}`);
    });

  const triggerTag = (tag: string, tagName: string) =>
    run(async () => {
      const res = await fetch("/study/cache-lab/api/revalidate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tag }),
      });
      const json = (await res.json()) as { ok: boolean; message?: string };
      if (!json.ok) throw new Error(json.message ?? "revalidateTag 失败");
      setMessage(`${tagName} 已触发 revalidateTag`);
    });

  return (
    <section className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
      <h2 className="text-lg font-semibold text-slate-900">实验操作台</h2>
      <p className="mt-2 text-sm text-slate-600 leading-7">
        建议顺序：先点“更新数据源”，再观察三个卡片是否刷新；随后分别触发两个 tag，感受按需失效。
      </p>
      <div className="mt-4 flex flex-wrap gap-2">
        <button
          type="button"
          disabled={loading}
          onClick={mutateSource}
          className="px-3 py-2 rounded-lg text-sm border border-indigo-200 bg-indigo-50 text-indigo-700 hover:bg-indigo-100 disabled:opacity-60"
        >
          更新数据源（version++）
        </button>
        <button
          type="button"
          disabled={loading}
          onClick={() => triggerTag("cache-lab-fetch-tag", "fetch tag")}
          className="px-3 py-2 rounded-lg text-sm border border-cyan-200 bg-cyan-50 text-cyan-700 hover:bg-cyan-100 disabled:opacity-60"
        >
          revalidateTag(fetch-tag)
        </button>
        <button
          type="button"
          disabled={loading}
          onClick={() => triggerTag("cache-lab-unstable-tag", "unstable_cache tag")}
          className="px-3 py-2 rounded-lg text-sm border border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 disabled:opacity-60"
        >
          revalidateTag(unstable-tag)
        </button>
      </div>
      <p className="mt-4 text-sm text-slate-700">状态：{message}</p>
    </section>
  );
};

export default CacheLabActions;

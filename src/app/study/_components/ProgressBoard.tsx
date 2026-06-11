"use client";

import React, { useEffect, useMemo, useState } from "react";

type ProgressItem = {
  week: string;
  topic: string;
  deliverable: string;
};

type ProgressState = Record<string, boolean>;

type ProgressBoardProps = {
  items: ProgressItem[];
};

const STORAGE_KEY = "study-plan-progress-v1";

const readStoredProgress = (): ProgressState => {
  try {
    const cache = localStorage.getItem(STORAGE_KEY);
    if (!cache) return {};
    const parsed: unknown = JSON.parse(cache);
    if (parsed && typeof parsed === "object") {
      return parsed as ProgressState;
    }
  } catch (error) {
    console.warn("Failed to read study progress from localStorage.", error);
  }
  return {};
};

const ProgressBoard = ({ items }: ProgressBoardProps) => {
  const [progress, setProgress] = useState<ProgressState>(readStoredProgress);
  const [loaded] = useState(true);

  useEffect(() => {
    if (!loaded) return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  }, [progress, loaded]);

  const completedCount = useMemo(
    () => items.filter((item) => progress[item.week]).length,
    [items, progress]
  );
  const totalCount = items.length;
  const percent = totalCount === 0 ? 0 : Math.round((completedCount / totalCount) * 100);

  const handleToggle = (week: string) => {
    setProgress((prev) => ({
      ...prev,
      [week]: !prev[week],
    }));
  };

  const handleMarkAll = () => {
    const nextState = items.reduce<ProgressState>((acc, item) => {
      acc[item.week] = true;
      return acc;
    }, {});
    setProgress(nextState);
  };

  const handleReset = () => {
    setProgress({});
  };

  return (
    <section className="mt-8 rounded-2xl bg-white border border-slate-100 shadow-sm p-5 sm:p-6">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3">
        <div>
          <h2 className="text-lg sm:text-xl font-semibold text-slate-900">打卡进度版</h2>
          <p className="mt-1 text-sm text-slate-500">
            每完成一个周目标就勾选一次，进度会自动保存在当前浏览器。
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleMarkAll}
            className="text-xs sm:text-sm border border-emerald-200 text-emerald-700 bg-emerald-50 rounded-md px-3 py-1.5 hover:bg-emerald-100 transition-colors"
          >
            全部完成
          </button>
          <button
            type="button"
            onClick={handleReset}
            className="text-xs sm:text-sm border border-slate-200 text-slate-600 bg-slate-50 rounded-md px-3 py-1.5 hover:bg-slate-100 transition-colors"
          >
            重置进度
          </button>
        </div>
      </div>

      <div className="mt-4 rounded-xl border border-indigo-100 bg-indigo-50 p-4">
        <div className="flex items-center justify-between text-sm">
          <span className="text-indigo-700 font-medium">当前完成进度</span>
          <span className="text-indigo-700 font-semibold">
            {completedCount}/{totalCount}（{percent}%）
          </span>
        </div>
        <div className="mt-2 h-2.5 bg-indigo-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-indigo-500 transition-all duration-300"
            style={{ width: `${percent}%` }}
          />
        </div>
      </div>

      <div className="mt-4 grid grid-cols-1 lg:grid-cols-2 gap-3">
        {items.map((item) => {
          const done = !!progress[item.week];
          return (
            <label
              key={item.week}
              className={`rounded-xl border p-4 cursor-pointer transition-colors ${
                done
                  ? "border-emerald-200 bg-emerald-50"
                  : "border-slate-200 bg-slate-50 hover:bg-white"
              }`}
            >
              <div className="flex items-start gap-3">
                <input
                  type="checkbox"
                  checked={done}
                  onChange={() => handleToggle(item.week)}
                  className="mt-1 h-4 w-4 accent-emerald-600"
                />
                <div className="flex-1">
                  <p className="text-sm font-semibold text-slate-900">
                    {item.week} · {item.topic}
                  </p>
                  <p className="mt-1 text-xs sm:text-sm text-slate-600">
                    本周交付：{item.deliverable}
                  </p>
                </div>
              </div>
            </label>
          );
        })}
      </div>
    </section>
  );
};

export default ProgressBoard;

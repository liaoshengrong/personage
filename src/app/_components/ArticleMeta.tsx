"use client";
import dayjs from "dayjs";
import { calculateReadingTime, formatReadingTime } from "@/utils/readingTime";

interface ArticleMetaProps {
  date: string;
  tag: string;
  content: string;
}

const ArticleMeta = ({ date, tag, content }: ArticleMetaProps) => {
  const readingTime = calculateReadingTime(content);

  return (
    <div className="flex flex-wrap items-center gap-4 mb-6 text-sm text-gray-600 pb-4 border-b border-gray-200">
      {/* 发布日期 */}
      <div className="flex items-center gap-2">
        <svg
          className="w-4 h-4 text-gray-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
          />
        </svg>
        <span>{dayjs(date).format("YYYY年MM月DD日")}</span>
      </div>

      {/* 标签 */}
      <div className="flex items-center gap-2">
        <svg
          className="w-4 h-4 text-gray-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
          />
        </svg>
        <span className="inline-block px-2 py-0.5 text-xs bg-[#6c32fe]/10 text-[#6c32fe] rounded-full border border-[#6c32fe]/20">
          {tag}
        </span>
      </div>

      {/* 阅读时间 */}
      <div className="flex items-center gap-2">
        <svg
          className="w-4 h-4 text-gray-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <span>{formatReadingTime(readingTime)}</span>
      </div>
    </div>
  );
};

export default ArticleMeta;

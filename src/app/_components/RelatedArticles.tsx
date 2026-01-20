"use client";
import Link from "next/link";
import data from "@/config/data.json";
import dayjs from "dayjs";

interface RelatedArticlesProps {
  currentId: number;
  currentTag: string;
  maxCount?: number;
}

const RelatedArticles = ({
  currentId,
  currentTag,
  maxCount = 3,
}: RelatedArticlesProps) => {
  // 获取相同标签的文章，排除当前文章
  const relatedArticles = data
    .map((item, index) => ({ ...item, originalIndex: index }))
    .filter(
      (item) =>
        item.originalIndex !== currentId && item.tag === currentTag
    )
    .slice(0, maxCount);

  // 如果相同标签的文章不足，补充其他文章
  if (relatedArticles.length < maxCount) {
    const otherArticles = data
      .map((item, index) => ({ ...item, originalIndex: index }))
      .filter(
        (item) =>
          item.originalIndex !== currentId &&
          item.tag !== currentTag &&
          !relatedArticles.some((ra) => ra.originalIndex === item.originalIndex)
      )
      .slice(0, maxCount - relatedArticles.length);
    relatedArticles.push(...otherArticles);
  }

  if (relatedArticles.length === 0) {
    return null;
  }

  return (
    <div className="mt-12 pt-8 border-t border-gray-200">
      <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
        <svg
          className="w-5 h-5 text-[#6c32fe]"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M13 10V3L4 14h7v7l9-11h-7z"
          />
        </svg>
        相关文章推荐
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {relatedArticles.map((article) => (
          <Link
            key={article.originalIndex}
            href={`/detail/${article.originalIndex}`}
            className="group p-4 border border-gray-200 rounded-lg hover:border-[#6c32fe] hover:shadow-md transition-all duration-200"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="inline-block px-2 py-0.5 text-xs bg-[#6c32fe]/10 text-[#6c32fe] rounded-full border border-[#6c32fe]/20">
                {article.tag}
              </span>
              <span className="text-xs text-gray-400">
                {dayjs(article.date).format("MMM DD, YYYY")}
              </span>
            </div>
            <h3 className="text-base font-medium text-gray-900 group-hover:text-[#6c32fe] transition-colors mb-2 line-clamp-2">
              {article.title}
            </h3>
            <p className="text-sm text-gray-600 line-clamp-2">{article.desc}</p>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default RelatedArticles;

"use client";
import Link from "next/link";
import data from "@/config/data.json";

interface ArticleNavigationProps {
  currentId: number;
}

const ArticleNavigation = ({ currentId }: ArticleNavigationProps) => {
  const prevArticle = currentId > 0 ? data[currentId - 1] : null;
  const nextArticle = currentId < data.length - 1 ? data[currentId + 1] : null;

  if (!prevArticle && !nextArticle) {
    return null;
  }

  return (
    <div className="mt-12 pt-8 border-t border-gray-200 flex flex-col gap-4 sm:flex-row sm:justify-between">
      {/* 上一篇文章 */}
      {prevArticle ? (
        <Link
          href={`/detail/${currentId - 1}`}
          className="group flex-1 p-4 border border-gray-200 rounded-lg hover:border-[#6c32fe] hover:shadow-md transition-all duration-200"
        >
          <div className="flex items-center gap-2 mb-2">
            <svg
              className="w-4 h-4 text-gray-400 group-hover:text-[#6c32fe] transition-colors"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
            <span className="text-sm text-gray-500 group-hover:text-[#6c32fe] transition-colors">
              上一篇文章
            </span>
          </div>
          <h3 className="text-base font-medium text-gray-900 group-hover:text-[#6c32fe] transition-colors line-clamp-2">
            {prevArticle.title}
          </h3>
        </Link>
      ) : (
        <div className="flex-1" />
      )}

      {/* 下一篇文章 */}
      {nextArticle ? (
        <Link
          href={`/detail/${currentId + 1}`}
          className="group flex-1 p-4 border border-gray-200 rounded-lg hover:border-[#6c32fe] hover:shadow-md transition-all duration-200 text-right"
        >
          <div className="flex items-center justify-end gap-2 mb-2">
            <span className="text-sm text-gray-500 group-hover:text-[#6c32fe] transition-colors">
              下一篇文章
            </span>
            <svg
              className="w-4 h-4 text-gray-400 group-hover:text-[#6c32fe] transition-colors"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </div>
          <h3 className="text-base font-medium text-gray-900 group-hover:text-[#6c32fe] transition-colors line-clamp-2">
            {nextArticle.title}
          </h3>
        </Link>
      ) : (
        <div className="flex-1" />
      )}
    </div>
  );
};

export default ArticleNavigation;

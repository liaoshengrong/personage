"use client";
import { useMemo } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import data from "@/config/data.json";

interface BreadcrumbItem {
  name: string;
  href: string;
}

interface BreadcrumbProps {
  items?: BreadcrumbItem[];
  articleTitle?: string;
  articleId?: number;
}

const Breadcrumb = ({ items, articleTitle, articleId }: BreadcrumbProps) => {
  const pathname = usePathname();

  // 如果没有传入items，根据pathname自动生成
  const breadcrumbItems = useMemo(() => {
    if (items) return items;

    const result: BreadcrumbItem[] = [
      { name: "首页", href: "/" }
    ];

    // 处理详情页
    if (pathname.startsWith("/detail/")) {
      if (articleTitle && articleId !== undefined) {
        result.push({
          name: articleTitle,
          href: `/detail/${articleId}`
        });
      } else {
        // 尝试从pathname提取id
        const match = pathname.match(/\/detail\/(\d+)/);
        if (match) {
          const id = parseInt(match[1]);
          if (data[id]) {
            result.push({
              name: data[id].title,
              href: `/detail/${id}`
            });
          }
        }
      }
    } else {
      // 处理其他页面
      const routeMap: Record<string, string> = {
        "/tag": "技能标签",
        "/chat": "个人AI",
        "/resume": "个人简历",
        "/demo": "手写Demo"
      };

      const pageName = routeMap[pathname];
      if (pageName) {
        result.push({
          name: pageName,
          href: pathname
        });
      }
    }

    return result;
  }, [pathname, items, articleTitle, articleId]);

  if (breadcrumbItems.length <= 1) {
    return null; // 只有首页时不显示面包屑
  }

  return (
    <nav className="mb-6" aria-label="面包屑导航">
      <ol className="flex items-center gap-2 text-sm text-gray-600">
        {breadcrumbItems.map((item, index) => {
          const isLast = index === breadcrumbItems.length - 1;
          
          return (
            <li key={item.href} className="flex items-center gap-2">
              {index > 0 && (
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
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              )}
              {isLast ? (
                <span className="text-gray-900 font-medium">{item.name}</span>
              ) : (
                <Link
                  href={item.href}
                  className="hover:text-[#6c32fe] transition-colors duration-200"
                >
                  {item.name}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
};

export default Breadcrumb;

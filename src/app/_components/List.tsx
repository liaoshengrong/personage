"use client";
import data from "@/config/data.json";
import { useEffect, useRef, useState, useMemo } from "react";
import MDRender from "./MDRender";
import Perview from "./Perview";
import { useRouter } from "next/navigation";
import { useMobile } from "../hooks/useMobile";

const List = () => {
  const isMobile = useMobile();

  const [isChoose, setIsChoose] = useState<boolean>(false);
  const [chooseData, setChooseData] = useState<DataType>();
  const [height, setHeight] = useState<number>(0);
  const [mdContent, setMdContent] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [selectedTag, setSelectedTag] = useState<string>("");
  const ref = useRef<HTMLDivElement>(null);
  const router = useRouter();

  // 获取所有唯一的标签
  const allTags = useMemo(() => {
    const tags = new Set(data.map((item) => item.tag));
    return Array.from(tags).sort();
  }, []);

  // 过滤数据
  const filteredData = useMemo(() => {
    return data
      .map((item, index) => ({ ...item, originalIndex: index }))
      .filter((item) => {
        // 标签筛选
        if (selectedTag && item.tag !== selectedTag) {
          return false;
        }
        // 搜索筛选
        if (searchTerm) {
          const lowerSearchTerm = searchTerm.toLowerCase();
          return (
            item.title.toLowerCase().includes(lowerSearchTerm) ||
            item.desc.toLowerCase().includes(lowerSearchTerm) ||
            item.tag.toLowerCase().includes(lowerSearchTerm)
          );
        }
        return true;
      });
  }, [searchTerm, selectedTag]);

  const onChoose = (item: DataType, index: number) => {
    if (isMobile) {
      router.push(`/detail/${index}`);
      return;
    }
    if (item.title === chooseData?.title) {
      setIsChoose(false);
      setTimeout(() => {
        setChooseData(undefined);
      }, 1000);
    } else {
      setChooseData(item);
      setIsChoose(true);
    }
  };

  useEffect(() => {
    if (ref.current) {
      setHeight(ref.current.offsetHeight);
      setMdContent(localStorage.getItem(chooseData?.title || "") || "");
    }
  }, [chooseData]);

  return (
    <div className="max-w-[690px] p-6 flex flex-col mx-auto xs:w-full xs:p-0 xs:m-0 xs:block">
      {/* 搜索和筛选栏 */}
      <div className="mb-6 space-y-4 xs:px-3 xs:mb-4">
        {/* 搜索框 */}
        <div className="relative">
          <input
            type="text"
            placeholder="搜索文章标题、描述或标签..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 pr-10 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6c32fe] focus:border-transparent bg-white xs:text-base"
          />
          <svg
            className="absolute right-3 top-2.5 w-5 h-5 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
          {searchTerm && (
            <button
              onClick={() => setSearchTerm("")}
              className="absolute right-10 top-2.5 w-5 h-5 text-gray-400 hover:text-gray-600"
            >
              <svg
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          )}
        </div>

        {/* 标签筛选 */}
        <div className="flex flex-wrap gap-2 items-center">
          <span className="text-sm text-gray-600 font-medium xs:text-xs">标签筛选：</span>
          <button
            onClick={() => setSelectedTag("")}
            className={`px-3 py-1 text-xs rounded-full transition-all duration-200 ${
              selectedTag === ""
                ? "bg-[#6c32fe] text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            全部
          </button>
          {allTags.map((tag) => (
            <button
              key={tag}
              onClick={() => setSelectedTag(selectedTag === tag ? "" : tag)}
              className={`px-3 py-1 text-xs rounded-full transition-all duration-200 ${
                selectedTag === tag
                  ? "bg-[#6c32fe] text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {tag}
            </button>
          ))}
        </div>

        {/* 结果统计 */}
        {(searchTerm || selectedTag) && (
          <div className="text-sm text-gray-500 xs:text-xs">
            找到 <span className="font-semibold text-[#6c32fe]">{filteredData.length}</span> 篇文章
            {searchTerm && (
              <span>
                {" "}
                关于 &ldquo;<span className="font-semibold">{searchTerm}</span>&rdquo;
              </span>
            )}
            {selectedTag && (
              <span>
                {" "}
                标签为 &ldquo;<span className="font-semibold">{selectedTag}</span>&rdquo;
              </span>
            )}
          </div>
        )}
      </div>

      <div className="flex flex-1 justify-center gap-7 pb-8 items-start">
        <div
          className="flex flex-col gap-4 transition-all h-fit xs:w-full xs:overflow-hidden xs:gap-0"
          ref={ref}
        >
          {filteredData.length > 0 ? (
            filteredData.map((item) => (
              <Perview
                key={item.originalIndex}
                data={item}
                index={item.originalIndex}
                onChoose={onChoose}
                isActive={chooseData?.title === item.title}
              />
            ))
          ) : (
            <div className="text-center py-12 text-gray-500">
              <p className="text-lg mb-2">没有找到相关文章</p>
              <p className="text-sm">试试其他关键词或标签</p>
            </div>
          )}
        </div>
        <div
          className="rounded-lg flex-shrink-0 transition-all duration-1000 overflow-y-auto p-5 min-h-[800px] sticky top-0 max-h-screen xs:hidden"
          style={{
            width: isChoose ? "750px" : 0,
            height: isChoose ? height + "px" : 0,
            opacity: isChoose ? 1 : 0,
          }}
        >
          <MDRender content={mdContent} />
        </div>
      </div>
    </div>
  );
};

export default List;

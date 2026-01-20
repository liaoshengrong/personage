"use client";
import dayjs from "dayjs";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useMobile } from "../hooks/useMobile";
import { calculateReadingTime, formatReadingTime } from "@/utils/readingTime";

interface IProps {
  data: DataType;
  index: number;
  onChoose: (data: DataType, index: number) => void;
  isActive: boolean;
}
const Perview = ({ data, index, onChoose, isActive }: IProps) => {
  const isMobile = useMobile();
  const { title, tag, desc, date } = data;
  const [readingTime, setReadingTime] = useState<number | null>(null);
  const animatecss =
    index % 2 === 0 ? "animate__bounceInLeft" : "animate__bounceInRight";
  
  useEffect(() => {
    getFiles(tag, title);
  }, [tag, title]);

  // 计算阅读时间
  useEffect(() => {
    const cachedContent = localStorage.getItem(title);
    if (cachedContent) {
      const time = calculateReadingTime(cachedContent);
      setReadingTime(time);
    } else {
      // 如果内容还没加载，尝试获取
      getFiles(tag, title).then(() => {
        const content = localStorage.getItem(title);
        if (content) {
          const time = calculateReadingTime(content);
          setReadingTime(time);
        }
      });
    }
  }, [title, tag]);

  const titlecss = isActive
    ? "text-[#FF0000] text-nowrap text-lg"
    : " text-black/90 text-nowrap text-lg";

  return (
    <div
      className={`flex gap-5 border-b py-4 px-3 cursor-pointer hover:shadow-md hover:rounded-md animate__animated xs:hover:shadow-none xs:hover:rounded-none xs:gap-3 xs:active:shadow-md xs:active:rounded-md ${animatecss}`}
      onClick={() => onChoose(data, index)}
    >
      <div className="text-black/60 font-300 flex-shrink-0 text-lg w-[110px] xs:w-[52px] xs:text-base">
        <span className="block xs:hidden leading-6">
          {dayjs(date).format("MMM DD,YYYY")}
        </span>
        <span className="hidden xs:block leading-6">
          {dayjs(date).format("MMM DD")}
        </span>
        <p className="hidden xs:block mt-2">{dayjs(date).format("YYYY")}</p>
      </div>
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2 flex-wrap">
          <div className={`${titlecss} xs:text-base`}>{title}</div>
          <span className="inline-block px-2 py-0.5 text-xs bg-[#6c32fe]/10 text-[#6c32fe] rounded-full border border-[#6c32fe]/20">
            {tag}
          </span>
        </div>
        <div className="text-base xs:text-sm text-black/60">{desc}</div>
        <div className="flex items-center gap-3 text-xs text-gray-500">
          {readingTime !== null && (
            <span className="flex items-center gap-1">
              <svg
                className="w-3.5 h-3.5"
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
              {formatReadingTime(readingTime)}
            </span>
          )}
        </div>
        {isActive && !isMobile && (
          <Link
            className="px-3 py-2 border border-gray-400 text-xs w-fit rounded-md text-black/60 hover:border-gray-600 hover:text-black/80 transition-all duration-300"
            href={`/detail/${index}`}
            onClick={(e) => e.stopPropagation()}
            prefetch
          >
            查看详情
          </Link>
        )}
      </div>
    </div>
  );
};

export default Perview;

const getFiles = async (tag: string, title: string) => {
  const path = window.location.pathname + `files/${tag}/${title}.md`;
  const res = await fetch(path);
  const text = await res.text();
  localStorage.setItem(title, text);
  return text;
};

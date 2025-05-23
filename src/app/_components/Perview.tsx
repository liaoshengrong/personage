"use client";
import dayjs from "dayjs";
import React, { useEffect } from "react";
import Link from "next/link";
import { useMobile } from "../hooks/useMobile";
interface IProps {
  data: DataType;
  index: number;
  onChoose: (data: DataType, index: number) => void;
  isActive: boolean;
}
const Perview = ({ data, index, onChoose, isActive }: IProps) => {
  const isMobile = useMobile();
  const { title, tag, desc, date } = data;
  const animatecss =
    index % 2 === 0 ? "animate__bounceInLeft" : "animate__bounceInRight";
  useEffect(() => {
    getFiles(tag, title);
  }, [tag, title]);
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
        <div className={`${titlecss} xs:text-base`}>{title}</div>
        <div className="text-base xs:text-sm text-black/60">{desc}</div>
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

const getFiles = (tag: string, title: string) => {
  const path = window.location.pathname + `files/${tag}/${title}.md`;
  const res = fetch(path)
    .then((r) => r.text())
    .then((r) => {
      localStorage.setItem(title, r);
    });

  return res;
};

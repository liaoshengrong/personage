"use client";
import dayjs from "dayjs";
import React, { useEffect } from "react";
import { useMobile } from "../common";
import Link from "next/link";
interface IProps {
  data: DataType;
  index: number;
  onChoose: (data: DataType) => void;
  isActive: boolean;
  isMobile: boolean;
}
const Perview = ({ data, index, onChoose, isActive, isMobile }: IProps) => {
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
    <Link
      className={`flex gap-5 border-b py-4 cursor-pointer hover:shadow-md hover:rounded-md animate__animated xs:hover:shadow-none xs:hover:rounded-none xs:gap-3 xs:active:shadow-md xs:active:rounded-md ${animatecss}`}
      onClick={() => onChoose(data)}
      href={isMobile ? `/detail/${index}` : ""}
      prefetch
    >
      <div className="text-black/60 font-300 flex-shrink-0 text-lg w-[110px] xs:w-[52px] xs:text-base">
        {isMobile
          ? dayjs(date).format("MMM DD")
          : dayjs(date).format("MMM DD,YYYY")}
        <p className="hidden xs:block mt-2">{dayjs(date).format("YYYY")}</p>
      </div>
      <div className="flex flex-col gap-2">
        <div className={`${titlecss} xs:text-base`}>{title}</div>
        <div className="text-base xs:text-sm text-black/60">{desc}</div>
      </div>
    </Link>
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

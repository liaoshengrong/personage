"use client";
import dayjs from "dayjs";
import React, { useEffect } from "react";
interface IProps {
  data: DataType;
  index: number;
  onChoose: (data: DataType) => void;
}
const Perview = ({ data, index, onChoose }: IProps) => {
  const { title, tag, desc, date } = data;
  const animatecss =
    index % 2 === 0 ? "animate__bounceInLeft" : "animate__bounceInRight";
  useEffect(() => {
    getFiles(tag, title);
  }, []);

  return (
    <div
      className={`flex gap-5 border-b py-4 cursor-pointer hover:shadow-md hover:rounded-md animate__animated ${animatecss}`}
      onClick={() => onChoose(data)}
    >
      <div className="text-black/60 font-300 flex-shrink-0 text-lg w-[110px]">
        {dayjs(date).format("MMM DD,YYYY")}
      </div>
      <div className="flex flex-col gap-2">
        <div className="text-black/70 text-nowrap text-lg">{title}</div>
        <div className="text-base text-black/60">{desc}</div>
      </div>
    </div>
  );
};

export default Perview;
const getFiles = (tag: string, title: string) => {
  const path = window.location.pathname + `files/${tag}/${title}.md`;
  fetch(path)
    .then((r) => r.text())
    .then((r) => {
      //   console.log(r, "rrrrrr");
      localStorage.setItem(title, r);
    });
};

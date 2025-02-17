"use client";
import dayjs from "dayjs";
import React, { useEffect } from "react";

const Perview = ({ data }: { data: DataType }) => {
  const { title, tag, desc, date } = data;

  useEffect(() => {
    getFiles(tag, title);
  }, []);

  return (
    <div className="flex gap-5 border-b py-4 cursor-pointer">
      <div className="text-black/60 font-300 flex-shrink-0 text-lg">
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

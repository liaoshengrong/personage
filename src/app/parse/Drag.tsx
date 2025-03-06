"use client";
import React, { useRef, useState } from "react";
import wordIcon from "@/app/_images/word.png";
import Image from "next/image";
const demoArr = [
  { title: "守护春蕾项目.doc", type: "doc" },
  { title: "希望工程项目.doc", type: "doc" },
  { title: "一块早餐项目.doc", type: "doc" },
  { title: "留守儿童陪伴项目.doc", type: "doc" },
];
type Option = (typeof demoArr)[number];

const Drag = () => {
  const [select, setSelect] = useState<Option>();
  const [file, setFile] = useState<File>();
  const [isDrag, setIsDrag] = useState(false);
  const [isEnter, setIsEnter] = useState(false);
  const ref = useRef<Option | undefined>(undefined);
  const curCss = isDrag ? "cursor-grabbing" : "cursor-grab";

  console.log(file, "filefile");

  const onDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsEnter(false);

    if (isDrag) {
      setSelect(ref.current as Option);
      return;
    }
    setFile(e.dataTransfer.files[0]);
    setSelect({
      title: e.dataTransfer.files[0].name,
      type: e.dataTransfer.files[0].type,
    });
  };

  return (
    <div className="max-w-5xl w-full flex mx-auto bg-white shadow-2xl rounded-lg overflow-hidden mt-8 animate__animated animate__fadeInUp">
      <div className="py-7 px-10 border-r flex-1 flex items-center justify-center">
        <div
          className="h-full flex-1 flex flex-col items-center justify-center border-2 border-dashed p-7"
          onDrop={onDrop}
          onDragEnter={(e) => {
            e.preventDefault();
            setIsEnter(true);
          }}
          onDragLeave={(e) => {
            e.preventDefault();
            setIsEnter(false);
          }}
          onDragOver={(e) => {
            e.preventDefault();
          }}
        >
          {isEnter ? (
            <div className="text-xl text-gray-400 text-center">
              放这里松手,不要乱动
            </div>
          ) : select ? (
            <div className="flex flex-col gap-2 text-xl text-gray-400">
              <span>文件名：{select.title}</span>
              <span style={{ wordBreak: "break-all" }}>
                文件格式：{select.type}
              </span>
              <span>File对象：看控制台，拿到file对象，啥都可以干了</span>
            </div>
          ) : (
            <div className="flex flex-col gap-2 text-xl text-gray-400 items-center">
              <span>拖拽任意文件到此处</span>
              <span>也可以拖拽右侧的demo文件至此</span>
            </div>
          )}
        </div>
      </div>
      <div className="p-7 w-64 flex-col flex gap-5">
        {demoArr.map((v, i) => (
          <div
            key={i}
            className={`flex flex-col items-center justify-center gap-3 ${curCss}`}
            onDragStart={() => {
              ref.current = v;
              setIsDrag(true);
            }}
            onDragEnd={() => setIsDrag(false)}
          >
            <Image src={wordIcon} alt="word" className="w-full object-cover" />
            <p>{v.title}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Drag;

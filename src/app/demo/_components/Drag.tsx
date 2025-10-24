"use client";
import React, { useRef, useState } from "react";
import wordIcon from "@/app/_images/word.png";
import Image from "next/image";
const demoArr = [
  { title: "守护春蕾项目.doc", type: "doc" },
  { title: "希望工程项目.doc", type: "doc" },
  { title: "一块早餐项目.doc", type: "doc" },
];
type Option = (typeof demoArr)[number];

const Drag = () => {
  const [select, setSelect] = useState<Option>();
  const [file, setFile] = useState<File>();
  const [isDrag, setIsDrag] = useState(false);
  const [isEnter, setIsEnter] = useState(false);
  const ref = useRef<Option | undefined>(undefined);
  const curCss = isDrag ? "cursor-grabbing" : "cursor-grab";

  const onDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsEnter(false);

    if (isDrag) {
      setSelect(ref.current as Option);
      return;
    }
    const tempFile = e.dataTransfer.files[0];
    console.log(tempFile, "file__file");

    setFile(tempFile);
    setSelect({
      title: tempFile.name,
      type: tempFile.type,
    });
  };

  return (
    <div className="relative">
      {/* Section Header */}
      <div className="text-center mb-8 xs:mb-6">
        <div className="relative inline-block mb-3 xs:mb-4">
          <div className="absolute -inset-4 bg-gradient-to-r from-cyan-500/20 to-purple-500/20 rounded-xl blur-md opacity-60"></div>
          <h3 className="relative text-3xl xs:text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 neon-text tracking-wide">
            拖拽交互体验
          </h3>
        </div>
        <p className="text-base xs:text-sm text-medium-contrast max-w-2xl mx-auto font-medium leading-relaxed mb-3 xs:mb-4">
          HTML5 原生拖拽 API 演示，支持文件拖拽和跨组件交互
        </p>
        <div className="flex justify-center">
          <div className="h-1.5 w-32 bg-gradient-to-r from-cyan-400 to-purple-600 rounded-full animate__animated animate__fadeInUp animate__delay-2s"></div>
        </div>
      </div>

      <div className="max-w-5xl w-full flex mx-auto backdrop-blur-xl bg-gradient-to-br from-slate-900/50 to-slate-800/50 border border-cyan-500/30 shadow-2xl shadow-cyan-500/10 rounded-2xl overflow-hidden mt-8 animate__animated animate__fadeInUp">
        {/* 拖拽区域 - Glass Card */}
        <div className="py-8 px-12 border-r border-cyan-500/20 flex-1 flex items-center justify-center">
          <div
            className={`h-full flex-1 flex flex-col items-center justify-center border-2 border-dashed border-cyan-500/40 rounded-2xl p-8 transition-all duration-300 ${
              isEnter 
                ? "border-cyan-400 bg-gradient-to-br from-cyan-500/10 to-blue-500/10 shadow-lg shadow-cyan-500/20" 
                : "hover:border-cyan-400/60 hover:bg-gradient-to-br hover:from-cyan-500/5 hover:to-blue-500/5"
            }`}
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
              <div className="text-xl text-cyan-300 text-center font-semibold animate-pulse">
                拖拽到此处上传
              </div>
            ) : select ? (
              <div className="flex flex-col gap-3 text-xl text-gray-200">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse"></div>
                  <span>文件: <span className="text-cyan-300 font-semibold">{select.title}</span></span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
                  <span style={{ wordBreak: "break-all" }}>
                    类型: <span className="text-blue-300 font-semibold">{select.type}</span>
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse"></div>
                  <span className="text-purple-300 font-semibold">文件对象已就绪 - 请查看控制台</span>
                </div>
              </div>
            ) : (
              <div className="flex flex-col gap-3 text-xl text-gray-400 items-center">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 bg-cyan-500 rounded-full animate-bounce"></div>
                  <span>拖拽文件到此处</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <span>或从右侧拖拽示例文件</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  <span>支持所有文件类型</span>
                </div>
              </div>
            )}
          </div>
        </div>
        
        {/* 示例文件区域 - Glass Cards */}
        <div className="p-8 w-72 flex-col flex gap-6">
          {demoArr.map((v, i) => (
            <div
              key={i}
              className={`flex flex-col items-center justify-center gap-4 p-4 rounded-xl backdrop-blur-sm bg-gradient-to-br from-slate-800/60 to-slate-700/60 border border-cyan-500/30 hover:border-cyan-400/50 transition-all duration-300 hover:shadow-lg hover:shadow-cyan-500/20 ${curCss}`}
              onDragStart={() => {
                ref.current = v;
                setIsDrag(true);
              }}
              onDragEnd={() => setIsDrag(false)}
            >
              <div className="p-3 rounded-full bg-gradient-to-r from-cyan-500/20 to-blue-600/20">
                <Image src={wordIcon} alt="Document" className="w-12 h-12 object-cover filter brightness-150" />
              </div>
              <p className="text-cyan-200 font-semibold text-center text-sm">{v.title}</p>
              <div className="text-xs text-cyan-400 bg-cyan-500/10 px-2 py-1 rounded-full">
                {v.type.toUpperCase()}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Drag;

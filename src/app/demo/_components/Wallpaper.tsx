"use client";
import Image from "next/image";
import React, { useState } from "react";
import refreshIcon from "@/app/_images/refresh.svg";
import { getWallpaper } from "../api";
import blurImage from "@/app/_images/blur-image.png";

const Wallpaper = ({ data: _data }: { data: string[] }) => {
  const [data, setData] = useState(_data);
  const [big, setBig] = useState(data[0]);
  const [loading, setLoading] = useState(false);

  // 点击下载图片
  const onDownload = async () => {
    const response = await fetch(big);
    const blob = await response.blob();
    // 创建一个隐藏的 <a> 元素
    const a = document.createElement("a");
    a.style.display = "none";
    document.body.appendChild(a);

    // 将 Blob 转换为 URL 并设置为 <a> 的 href 属性
    a.href = URL.createObjectURL(blob);
    a.download = big.split("/")[big.split("/").length - 1].split(".")[0];

    // 模拟点击事件以触发下载
    a.click();

    // 清理
    document.body.removeChild(a);
    URL.revokeObjectURL(a.href);
  };
  const onRefresh = async () => {
    setLoading(true);
    const res = await getWallpaper();
    setData(res);
    setBig(res[0]);
    setLoading(false);
  };

  return (
    <div className="relative">
      {/* Section Header */}
      <div className="text-center mb-6 xs:mb-4">
        <div className="relative inline-block mb-2 xs:mb-3">
          <div className="absolute -inset-3 bg-gradient-to-r from-cyan-500/20 to-purple-500/20 rounded-xl blur-md opacity-60"></div>
          <h3 className="relative text-2xl xs:text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 neon-text tracking-wide">
            精美壁纸展示
          </h3>
        </div>
        <p className="text-sm xs:text-xs text-medium-contrast max-w-lg mx-auto font-medium leading-relaxed mb-2 xs:mb-3">
          高质量壁纸预览与下载，支持实时刷新
        </p>
        <div className="flex justify-center">
          <div className="h-1 w-12 bg-gradient-to-r from-cyan-400 to-purple-600 rounded-full"></div>
        </div>
      </div>

      <div className="w-full mt-8 rounded-2xl backdrop-blur-xl bg-gradient-to-br from-slate-900/50 to-slate-800/50 border border-cyan-500/30 shadow-2xl shadow-cyan-500/10 h-[800px] p-6 flex flex-col gap-6 animate__animated animate__fadeInUp">
        {/* 主图片区域 - Glass Card */}
        <div className="flex-1 flex items-center justify-center overflow-hidden rounded-2xl relative group">
          <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 via-blue-500/10 to-purple-600/10 rounded-2xl"></div>
          {loading ? (
            <Loading />
          ) : (
            <div className="relative w-full h-full cursor-pointer transform transition-all duration-500 group-hover:scale-105">
              <Image
                src={big}
                alt="Premium Wallpaper"
                title="点击下载"
                width={720}
                height={540}
                className="w-full h-full object-cover rounded-2xl"
                onClick={onDownload}
                priority
                placeholder="blur"
                blurDataURL={blurImage.src}
                quality={60}
              />
              {/* 下载按钮遮罩 */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-6">
                <div className="bg-gradient-to-r from-cyan-500 to-blue-600 text-white px-6 py-3 rounded-full font-semibold shadow-lg shadow-cyan-500/25 transform transition-all duration-300 group-hover:scale-110">
                  下载壁纸
                </div>
              </div>
            </div>
          )}
        </div>
        
        {/* 缩略图区域 - Glass Cards */}
        <div className="h-[140px] flex-shrink-0 flex gap-4">
          {data.map((item, index) => (
            <div
              key={index}
              className={`flex-1 cursor-pointer rounded-xl overflow-hidden relative group transition-all duration-300 ${
                big === data[index] 
                  ? "ring-2 ring-cyan-400 shadow-lg shadow-cyan-500/25" 
                  : "hover:ring-2 hover:ring-cyan-400/50 hover:shadow-lg hover:shadow-cyan-500/10"
              }`}
              onClick={() => setBig(data[index])}
            >
              {loading ? (
                <Loading />
              ) : (
                <div className="relative w-full h-full">
                  <Image
                    src={item}
                    alt={`Wallpaper ${index + 1}`}
                    title="点击预览"
                    width={240}
                    height={180}
                    className="w-full h-full object-cover rounded-xl transform transition-all duration-300 group-hover:scale-110"
                    placeholder="blur"
                    blurDataURL={blurImage.src}
                    quality={20}
                    priority
                  />
                  {/* 悬停效果 */}
                  <div className="absolute inset-0 bg-gradient-to-t from-cyan-500/20 via-transparent to-transparent rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>
              )}
            </div>
          ))}
          
          {/* 刷新按钮 - Glass Card */}
          <div
            className="flex-1 rounded-xl backdrop-blur-sm bg-gradient-to-br from-slate-800/60 to-slate-700/60 border border-cyan-500/30 flex flex-col items-center justify-center cursor-pointer gap-3 group hover:border-cyan-400/50 transition-all duration-300 hover:shadow-lg hover:shadow-cyan-500/20"
            onClick={onRefresh}
          >
            <div className="p-3 rounded-full bg-gradient-to-r from-cyan-500/20 to-blue-600/20 group-hover:from-cyan-500/30 group-hover:to-blue-600/30 transition-all duration-300">
              <Image
                src={refreshIcon}
                alt="刷新"
                width={32}
                height={32}
                className="w-8 h-8 object-contain filter brightness-150 group-hover:scale-110 transition-transform duration-300"
                priority
              />
            </div>
            <p className="text-sm font-semibold text-cyan-300 group-hover:text-cyan-200 transition-colors duration-300">刷新</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Wallpaper;

const Loading = () => (
  <div className="w-full h-full flex items-center justify-center">
    <div className="animate-spin rounded-full h-32 w-32 border-t-4 border-b-4 border-gray-300"></div>
  </div>
);

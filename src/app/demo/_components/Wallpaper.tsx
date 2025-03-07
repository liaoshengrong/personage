"use client";
import Image from "next/image";
import React, { useState } from "react";
import refreshIcon from "@/app/_images/refresh.svg";
import { getWallpaper } from "../api";

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
    <div className="w-full mt-8 rounded-lg bg-gray-100 h-[800px] p-5 flex flex-col gap-4">
      <div className="flex-1 flex items-center justify-center overflow-hidden">
        {loading ? (
          <Loading />
        ) : (
          <Image
            src={big}
            alt=""
            loading="eager"
            title="点击下载"
            width={720}
            height={540}
            className="w-full  object-cover cursor-pointer"
            onClick={onDownload}
          />
        )}
      </div>
      <div className="h-[140px] flex-shrink-0 flex gap-4">
        {data.map((item, index) => (
          <div
            key={index}
            className="flex-1 cursor-pointer"
            onClick={() => setBig(data[index])}
          >
            {loading ? (
              <Loading />
            ) : (
              <Image
                src={item}
                alt=""
                loading="lazy"
                title="点击预览"
                width={240}
                height={180}
                className="h-full object-cover rounded-lg"
              />
            )}
          </div>
        ))}
        <div
          className="flex-1 bg-gray-200 rounded-lg flex flex-col items-center justify-center cursor-pointer gap-2"
          onClick={onRefresh}
        >
          <Image
            src={refreshIcon}
            alt=""
            width={240}
            height={180}
            className="w-16 object-cover rounded-lg"
          />
          <p className="text-xl">换一批</p>
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

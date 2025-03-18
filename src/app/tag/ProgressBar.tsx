"use client";
import React, { useEffect, useState } from "react";

interface ProgressBarProps {
  title: string;
  percentage: number; // 0-100 的数值
  index: number;
}

const ProgressBar: React.FC<ProgressBarProps> = ({
  title,
  percentage,
  index,
}) => {
  const [width, setWidth] = useState(0);
  useEffect(() => {
    setTimeout(() => {
      setWidth(percentage);
    }, 200);
  }, [percentage]);

  // 根据百分比选择不同的颜色（可以根据需求调整）
  const progressBarColor =
    percentage < 50
      ? "bg-red-500" // 红色 (低于 50%)
      : percentage < 80
      ? "bg-yellow-500" // 黄色 (50%-80%)
      : "bg-green-500"; // 绿色 (高于 80%)

  const anmitecss =
    index % 2 === 0 ? "animate__bounceInLeft" : "animate__bounceInRight";

  return (
    <div
      className={`flex items-center space-x-4 my-4 animate__animated ${anmitecss}`}
    >
      {/* 左侧标题 */}
      <span className="font-medium text-gray-700 w-16">{title}</span>

      {/* 进度条容器 */}
      <div className="w-full h-4 rounded-full bg-gray-200 flex-1">
        {/* 进度条 */}
        <div
          className={`h-full rounded-full transition-width duration-1000 ease-in-out ${progressBarColor}`}
          style={{ width: width + "%" }}
        ></div>
      </div>

      {/* 右侧百分比数值 */}
      <span className="font-medium text-gray-700">{percentage}%</span>
    </div>
  );
};

export default ProgressBar;

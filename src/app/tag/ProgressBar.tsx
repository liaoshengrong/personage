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
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      setWidth(percentage);
    }, 200 + index * 100); // 错开动画时间
  }, [percentage, index]);

  // 根据百分比选择不同的渐变色彩方案
  const getProgressBarStyle = () => {
    if (percentage < 50) {
      return {
        background: 'linear-gradient(90deg, #ef4444 0%, #f97316 100%)',
        glowColor: 'rgba(239, 68, 68, 0.5)'
      };
    } else if (percentage < 80) {
      return {
        background: 'linear-gradient(90deg, #f59e0b 0%, #eab308 100%)',
        glowColor: 'rgba(245, 158, 11, 0.5)'
      };
    } else {
      return {
        background: 'linear-gradient(90deg, #10b981 0%, #06b6d4 100%)',
        glowColor: 'rgba(16, 185, 129, 0.5)'
      };
    }
  };

  const progressStyle = getProgressBarStyle();
  const animationDelay = index * 0.1;

  return (
    <div
      className={`group relative flex items-center space-x-4 my-6 animate__animated animate__fadeInUp animate__delay-${index}s hover:scale-105 transition-all duration-300 cursor-pointer`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{ animationDelay: `${animationDelay}s` }}
    >
      {/* 左侧标题 */}
      <div className="relative">
        <span className="font-bold text-lg text-high-contrast w-20 text-right block transition-all duration-300 group-hover:text-cyan-400">
          {title}
        </span>
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-400/20 to-purple-600/20 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-sm"></div>
      </div>

      {/* 进度条容器 */}
      <div className="flex-1 relative">
        <div className="w-full h-6 rounded-full bg-dark-800 border border-white/10 relative overflow-hidden backdrop-blur-sm">
          {/* 背景网格效果 */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent"></div>
          
          {/* 进度条 */}
          <div
            className="h-full rounded-full transition-all duration-1000 ease-out relative overflow-hidden"
            style={{ 
              width: width + "%",
              background: progressStyle.background,
              boxShadow: isHovered ? `0 0 20px ${progressStyle.glowColor}, 0 0 40px ${progressStyle.glowColor}` : 'none'
            }}
          >
            {/* 进度条内部光效 */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-pulse"></div>
            
            {/* 进度条末端光点 */}
            {width > 0 && (
              <div 
                className="absolute right-0 top-0 w-4 h-full bg-white/40 rounded-full blur-sm animate-pulse"
                style={{ transform: 'translateX(50%)' }}
              ></div>
            )}
          </div>
        </div>
        
        {/* 进度条底部光效 */}
        <div 
          className="absolute -bottom-1 left-0 h-1 rounded-full opacity-60 blur-sm transition-all duration-300"
          style={{ 
            width: width + "%",
            background: progressStyle.background,
            opacity: isHovered ? 0.8 : 0.4
          }}
        ></div>
      </div>

      {/* 右侧百分比数值 */}
      <div className="relative">
        <span className={`font-bold text-lg transition-all duration-300 block min-w-[3rem] text-center ${
          isHovered ? 'text-cyan-400 scale-110' : 'text-high-contrast'
        }`}>
          {percentage}%
        </span>
        <div className={`absolute inset-0 bg-gradient-to-r from-cyan-400/20 to-purple-600/20 rounded-lg transition-opacity duration-300 blur-sm ${
          isHovered ? 'opacity-100' : 'opacity-0'
        }`}></div>
      </div>
    </div>
  );
};

export default ProgressBar;

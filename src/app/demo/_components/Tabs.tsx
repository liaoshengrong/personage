"use client";
import React, { JSX, useState } from "react";

interface IProps {
  children: JSX.Element[];
  titles: string[];
  defalultTab?: string;
}

const Tabs = ({ children, titles, defalultTab }: IProps) => {
  const [active, setActive] = useState(Number(defalultTab ?? 0));
  const onTab = (index: number) => {
    // 修改地址栏参数，但不跳转页面

    const url = new URL(window.location.href);
    url.searchParams.set("tab", String(index));
    // 更新 URL，而不添加新条目到历史记录
    window.history.replaceState({ path: url.toString() }, "", url.toString());
    setActive(index);
  };
  return (
    <div className="relative">
      {/* Section Header */}
      <div className="text-center mb-8 xs:mb-6">
        <div className="flex justify-center">
          <div className="h-1.5 w-32 bg-gradient-to-r from-cyan-400 to-purple-600 rounded-full animate__animated animate__fadeInUp animate__delay-2s"></div>
        </div>
      </div>

      <div className="mt-8 max-w-5xl w-full mx-auto flex flex-col flex-1 xs:mt-0">
        {/* 标签导航 - Glassmorphism Style */}
        <div className="flex backdrop-blur-xl bg-gradient-to-r from-slate-900/50 to-slate-800/50 rounded-2xl p-2 border border-cyan-500/30 shadow-2xl shadow-cyan-500/10 animate__animated animate__fadeInUp xs:hidden">
          {titles.map((item, index) => (
            <div
              className={`flex-1 py-4 text-center cursor-pointer rounded-xl transition-all duration-300 font-semibold relative overflow-hidden group ${
                active === index
                  ? "text-white bg-gradient-to-r from-cyan-500/80 to-blue-600/80 shadow-lg shadow-cyan-500/25"
                  : "text-gray-300 hover:text-white hover:bg-slate-700/50"
              }`}
              key={index}
              onClick={() => onTab(index)}
            >
              {/* 悬停光效 */}
              <div className={`absolute inset-0 bg-gradient-to-r from-cyan-400/20 to-blue-400/20 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${
                active === index ? "opacity-100" : ""
              }`}></div>
              
              {/* 活跃状态光条 */}
              {active === index && (
                <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-8 h-1 bg-gradient-to-r from-cyan-400 to-blue-400 rounded-full shadow-[0_0_8px_rgba(56,189,248,0.8)]"></div>
              )}
              
              <span className="relative z-10">{item}</span>
            </div>
          ))}
        </div>
        
        {/* 移动端标签导航 */}
        <div className="xs:flex hidden overflow-x-auto pb-2 mb-4">
          <div className="flex gap-2 min-w-max px-2">
            {titles.map((item, index) => (
              <button
                key={index}
                onClick={() => onTab(index)}
                className={`px-4 py-3 rounded-xl whitespace-nowrap transition-all duration-300 font-medium ${
                  active === index
                    ? "bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg shadow-cyan-500/25 scale-105"
                    : "bg-slate-800/60 text-cyan-300 hover:bg-slate-700/60 hover:text-cyan-200 border border-slate-600/50"
                }`}
              >
                {item}
              </button>
            ))}
          </div>
        </div>
        
        {/* 内容区域 */}
        <div className="flex-1 flex flex-col mt-6">
          <div className="animate__animated animate__fadeIn">
            {children[active]}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Tabs;

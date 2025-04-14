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
    <div className="mt-8 max-w-5xl w-full mx-auto flex flex-col flex-1 xs:mt-0">
      <div className="flex bg-white rounded-md animate__animated animate__fadeInUp xs:hidden">
        {titles.map((item, index) => (
          <div
            className="flex-1 py-5 text-gray-400 text-center cursor-pointer rounded-lg"
            key={index}
            onClick={() => onTab(index)}
            style={{
              backgroundColor: active === index ? "#f3f4f6" : "",
              color: active === index ? "#111827" : "",
            }}
          >
            {item}
          </div>
        ))}
      </div>
      <div className="flex-1 flex flex-col">{children[active]}</div>
    </div>
  );
};

export default Tabs;

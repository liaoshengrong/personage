import React from "react";
import Icon, { Tip } from "./Icon";
import vitaeIcon from "../_images/vitae.svg";
import skillIcon from "../_images/skill.svg";
import listIcon from "../_images/list.svg";
import parseIcon from "../_images/parse.svg";
import Link from "next/link";
const Navbar = ({ stop }: { stop?: boolean }) => {
  const animatecss = stop ? "" : "animate__backInUp";
  return (
    <>
      <div
        className={`text-base mb-2 text-center font-en text-black/80 tracking-widest animate__animated ${animatecss}`}
      >
        <Link href="/"> MARK LIAO</Link>
      </div>
      <div className="flex gap-1 items-center justify-center">
        {menus.map((v, i) => (
          <div className="group relative" key={i}>
            <Icon src={v.icon} direction={v.direction} path={v.path} />
            <Tip title={v.title} />
          </div>
        ))}

        {/* <div className="group relative">
          <Icon src={listIcon} direction="top" path="/" />
          <Tip title="博客列表" />
        </div>
        <div className="group relative">
          <Icon src={vitaeIcon} direction="right" path="/resume" />
          <Tip title="个人简历" />
        </div> */}
      </div>
    </>
  );
};

export default Navbar;

const menus = [
  {
    title: "技能标签",
    path: "/tag",
    icon: skillIcon,
    direction: "left",
  },
  {
    title: "博客列表",
    path: "/",
    icon: listIcon,
    direction: "top",
  },
  {
    title: "文件解析",
    path: "/parse",
    icon: parseIcon,
    direction: "top",
  },
  {
    title: "个人简历",
    path: "/resume",
    icon: vitaeIcon,
    direction: "right",
  },
];

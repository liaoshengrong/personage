"use client";
import React, {
  CSSProperties,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import Icon, { Tip } from "./Icon";
import vitaeIcon from "../_images/vitae.svg";
import skillIcon from "../_images/skill.svg";
import listIcon from "../_images/list.svg";
import parseIcon from "../_images/parse.svg";
import aiIcon from "../_images/ai.svg";
import Link from "next/link";
import { useMobile } from "../common";
const Navbar = () => {
  const ref = useRef<HTMLDivElement>(null);
  const [visble, setVisible] = useState(true);
  const isMobile = useMobile();
  useEffect(() => {
    if (!isMobile) return;
    const ob = new IntersectionObserver(
      (entries) => {
        setVisible(entries[0].isIntersecting);
      },
      { rootMargin: "-48px" }
    );
    ob.observe(ref.current!);
    return () => {
      ob.disconnect();
    };
  }, [isMobile]);

  const fixedStyles = {
    position: visble ? "absolute" : "fixed",
    padding: visble ? "" : "0  20px",
    backgroundColor: visble ? "transparent" : "white",
  } as CSSProperties;

  return (
    <div className="relative w-full">
      <div className="h-12" ref={ref} />
      <div
        className="xs:flex xs:h-12 xs:justify-between xs:items-center xs:absolute z-50 w-full top-0 left-0"
        style={isMobile ? fixedStyles : {}}
      >
        <div className="text-base leading-none mb-2 xs:mb-0 text-center font-en text-black/80 tracking-widest animate__animated animate__backInUp">
          <Link href="/"> MARK LIAO</Link>
        </div>
        <div className="flex gap-1 items-center justify-center xs:hidden">
          {menus.map((v, i) => (
            <div className="group relative" key={i}>
              <Icon src={v.icon} direction={v.direction} path={v.path} />
              <Tip title={v.title} />
            </div>
          ))}
        </div>
        <div className="hidden xs:flex gap-1 items-center justify-center animate__animated animate__backInUp">
          {menus.map((item, index) => (
            <Link
              href={item.path}
              key={index}
              className="border border-sky-500 px-2 py-1 rounded-md text-[#6c32fe]"
            >
              {item.text}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Navbar;

const menus = [
  {
    title: "技能标签",
    path: "/tag",
    icon: skillIcon,
    direction: "left",
    text: "技能",
  },
  {
    title: "博客列表",
    path: "/",
    icon: listIcon,
    direction: "left",
    text: "博客",
  },
  {
    title: "个人AI",
    path: "/chat",
    icon: aiIcon,
    direction: "top",
    text: "AI",
  },
  {
    title: "个人简历",
    path: "/resume",
    icon: vitaeIcon,
    direction: "right",
    text: "简历",
  },
  {
    title: "手写demo",
    path: "/demo",
    icon: parseIcon,
    direction: "right",
    text: "Demo",
  },
];

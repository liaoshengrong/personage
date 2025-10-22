"use client";
import React, {
  CSSProperties,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { Tip } from "./Icon";
import vitaeIcon from "../_images/vitae.svg";
import skillIcon from "../_images/skill.svg";
import listIcon from "../_images/list.svg";
import parseIcon from "../_images/parse.svg";
import aiIcon from "../_images/ai.svg";
import Link from "next/link";
import Image from "next/image";
import { useMobile } from "../hooks/useMobile";

const Navbar = () => {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(true);
  const [activePath, setActivePath] = useState("/");
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

  useEffect(() => {
    setActivePath(window.location.pathname);
  }, []);

  const handleNavClick = (path: string) => {
    setActivePath(path);
  };

  const fixedStyles = {
    position: visible ? "absolute" : "fixed",
    padding: visible ? "" : "0 20px",
    backgroundColor: visible ? "transparent" : "rgba(0, 0, 0, 0.8)",
    backdropFilter: visible ? "none" : "blur(10px)",
  } as CSSProperties;

  return (
    <div className="relative w-full">
      <div className="hidden h-20 xs:block" ref={ref} />
      <div
        className="xs:flex xs:h-20 xs:justify-between xs:items-center xs:fixed z-50 w-full top-0 left-0 px-6 transition-all duration-500"
        style={isMobile ? fixedStyles : {}}
      >
        {/* Logo with neon effect */}
        <div className="text-2xl xs:text-xl leading-none mb-2 xs:mb-0 text-center font-bold tracking-wider animate__animated animate__backInUp">
          <Link 
            href="/" 
            className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 hover:from-cyan-300 hover:via-blue-400 hover:to-purple-500 transition-all duration-300 neon-text"
          >
            MARK LIAO
          </Link>
        </div>

        {/* Desktop Navigation */}
        <div className="flex gap-3 items-center justify-center xs:hidden">
          {menus.map((v, i) => (
            <div className="group relative" key={i}>
              <div className="relative">
                <Link 
                  href={v.path} 
                  onClick={() => handleNavClick(v.path)}
                  className={`block p-2 rounded-full transition-all duration-300 relative z-10 ${
                    activePath === v.path 
                      ? 'bg-gradient-to-r from-cyan-400 to-purple-600 shadow-lg shadow-cyan-500/50' 
                      : 'hover:bg-gradient-to-r hover:from-cyan-500/20 hover:to-purple-600/20'
                  }`}
                >
                  <Image 
                    src={v.icon} 
                    alt={v.title}
                    width={32}
                    height={32}
                    className={`transition-all duration-300 ${
                      activePath === v.path 
                        ? 'filter brightness-125 scale-110' 
                        : 'hover:scale-110 hover:brightness-125'
                    }`}
                  />
                </Link>
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-purple-600 rounded-full opacity-0 group-hover:opacity-30 blur-md transition-opacity duration-300"></div>
              </div>
              <Tip title={v.title} />
            </div>
          ))}
        </div>

        {/* Mobile Navigation */}
        <div className="hidden xs:flex gap-2 items-center justify-center animate__animated animate__backInUp">
          {menus.map((item, index) => (
            <Link
              href={item.path}
              key={index}
              onClick={() => handleNavClick(item.path)}
              className={`relative px-4 py-2 rounded-lg text-sm font-bold transition-all duration-300 group overflow-hidden border-2 ${
                activePath === item.path 
                  ? 'text-white bg-gradient-to-r from-cyan-500 to-purple-600 border-cyan-400 shadow-lg shadow-cyan-500/50 glow' 
                  : 'text-gray-200 hover:text-white border-transparent hover:border-cyan-400/50'
              }`}
            >
              <span className="relative z-10">{item.text}</span>
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg"></div>
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-purple-500 blur-sm opacity-0 group-hover:opacity-60 transition-opacity duration-300 rounded-lg"></div>
            </Link>
          ))}
        </div>
      </div>

      {/* Animated background particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-cyan-400 rounded-full animate-pulse glow-cyan opacity-60"></div>
        <div className="absolute top-3/4 right-1/4 w-1 h-1 bg-purple-500 rounded-full animate-pulse glow-purple opacity-40" style={{animationDelay: '1s'}}></div>
        <div className="absolute top-1/2 left-3/4 w-3 h-3 bg-blue-500 rounded-full animate-pulse glow opacity-30" style={{animationDelay: '2s'}}></div>
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

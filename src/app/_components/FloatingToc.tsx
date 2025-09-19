"use client";
import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import data from "@/config/data.json";
import { useMobile } from "../hooks/useMobile";

interface FloatingTocProps {
  currentId?: number;
}

const FloatingToc: React.FC<FloatingTocProps> = ({ currentId }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const router = useRouter();
  const isMobile = useMobile();
  const tocRef = useRef<HTMLDivElement>(null);

  // 滚动时自动隐藏/显示目录
  useEffect(() => {
    let lastScrollY = window.scrollY;
    let ticking = false;

    const updateVisibility = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY > lastScrollY && currentScrollY > 200) {
        // 向下滚动，隐藏目录
        setIsVisible(false);
      } else {
        // 向上滚动，显示目录
        setIsVisible(true);
      }
      lastScrollY = currentScrollY;
      ticking = false;
    };

    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(updateVisibility);
        ticking = true;
      }
    };

    // ESC键关闭目录
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsOpen(false);
      }
      // 按 '/' 键打开目录
      if (e.key === '/' && !isOpen) {
        e.preventDefault();
        setIsOpen(true);
      }
    };

    // 点击外部关闭目录
    const handleClickOutside = (e: MouseEvent) => {
      if (tocRef.current && !tocRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    window.addEventListener("keydown", handleKeyDown);
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleNavigate = (index: number) => {
    // 如果点击的是当前文章，直接关闭目录
    if (currentId === index) {
      setIsOpen(false);
      return;
    }
    
    router.push(`/detail/${index}`);
    setIsOpen(false);
    // 平滑滚动到页面顶部
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  // 返回顶部功能
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
    setIsOpen(false);
  };

  // 移动端不显示悬浮目录
  if (isMobile) return null;

  // 搜索过滤文章
  const filteredData = data.filter(item => 
    item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.desc.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.tag.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div
      ref={tocRef}
      className={`fixed right-4 top-1/2 z-[9999] transition-all duration-300 ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-full"
      }`}
      style={{ pointerEvents: 'auto', transform: 'translateY(-50%)' }}
    >
      {/* 悬浮按钮 */}
      <div className="relative group">
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            console.log('悬浮按钮被点击，当前状态:', isOpen);
            setIsOpen(!isOpen);
          }}
          onMouseDown={(e) => {
            console.log('悬浮按钮鼠标按下');
          }}
          className="w-12 h-12 bg-[#6c32fe] hover:bg-[#5a29d4] text-white rounded-full shadow-lg flex items-center justify-center transition-all duration-200 hover:scale-110 mb-3"
          title="文章目录"
        >
          <svg
            className={`w-6 h-6 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>
        <div className="absolute right-14 top-1/2 transform -translate-y-1/2 bg-black text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
          文章目录 (按 / 键)
        </div>
      </div>

      {/* 回到主页按钮 */}
      {currentId !== undefined && (
        <div className="relative group">
          <button
            onClick={() => {
              console.log('回到主页按钮被点击');
              router.push('/');
              setIsOpen(false);
            }}
            className="w-12 h-12 bg-green-500 hover:bg-green-600 text-white rounded-full shadow-lg flex items-center justify-center transition-all duration-200 hover:scale-110 mb-3"
            title="回到主页"
          >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
            />
          </svg>
        </button>
        <div className="absolute right-14 top-1/2 transform -translate-y-1/2 bg-black text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
          回到主页
        </div>
      </div>
      )}

      {/* 返回顶部按钮 */}
      <div className="relative group">
        <button
          onClick={() => {
            console.log('返回顶部按钮被点击');
            scrollToTop();
          }}
          className="w-12 h-12 bg-orange-500 hover:bg-orange-600 text-white rounded-full shadow-lg flex items-center justify-center transition-all duration-200 hover:scale-110"
          title="返回顶部"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 10l7-7m0 0l7 7m-7-7v18"
            />
          </svg>
        </button>
        <div className="absolute right-14 top-1/2 transform -translate-y-1/2 bg-black text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
          返回顶部
        </div>
      </div>

      {/* 目录面板 */}
      {isOpen && (
        <div className="absolute right-0 top-16 w-80 max-h-96 bg-white rounded-lg shadow-xl border border-gray-200 overflow-hidden animate__animated animate__fadeIn animate__faster">
          <div className="p-4 border-b border-gray-200 bg-gradient-to-r from-[#f8f7ff] to-[#f0f4ff]">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-semibold text-gray-800">📚 文章目录</h3>
              <span className="text-xs bg-[#6c32fe] text-white px-2 py-1 rounded-full">
                {searchTerm ? `${filteredData.length}/${data.length}` : data.length}
              </span>
            </div>
            {/* 搜索框 */}
            <div className="relative">
              <input
                type="text"
                placeholder="搜索文章..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 pr-10 text-sm border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-[#6c32fe] focus:border-transparent bg-gray-50"
              />
              <svg
                className="absolute right-3 top-2.5 w-5 h-5 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
          </div>
          <div className="overflow-y-auto max-h-80">
            {filteredData.length === 0 ? (
              <div className="p-4 text-center text-gray-500 text-sm">
                没有找到相关文章
              </div>
            ) : (
              filteredData.map((item, index) => {
                const originalIndex = data.findIndex(d => d.title === item.title);
                return (
                  <div
                    key={originalIndex}
                    className={`p-3 border-b border-gray-100 hover:bg-gray-50 cursor-pointer transition-all duration-200 hover:scale-[1.02] ${
                      currentId === originalIndex ? "bg-[#f3f0ff] border-l-4 border-l-[#6c32fe]" : ""
                    }`}
                    onClick={() => handleNavigate(originalIndex)}
                  >
                    <div className="flex items-start gap-2">
                      <span className="inline-block w-5 h-5 bg-[#6c32fe] text-white text-xs rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        {originalIndex + 1}
                      </span>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-medium text-gray-900 truncate">
                          {item.title}
                        </h4>
                        <p className="text-xs text-gray-500 mt-1 line-clamp-2">
                          {item.desc}
                        </p>
                        <div className="flex items-center gap-2 mt-2">
                          <span className="inline-block px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded">
                            {item.tag}
                          </span>
                          <span className="text-xs text-gray-400">{item.date}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default FloatingToc;
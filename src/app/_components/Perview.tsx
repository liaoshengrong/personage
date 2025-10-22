"use client";
import dayjs from "dayjs";
import React, { useEffect } from "react";
import Link from "next/link";
import { useMobile } from "../hooks/useMobile";

interface IProps {
  data: DataType;
  index: number;
  onChoose: (data: DataType, index: number) => void;
  isActive: boolean;
}

const Perview = ({ data, index, onChoose, isActive }: IProps) => {
  const isMobile = useMobile();
  const { title, tag, desc, date } = data;
  const animatecss =
    index % 2 === 0 ? "animate__bounceInLeft" : "animate__bounceInRight";

  useEffect(() => {
    getFiles(tag, title);
  }, [tag, title]);

  const getTagColor = (tag: string) => {
    const colors: { [key: string]: string } = {
      'React': 'bg-blue-500/20 text-blue-400 border-blue-500/30',
      'Vue': 'bg-green-500/20 text-green-400 border-green-500/30',
      'JavaScript': 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
      'TypeScript': 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30',
      'Node.js': 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
      'CSS': 'bg-purple-500/20 text-purple-400 border-purple-500/30',
      'HTML': 'bg-orange-500/20 text-orange-400 border-orange-500/30',
      'AI': 'bg-pink-500/20 text-pink-400 border-pink-500/30',
      '工程化': 'bg-indigo-500/20 text-indigo-400 border-indigo-500/30',
      'Browser': 'bg-teal-500/20 text-teal-400 border-teal-500/30',
    };
    return colors[tag] || 'bg-gray-500/20 text-gray-400 border-gray-500/30';
  };

  return (
    <div
      className={`group relative cursor-pointer hover-lift animate__animated ${animatecss} ${
        isActive ? 'glow-cyan' : ''
      }`}
      onClick={() => onChoose(data, index)}
    >
      {/* Card Background */}
      <div className="relative glass rounded-xl p-6 transition-all duration-500 hover:glow-purple border border-white/10 hover:border-cyan-400/30">
        {/* Aurora Effect */}
        <div className="aurora rounded-xl"></div>
        
        {/* Content */}
        <div className="relative z-10">
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            {/* Date */}
            <div className="text-gray-400 font-mono text-sm">
              <span className="block">
                {dayjs(date).format("MMM DD, YYYY")}
              </span>
            </div>
            
            {/* Tag */}
              <span className="text-xs text-medium-contrast font-medium bg-gray-800/80 px-3 py-1 rounded-full border border-cyan-500/30 backdrop-blur-sm">
                {tag}
              </span>
          </div>

          {/* Title */}
          <h3 className={`text-xl font-bold mb-3 transition-all duration-300 text-high-contrast ${
            isActive 
              ? 'text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-600' 
              : 'text-gray-100'
          }`}>
            {title}
          </h3>

          {/* Description */}
          <p className="text-medium-contrast text-sm leading-relaxed mb-4 line-clamp-2 font-medium">
            {desc}
          </p>

          {/* Action Button */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-gradient-to-r from-cyan-400 to-purple-500 rounded-full animate-pulse"></div>
              <span className="text-xs text-gray-400">Click to read</span>
            </div>
            
            {isActive && !isMobile && (
              <Link
                className="px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg text-white text-xs font-medium hover:from-blue-500 hover:to-purple-500 transition-all duration-300 glow hover:glow-purple"
                href={`/detail/${index}`}
                onClick={(e) => e.stopPropagation()}
                prefetch
              >
                Read More
              </Link>
            )}
          </div>
        </div>

        {/* Corner decoration */}
        <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-cyan-500/20 to-purple-500/20 rounded-tr-xl rounded-bl-2xl opacity-60 group-hover:opacity-100 transition-opacity duration-300"></div>
        
        {/* Bottom glow */}
        <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-3/4 h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent opacity-0 group-hover:opacity-60 transition-opacity duration-300"></div>
      </div>
    </div>
  );
};

export default Perview;

const getFiles = (tag: string, title: string) => {
  const path = window.location.pathname + `files/${tag}/${title}.md`;
  const res = fetch(path)
    .then((r) => r.text())
    .then((r) => {
      localStorage.setItem(title, r);
    });

  return res;
};

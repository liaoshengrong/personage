// src/app/resume/ProjectCard.tsx
import React from "react";

interface ProjectCardProps {
  title: string;
  techStack: string;
  description: string;
  demoUrl?: string;
  points: string[];
}

const ProjectCard: React.FC<ProjectCardProps> = ({
  title,
  techStack,
  description,
  demoUrl,
  points,
}) => {
  // 将技术栈字符串分割为数组
  const techStackArray = techStack.split('、');
  
  return (
    <div className="mb-4 sm:mb-6 backdrop-blur-xl bg-gradient-to-br from-slate-800/30 to-slate-900/30 border border-cyan-500/20 rounded-2xl p-4 sm:p-6 transition-all duration-300 hover:border-cyan-500/40 hover:shadow-lg hover:shadow-cyan-500/10 group">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-2 sm:mb-3">
        <h3 className="text-lg sm:text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500 mb-1 sm:mb-0 transition-all duration-300 group-hover:from-cyan-300 group-hover:to-blue-400">
          {title}
        </h3>
        {demoUrl && (
          <a
            href={demoUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center px-3 sm:px-4 py-1.5 text-xs sm:text-sm text-cyan-300 bg-gradient-to-r from-slate-700/50 to-slate-800/50 border border-cyan-500/30 rounded-lg hover:border-cyan-400/50 hover:text-cyan-200 hover:shadow-md hover:shadow-cyan-500/20 transition-all duration-300 mt-1 sm:mt-0"
          >
            <svg className="w-3 h-3 sm:w-4 sm:h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
            Live Demo
          </a>
        )}
      </div>
      
      {/* 技术栈标签显示 */}
      <div className="flex flex-wrap gap-2 mb-3 sm:mb-4 leading-relaxed">
        {techStackArray.map((tech, index) => (
          <span 
            key={index} 
            className="bg-gradient-to-r from-slate-700/50 to-slate-800/50 border border-cyan-500/30 text-cyan-300 px-3 py-1 rounded-lg text-xs sm:text-sm whitespace-nowrap leading-relaxed backdrop-blur-sm transition-all duration-300 hover:border-cyan-400/50 hover:text-cyan-200 hover:shadow-md hover:shadow-cyan-500/20"
          >
            {tech}
          </span>
        ))}
      </div>
      
      {/* 项目描述 */}
      <p className="mb-3 sm:mb-4 text-gray-300 leading-relaxed text-sm sm:text-base transition-all duration-300 group-hover:text-gray-200">
        {description}
      </p>
      
      {/* 项目亮点 */}
      <ol className="space-y-2 sm:space-y-3 text-gray-400 leading-relaxed text-sm sm:text-base">
        {points.map((point, index) => (
          <li key={index} className="flex items-start leading-relaxed group/item">
            <span className="flex-shrink-0 w-5 h-5 sm:w-6 sm:h-6 rounded-lg bg-gradient-to-r from-cyan-500/20 to-blue-600/20 text-cyan-300 flex items-center justify-center text-xs mr-3 mt-0.5 leading-relaxed transition-all duration-300 group-hover/item:from-cyan-400/30 group-hover/item:to-blue-500/30 group-hover/item:text-cyan-200">
              {index + 1}
            </span>
            <span className="leading-relaxed transition-all duration-300 group-hover/item:text-gray-200">{point}</span>
          </li>
        ))}
      </ol>
    </div>
  );
};

export default ProjectCard;

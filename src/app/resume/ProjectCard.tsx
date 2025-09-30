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
    <div className="mb-4 sm:mb-6 bg-white rounded-lg sm:rounded-xl p-4 sm:p-6 border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-2 sm:mb-3">
        <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-1 sm:mb-0">
          {title}
        </h3>
        {demoUrl && (
          <a
            href={demoUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center px-2 sm:px-3 py-1 text-xs sm:text-sm text-blue-600 bg-blue-50 rounded-full hover:bg-blue-100 transition-colors mt-1 sm:mt-0"
          >
            <svg className="w-3 h-3 sm:w-4 sm:h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
            在线体验
          </a>
        )}
      </div>
      
      {/* 技术栈标签显示 */}
      <div className="flex flex-wrap gap-1 mb-3 sm:mb-4 leading-relaxed">
        {techStackArray.map((tech, index) => (
          <span 
            key={index} 
            className="bg-green-50 text-green-700 px-2 py-0.5 rounded-md text-xs sm:text-sm whitespace-nowrap leading-relaxed"
          >
            {tech}
          </span>
        ))}
      </div>
      
      {/* 项目描述 */}
      <p className="mb-3 sm:mb-4 text-gray-700 leading-relaxed text-sm sm:text-base">
        {description}
      </p>
      
      {/* 项目亮点 */}
      <ol className="space-y-1 sm:space-y-2 text-gray-700 leading-relaxed text-sm sm:text-base">
        {points.map((point, index) => (
          <li key={index} className="flex items-start leading-relaxed">
            <span className="flex-shrink-0 w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-green-100 text-green-600 flex items-center justify-center text-xs mr-2 mt-0.5 leading-relaxed">
              {index + 1}
            </span>
            <span className="leading-relaxed">{point}</span>
          </li>
        ))}
      </ol>
    </div>
  );
};

export default ProjectCard;

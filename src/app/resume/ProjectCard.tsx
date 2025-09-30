// src/app/resume/ProjectCard.tsx
import React from "react";

interface ProjectCardProps {
  title: string;
  techStack: string;
  description: string;
  points: string[];
}

const ProjectCard: React.FC<ProjectCardProps> = ({
  title,
  techStack,
  description,
  points,
}) => {
  // 将技术栈字符串分割为数组
  const techStackArray = techStack.split('、');
  
  return (
    <div className="mb-6 bg-white rounded-xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-3">
        <h3 className="text-xl font-bold text-gray-800">
          {title}
        </h3>
      </div>
      
      {/* 技术栈标签显示 */}
      <div className="flex flex-wrap gap-1 mb-4 leading-relaxed">
        {techStackArray.map((tech, index) => (
          <span 
            key={index} 
            className="bg-green-50 text-green-700 px-2 py-0.5 rounded-md text-sm whitespace-nowrap leading-relaxed"
          >
            {tech}
          </span>
        ))}
      </div>
      
      {/* 项目描述 */}
      <p className="mb-4 text-gray-700 leading-relaxed">
        {description}
      </p>
      
      {/* 项目亮点 */}
      <ol className="space-y-2 text-gray-700 leading-relaxed">
        {points.map((point, index) => (
          <li key={index} className="flex items-start leading-relaxed">
            <span className="flex-shrink-0 w-5 h-5 rounded-full bg-green-100 text-green-600 flex items-center justify-center text-xs mr-2 mt-0.5 leading-relaxed">
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

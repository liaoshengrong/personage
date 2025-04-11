// src/app/resume/components/ProjectCard.tsx
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
  return (
    <div className="mb-8 xs:mb-5">
      <h3 className="text-xl xs:text-base font-bold text-gray-800 mb-2">
        {title}
      </h3>
      <p className="text-gray-500 xs:text-sm">技术栈：{techStack}</p>
      <p className="mt-2 text-gray-600 leading-6 xs:leading-5 xs:text-sm">
        {description}
      </p>
      <ol className="list-decimal list-inside mt-2 space-y-1 text-gray-600">
        {points.map((point, index) => (
          <li key={index} className="leading-6 xs:leading-5 xs:text-sm">
            {point}
          </li>
        ))}
      </ol>
    </div>
  );
};

export default ProjectCard;

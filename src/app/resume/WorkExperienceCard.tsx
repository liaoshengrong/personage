import React from 'react';
import { WorkExperience } from './types';

interface WorkExperienceCardProps {
  experience: WorkExperience;
  colorTheme: {
    primary: string;
    secondary: string;
    bg: string;
    text: string;
  };
}

const WorkExperienceCard: React.FC<WorkExperienceCardProps> = ({ 
  experience, 
  colorTheme 
}) => {
  return (
    <div className={`mb-8 bg-white rounded-xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300`}>
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-3">
        <h3 className="text-xl font-bold text-gray-800">
          {experience.company}
        </h3>
        <p className={`text-sm font-medium ${colorTheme.primary} mt-1 md:mt-0`}>
          {experience.duration}
        </p>
      </div>
      <p className="text-gray-600 font-medium mb-3 leading-relaxed">{experience.position}</p>
      <ul className="space-y-2 text-gray-700 leading-relaxed">
        <li className="flex items-start leading-relaxed">
          <span className={`${colorTheme.secondary} mr-2 mt-1`}>•</span>
          <span className="leading-relaxed">{experience.description}</span>
        </li>
        <li className="flex items-start leading-relaxed">
          <span className={`${colorTheme.secondary} mr-2 mt-1`}>•</span>
          <span className="font-medium leading-relaxed">技术栈：</span>
          <div className="ml-1 flex flex-wrap gap-1 leading-relaxed">
            {experience.techStack.map((tech, index) => (
              <span 
                key={index} 
                className={`${colorTheme.bg} ${colorTheme.text} px-2 py-0.5 rounded-md text-sm leading-relaxed`}
              >
                {tech}
              </span>
            ))}
          </div>
        </li>
      </ul>
    </div>
  );
};

export default WorkExperienceCard;
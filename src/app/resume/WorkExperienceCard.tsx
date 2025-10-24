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
    <div className={`mb-6 sm:mb-8 backdrop-blur-xl bg-gradient-to-br from-slate-800/30 to-slate-900/30 border border-cyan-500/20 rounded-2xl p-4 sm:p-6 transition-all duration-300 hover:border-cyan-500/40 hover:shadow-lg hover:shadow-cyan-500/10 group`}>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-2 sm:mb-3">
        <h3 className="text-lg sm:text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500 transition-all duration-300 group-hover:from-cyan-300 group-hover:to-blue-400">
          {experience.company}
        </h3>
        <p className={`text-xs sm:text-sm font-medium text-cyan-400 mt-1 sm:mt-0 transition-all duration-300 group-hover:text-cyan-300`}>
          {experience.duration}
        </p>
      </div>
      <p className="text-gray-300 font-medium mb-2 sm:mb-3 leading-relaxed text-sm sm:text-base transition-all duration-300 group-hover:text-gray-200">{experience.position}</p>
      <ul className="space-y-2 sm:space-y-3 text-gray-400 leading-relaxed text-sm sm:text-base">
        <li className="flex items-start leading-relaxed group/item">
          <span className={`text-cyan-400 mr-3 mt-1 flex-shrink-0 transition-all duration-300 group-hover/item:text-cyan-300`}>•</span>
          <span className="leading-relaxed transition-all duration-300 group-hover/item:text-gray-200">{experience.description}</span>
        </li>
        <li className="flex items-start leading-relaxed">
          <span className={`text-cyan-400 mr-3 mt-1 flex-shrink-0`}>•</span>
          <span className="font-medium leading-relaxed text-gray-300">Tech Stack:</span>
          <div className="ml-2 flex flex-wrap gap-2 leading-relaxed">
            {experience.techStack.map((tech, index) => (
              <span 
                key={index} 
                className={`bg-gradient-to-r from-slate-700/50 to-slate-800/50 border border-cyan-500/30 text-cyan-300 px-3 py-1 rounded-lg text-xs sm:text-sm leading-relaxed backdrop-blur-sm transition-all duration-300 hover:border-cyan-400/50 hover:text-cyan-200 hover:shadow-md hover:shadow-cyan-500/20`}
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
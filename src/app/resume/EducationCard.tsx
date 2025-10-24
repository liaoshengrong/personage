import React from 'react';
import { Education } from './types';

interface EducationCardProps {
  education: Education;
}

const EducationCard: React.FC<EducationCardProps> = ({ education }) => {
  return (
    <div className="mb-4 sm:mb-6 backdrop-blur-xl bg-gradient-to-br from-slate-800/30 to-slate-900/30 border border-cyan-500/20 rounded-2xl p-4 sm:p-6 transition-all duration-300 hover:border-cyan-500/40 hover:shadow-lg hover:shadow-cyan-500/10 group">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-2 sm:mb-3">
        <h3 className="text-lg sm:text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500 mb-1 sm:mb-0 transition-all duration-300 group-hover:from-cyan-300 group-hover:to-blue-400">
          {education.school}
        </h3>
        <p className="text-xs sm:text-sm font-medium text-cyan-400 mt-1 sm:mt-0 transition-all duration-300 group-hover:text-cyan-300">
          {education.duration}
        </p>
      </div>
      <p className="text-gray-300 mb-2 leading-relaxed text-sm sm:text-base transition-all duration-300 group-hover:text-gray-200">{education.degree}</p>
      {education.description && (
        <p className="text-gray-400 leading-relaxed text-sm sm:text-base transition-all duration-300 group-hover:text-gray-300">
          {education.description}
        </p>
      )}
    </div>
  );
};

export default EducationCard;
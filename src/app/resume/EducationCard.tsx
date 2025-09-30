import React from 'react';
import { Education } from './types';

interface EducationCardProps {
  education: Education;
}

const EducationCard: React.FC<EducationCardProps> = ({ education }) => {
  return (
    <div className="mb-4 sm:mb-6 bg-white rounded-lg sm:rounded-xl p-4 sm:p-6 border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-2 sm:mb-3">
        <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-1 sm:mb-0">
          {education.school}
        </h3>
        <p className="text-xs sm:text-sm font-medium text-amber-600 mt-1 sm:mt-0">
          {education.duration}
        </p>
      </div>
      <p className="text-gray-600 mb-2 leading-relaxed text-sm sm:text-base">{education.degree}</p>
      {education.description && (
        <p className="text-gray-700 leading-relaxed text-sm sm:text-base">
          {education.description}
        </p>
      )}
    </div>
  );
};

export default EducationCard;
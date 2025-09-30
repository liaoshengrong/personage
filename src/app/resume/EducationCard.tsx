import React from 'react';
import { Education } from './types';

interface EducationCardProps {
  education: Education;
}

const EducationCard: React.FC<EducationCardProps> = ({ education }) => {
  return (
    <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-2">
        <h3 className="text-xl font-bold text-gray-800">
          {education.school}
        </h3>
        <p className="text-sm font-medium text-amber-600 mt-1 md:mt-0">
          {education.duration}
        </p>
      </div>
      <p className="text-gray-600 mb-2 leading-relaxed">{education.degree}</p>
      {education.description && (
        <p className="text-sm text-gray-700 leading-relaxed">
          {education.description}
        </p>
      )}
    </div>
  );
};

export default EducationCard;
import React from 'react';
import { SkillItem } from './types';

interface SkillsSectionProps {
  skills: SkillItem[];
}

const SkillsSection: React.FC<SkillsSectionProps> = ({ skills }) => {
  return (
    <div className="bg-gray-50 rounded-lg sm:rounded-xl p-4 sm:p-6 transition-all duration-300 hover:shadow-md">
      <ul className="space-y-2 sm:space-y-3 text-gray-700 leading-relaxed">
        {skills.map((skill, index) => (
          <li key={index} className="flex items-start leading-relaxed text-sm sm:text-base">
            <span className="text-blue-500 mr-2 mt-1 flex-shrink-0">•</span>
            <span className="leading-relaxed">{skill.text}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SkillsSection;
import React from 'react';
import { SkillItem } from './types';

interface SkillsSectionProps {
  skills: SkillItem[];
}

const SkillsSection: React.FC<SkillsSectionProps> = ({ skills }) => {
  return (
    <div className="backdrop-blur-xl bg-gradient-to-br from-slate-800/30 to-slate-900/30 border border-cyan-500/20 rounded-2xl p-4 sm:p-6 transition-all duration-300 hover:border-cyan-500/40 hover:shadow-lg hover:shadow-cyan-500/10">
      <ul className="space-y-3 sm:space-y-4 text-gray-300 leading-relaxed">
        {skills.map((skill, index) => (
          <li key={index} className="flex items-start leading-relaxed text-sm sm:text-base group">
            <span className="text-cyan-400 mr-3 mt-1 flex-shrink-0 transition-all duration-300 group-hover:text-cyan-300 group-hover:scale-110">•</span>
            <span className="leading-relaxed transition-all duration-300 group-hover:text-gray-200">{skill.text}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SkillsSection;
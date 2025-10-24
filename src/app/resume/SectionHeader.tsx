import React from 'react';
import { SectionHeaderProps } from './types';

const SectionHeader: React.FC<SectionHeaderProps> = ({ 
  icon, 
  title, 
  bgColor, 
  iconColor 
}) => {
  return (
    <div className="flex items-center mb-4 sm:mb-6 group">
      <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-xl ${bgColor} flex items-center justify-center mr-2 sm:mr-3 border border-cyan-500/30 shadow-lg shadow-cyan-500/10 transition-all duration-300 group-hover:scale-105 group-hover:shadow-cyan-500/20`}>
        <span className={`${iconColor} text-lg sm:text-xl transition-all duration-300 group-hover:scale-110`}>{icon}</span>
      </div>
      <h2 className="text-xl sm:text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500 transition-all duration-300 group-hover:from-cyan-300 group-hover:to-blue-400">{title}</h2>
    </div>
  );
};

export default SectionHeader;
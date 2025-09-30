import React from 'react';
import { SectionHeaderProps } from './types';

const SectionHeader: React.FC<SectionHeaderProps> = ({ 
  icon, 
  title, 
  bgColor, 
  iconColor 
}) => {
  return (
    <div className="flex items-center mb-4 sm:mb-6">
      <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full ${bgColor} flex items-center justify-center mr-2 sm:mr-3`}>
        <span className={`${iconColor} text-lg sm:text-xl`}>{icon}</span>
      </div>
      <h2 className="text-xl sm:text-2xl font-bold text-gray-800">{title}</h2>
    </div>
  );
};

export default SectionHeader;
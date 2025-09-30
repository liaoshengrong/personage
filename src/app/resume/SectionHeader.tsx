import React from 'react';
import { SectionHeaderProps } from './types';

const SectionHeader: React.FC<SectionHeaderProps> = ({ 
  icon, 
  title, 
  bgColor, 
  iconColor 
}) => {
  return (
    <div className="flex items-center mb-6">
      <div className={`w-10 h-10 rounded-full ${bgColor} flex items-center justify-center mr-3`}>
        <span className={`${iconColor} text-xl`}>{icon}</span>
      </div>
      <h2 className="text-2xl font-bold text-gray-800">{title}</h2>
    </div>
  );
};

export default SectionHeader;
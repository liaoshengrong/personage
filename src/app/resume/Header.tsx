import React from 'react';

interface HeaderProps {
  name: string;
  age: string;
  experience: string;
  email: string;
  website: string;
}

const Header: React.FC<HeaderProps> = ({ 
  name, 
  age, 
  experience, 
  email, 
  website 
}) => {
  return (
    <header className="mb-8 sm:mb-12 pb-4 sm:pb-6 border-b border-gray-100">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 sm:gap-4">
        <div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-800 tracking-tight leading-tight">
            {name}
          </h1>
          <p className="mt-1 sm:mt-2 text-lg sm:text-xl text-gray-600 leading-relaxed">
            {age} | {experience}
          </p>
        </div>
        <div className="flex flex-col items-start sm:items-end text-sm text-gray-600 gap-1 sm:gap-2 leading-relaxed">
          <p className="flex items-center gap-2 leading-relaxed">
            <span className="text-blue-500">📧</span>
            <span className="hover:text-blue-500 transition-colors leading-relaxed break-all">{email}</span>
          </p>
          <p className="flex items-center gap-2 leading-relaxed">
            <span className="text-blue-500">🔗</span>
            <a
              href={website}
              className="text-blue-500 hover:text-blue-600 hover:underline transition-colors leading-relaxed break-all"
              target="_blank"
              rel="noopener noreferrer"
            >
              {website.replace('https://', '').replace('/', '')}
            </a>
          </p>
        </div>
      </div>
    </header>
  );
};

export default Header;
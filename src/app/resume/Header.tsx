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
    <header className="mb-8 sm:mb-12 pb-4 sm:pb-6 border-b border-cyan-500/30">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 sm:gap-4">
        <div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 tracking-tight leading-tight animate__animated animate__fadeInUp">
            {name}
          </h1>
          <p className="mt-1 sm:mt-2 text-lg sm:text-xl text-gray-300 leading-relaxed animate__animated animate__fadeInUp animate__delay-1s">
            {age} | {experience}
          </p>
        </div>
        <div className="flex flex-col items-start sm:items-end text-sm text-gray-400 gap-1 sm:gap-2 leading-relaxed">
          <p className="flex items-center gap-2 leading-relaxed group">
            <span className="text-cyan-400 group-hover:text-cyan-300 transition-colors duration-300">📧</span>
            <span className="group-hover:text-cyan-300 transition-colors duration-300 leading-relaxed break-all">{email}</span>
          </p>
          <p className="flex items-center gap-2 leading-relaxed group">
            <span className="text-blue-400 group-hover:text-blue-300 transition-colors duration-300">🔗</span>
            <a
              href={website}
              className="text-blue-400 hover:text-blue-300 hover:underline transition-all duration-300 leading-relaxed break-all"
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
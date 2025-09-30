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
    <header className="mb-12 pb-6 border-b border-gray-100">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 tracking-tight leading-tight">
            {name}
          </h1>
          <p className="mt-2 text-xl text-gray-600 leading-relaxed">
            {age} | {experience}
          </p>
        </div>
        <div className="flex flex-col items-start md:items-end text-sm text-gray-600 gap-2 leading-relaxed">
          <p className="flex items-center gap-2 leading-relaxed">
            <span className="text-blue-500">📧</span>
            <span className="hover:text-blue-500 transition-colors leading-relaxed">{email}</span>
          </p>
          <p className="flex items-center gap-2 leading-relaxed">
            <span className="text-blue-500">🔗</span>
            <a
              href={website}
              className="text-blue-500 hover:text-blue-600 hover:underline transition-colors leading-relaxed"
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
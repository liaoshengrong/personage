import React from "react";
interface IProps {
  children: React.ReactNode;
  className?: string;
}
const PageContainer = ({ children, className }: IProps) => {
  return (
    <div
      className={`min-h-screen p-8 bg-gradient-to-br from-gray-900 via-slate-800 to-gray-900 text-gray-100 overflow-y-auto flex flex-col xs:p-5 ${className}`}
    >
      {children}
    </div>
  );
};

export default PageContainer;

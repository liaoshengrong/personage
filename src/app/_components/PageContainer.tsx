import React from "react";
interface IProps {
  children: React.ReactNode;
  className?: string;
}
const PageContainer = ({ children, className }: IProps) => {
  return (
    <div
      className={`min-h-screen p-8 bg-gray-200 flex flex-col xs:p-5 xs:bg-white ${className}`}
    >
      {children}
    </div>
  );
};

export default PageContainer;

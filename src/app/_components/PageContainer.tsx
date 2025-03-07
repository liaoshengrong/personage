import React from "react";

const PageContainer = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="h-screen p-8 bg-gray-200 overflow-y-auto custom-scrollbar flex flex-col">
      {children}
    </div>
  );
};

export default PageContainer;

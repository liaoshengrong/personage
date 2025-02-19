import React from "react";

const PageContainer = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="min-h-screen p-8 h-full bg-gray-200 overflow-y-auto custom-scrollbar">
      {children}
    </div>
  );
};

export default PageContainer;

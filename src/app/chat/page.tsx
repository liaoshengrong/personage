import React from "react";
import PageContainer from "../_components/PageContainer";
import Navbar from "../_components/Navbar";
import ChatCom from "./ChatCom";

export const metadata = {
  title: "个人AI助手",
};

const Index = () => {
  return (
    <PageContainer className="xs:!p-0 xs:pt-5">
      <div className="xs:px-5">
        <Navbar />
      </div>
      
      {/* Page Header */}
      <div className="text-center">
        <div className="flex justify-center mt-4 xs:mt-3">
          <div className="h-1 w-20 bg-gradient-to-r from-cyan-400 to-purple-600 rounded-full"></div>
        </div>
      </div>

      <ChatCom />
      
      {/* Background Elements */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-cyan-500/10 to-blue-600/10 rounded-full blur-3xl animate-float" style={{animationDelay: '0s'}}></div>
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-gradient-to-r from-purple-500/10 to-pink-600/10 rounded-full blur-3xl animate-float" style={{animationDelay: '2s'}}></div>
        <div className="absolute top-1/2 right-1/3 w-64 h-64 bg-gradient-to-r from-blue-500/10 to-cyan-600/10 rounded-full blur-2xl animate-float" style={{animationDelay: '4s'}}></div>
        
        {/* 添加粒子效果 */}
        <div className="absolute top-1/3 left-1/3 w-2 h-2 bg-cyan-400 rounded-full animate-pulse-glow" style={{animationDelay: '1s'}}></div>
        <div className="absolute top-2/3 right-1/3 w-1 h-1 bg-purple-500 rounded-full animate-pulse-glow" style={{animationDelay: '3s'}}></div>
        <div className="absolute top-1/2 left-1/2 w-3 h-3 bg-blue-500 rounded-full animate-pulse-glow" style={{animationDelay: '5s'}}></div>
      </div>
    </PageContainer>
  );
};

export default Index;

// 添加自定义动画样式
const customStyles = `
  @keyframes float {
    0%, 100% { transform: translateY(0px); }
    50% { transform: translateY(-10px); }
  }
  
  @keyframes pulse-glow {
    0%, 100% { opacity: 0.6; }
    50% { opacity: 1; }
  }
  
  .animate-float {
    animation: float 6s ease-in-out infinite;
  }
  
  .animate-pulse-glow {
    animation: pulse-glow 3s ease-in-out infinite;
  }
`;

// 在组件加载时注入样式
if (typeof document !== 'undefined') {
  const styleElement = document.createElement('style');
  styleElement.textContent = customStyles;
  document.head.appendChild(styleElement);
}

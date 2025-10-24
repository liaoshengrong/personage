import React, { use } from "react";
import Navbar from "../_components/Navbar";
import PageContainer from "../_components/PageContainer";
import Drag from "./_components/Drag";
import Tabs from "./_components/Tabs";
import ShortVideo from "./_components/ShortVideo";
import { getVideoData, getWallpaper } from "./api";
import Wallpaper from "./_components/Wallpaper";
import ReactSpring from "./_components/ReactSpring";

const Index = ({
  searchParams,
}: {
  searchParams: Promise<{ tab?: string }>;
}) => {
  const video = use(getVideoData());
  const wallpapers = use(getWallpaper());
  const { tab } = searchParams ? use(searchParams) : {};

  return (
    <PageContainer className={tab === "3" ? "xs:px-0" : ""}>
      <Navbar />
      <Tabs titles={tabs} defalultTab={tab}>
        <ShortVideo data={[video]} />
        <Drag />
        <Wallpaper data={wallpapers} />
        <ReactSpring carousel={wallpapers} />
      </Tabs>
      
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

const tabs = ["短视频", "文件解析", "精美壁纸", "React动画"];

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

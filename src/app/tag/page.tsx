import React from "react";
import Navbar from "../_components/Navbar";
import ProgressBar from "./ProgressBar";
import PageContainer from "../_components/PageContainer";

const Index = () => {
  return (
    <PageContainer>
      <Navbar />
      <div className="min-h-screen px-6 py-12 xs:px-4 xs:py-6">
        {/* Page Header */}
        <div className="text-center mb-16 xs:mb-8">
          <h1 className="text-5xl xs:text-3xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 neon-text">
            Technical Skills
          </h1>
          <p className="text-xl xs:text-lg text-medium-contrast max-w-2xl mx-auto font-medium">
            Proficiency levels across various technologies and frameworks
          </p>
        </div>

        {/* Skills Progress Section */}
        <div className="max-w-4xl mx-auto">
          <div className="glass rounded-2xl p-8 xs:p-6 backdrop-blur-lg border border-white/10 hover-lift">
            <div className="space-y-6">
              {tagArr.map((item, index) => (
                <ProgressBar
                  key={index}
                  title={item.title}
                  percentage={item.percentage}
                  index={index}
                />
              ))}
            </div>
          </div>
        </div>

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

const tagArr = [
  {
    title: "HTML",
    percentage: 90,
  },
  {
    title: "CSS",
    percentage: 90,
  },
  {
    title: "JS",
    percentage: 85,
  },
  {
    title: "TS",
    percentage: 85,
  },
  {
    title: "React",
    percentage: 85,
  },
  {
    title: "Git",
    percentage: 80,
  },
  {
    title: "Nextjs",
    percentage: 75,
  },
  {
    title: "Taro",
    percentage: 70,
  },
  {
    title: "Webpack",
    percentage: 70,
  },
  {
    title: "Vue2",
    percentage: 65,
  },
  {
    title: "Vue3",
    percentage: 65,
  },
  {
    title: "Vite",
    percentage: 60,
  },
  {
    title: "Umijs",
    percentage: 60,
  },
  {
    title: "Jest",
    percentage: 55,
  },
];

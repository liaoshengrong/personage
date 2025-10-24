"use client";

import React from 'react';
import Navbar from "../_components/Navbar";
import PageContainer from "../_components/PageContainer";
import Header from './Header';
import SectionHeader from './SectionHeader';
import SkillsSection from './SkillsSection';
import WorkExperienceCard from './WorkExperienceCard';
import ProjectCard from './ProjectCard';
import EducationCard from './EducationCard';
import { 
  skillsData, 
  workExperienceData, 
  projectsData, 
  educationData 
} from './data';

const Resume: React.FC = () => {
  // 配置常量
  const personalInfo = {
    name: '廖声荣',
    age: '26岁',
    experience: '5年前端开发经验',
    email: '14796743426@163.com',
    website: 'https://shengrong.netlify.app/'
  };

  // 颜色主题配置
  const colorThemes = {
    work: {
      primary: 'text-indigo-600',
      secondary: 'text-indigo-500',
      bg: 'bg-indigo-50',
      text: 'text-indigo-700'
    }
  };

  return (
    <PageContainer className="min-h-screen">
      {/* 背景装饰元素 */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* 渐变圆形 */}
        <div className="absolute top-20 left-10 w-96 h-96 bg-gradient-to-br from-cyan-500/20 to-blue-600/20 rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-40 right-20 w-80 h-80 bg-gradient-to-br from-purple-500/20 to-pink-600/20 rounded-full blur-3xl animate-float-delayed"></div>
        <div className="absolute top-1/2 left-1/2 w-72 h-72 bg-gradient-to-br from-emerald-500/15 to-teal-600/15 rounded-full blur-3xl animate-float-slow"></div>
        
        {/* 粒子效果 */}
        <div className="absolute top-1/4 right-1/4 w-2 h-2 bg-cyan-400 rounded-full animate-pulse-glow"></div>
        <div className="absolute bottom-1/3 left-1/3 w-1.5 h-1.5 bg-blue-400 rounded-full animate-pulse-glow-delayed"></div>
        <div className="absolute top-3/4 right-1/3 w-1 h-1 bg-purple-400 rounded-full animate-pulse-glow-slow"></div>
      </div>

      <div className="relative z-10 px-4 sm:px-5">
        <Navbar />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto mt-4 sm:mt-6 mb-8 sm:mb-12 px-4 sm:px-6 lg:px-8">
        <div className="backdrop-blur-xl bg-gradient-to-br from-slate-900/50 to-slate-800/50 border border-cyan-500/30 shadow-2xl shadow-cyan-500/10 rounded-2xl overflow-hidden transition-all duration-300 ease-in-out">
          <div className="p-4 sm:p-6 md:p-8 lg:p-10">
            {/* 头部信息 */}
            <Header {...personalInfo} />

            {/* 个人技能 */}
            <section className="mb-12">
              <SectionHeader 
                icon="🔧" 
                title="Technical Skills" 
                bgColor="bg-blue-100" 
                iconColor="text-blue-600" 
              />
              <SkillsSection skills={skillsData} />
            </section>

            {/* 工作经历 */}
            <section className="mb-12">
              <SectionHeader 
                icon="💼" 
                title="Work Experience" 
                bgColor="bg-indigo-100" 
                iconColor="text-indigo-600" 
              />
              {workExperienceData.map((experience, index) => (
                <WorkExperienceCard 
                  key={index}
                  experience={experience}
                  colorTheme={colorThemes.work}
                />
              ))}
            </section>

            {/* 项目经验 */}
            <section className="mb-12">
              <SectionHeader 
                icon="💻" 
                title="Project Experience" 
                bgColor="bg-green-100" 
                iconColor="text-green-600" 
              />
              {projectsData.map((project, index) => (
                <ProjectCard key={index} {...project} />
              ))}
            </section>

            {/* 教育经历 */}
            <section>
              <SectionHeader 
                icon="🎓" 
                title="Education" 
                bgColor="bg-amber-100" 
                iconColor="text-amber-600" 
              />
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                {educationData.map((education, index) => (
                  <EducationCard key={index} education={education} />
                ))}
              </div>
            </section>
          </div>
        </div>
      </div>
      
      {/* 自定义动画样式 */}
      <style jsx global>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(180deg); }
        }
        @keyframes float-delayed {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-30px) rotate(-180deg); }
        }
        @keyframes float-slow {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-25px) rotate(90deg); }
        }
        @keyframes pulse-glow {
          0%, 100% { opacity: 0.3; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.2); }
        }
        @keyframes pulse-glow-delayed {
          0%, 100% { opacity: 0.5; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.5); }
        }
        @keyframes pulse-glow-slow {
          0%, 100% { opacity: 0.2; transform: scale(1); }
          50% { opacity: 0.8; transform: scale(1.3); }
        }
        .animate-float {
          animation: float 8s ease-in-out infinite;
        }
        .animate-float-delayed {
          animation: float-delayed 10s ease-in-out infinite;
          animation-delay: 2s;
        }
        .animate-float-slow {
          animation: float-slow 12s ease-in-out infinite;
          animation-delay: 4s;
        }
        .animate-pulse-glow {
          animation: pulse-glow 3s ease-in-out infinite;
        }
        .animate-pulse-glow-delayed {
          animation: pulse-glow-delayed 4s ease-in-out infinite;
          animation-delay: 1s;
        }
        .animate-pulse-glow-slow {
          animation: pulse-glow-slow 5s ease-in-out infinite;
          animation-delay: 2s;
        }
      `}</style>
    </PageContainer>
  );
};

export default Resume;

import React from "react";
import Navbar from "../_components/Navbar";
import Breadcrumb from "../_components/Breadcrumb";
import PageContainer from "../_components/PageContainer";
import Header from "./Header";
import SectionHeader from "./SectionHeader";
import SkillsSection from "./SkillsSection";
import WorkExperienceCard from "./WorkExperienceCard";
import ProjectCard from "./ProjectCard";
import EducationCard from "./EducationCard";
import {
  skillsData,
  workExperienceData,
  projectsData,
  educationData,
} from "./data";

const Resume = () => {
  const personalInfo = {
    name: "廖声荣",
    age: "26岁",
    experience: "5年前端开发经验",
    email: "14796743426@163.com",
    website: "https://shengrong.netlify.app/",
  };

  const colorThemes = {
    work: {
      primary: "text-indigo-600",
      secondary: "text-indigo-500",
      bg: "bg-indigo-50",
      text: "text-indigo-700",
    },
  };

  return (
    <PageContainer className="bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen">
      <div className="px-4 sm:px-5">
        <Navbar />
      </div>

      <div className="max-w-5xl mx-auto mt-4 sm:mt-6 mb-8 sm:mb-12">
        <div className="flex justify-between items-center px-4 sm:px-0 mb-4">
          <Breadcrumb />
        </div>

        <div
          id="ResumeCardContainer"
          className="bg-white rounded-xl sm:rounded-2xl shadow-lg sm:shadow-xl overflow-hidden transition-all duration-300 ease-in-out"
        >
          <div className="p-4 sm:p-6 md:p-10">
            <Header {...personalInfo} />

            <section className="mb-12">
              <SectionHeader
                icon="🔧"
                title="个人技能"
                bgColor="bg-blue-100"
                iconColor="text-blue-600"
              />
              <SkillsSection skills={skillsData} />
            </section>

            <section className="mb-12">
              <SectionHeader
                icon="💼"
                title="工作经历"
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

            <section className="mb-12">
              <SectionHeader
                icon="💻"
                title="项目经验"
                bgColor="bg-green-100"
                iconColor="text-green-600"
              />
              {projectsData.map((project, index) => (
                <ProjectCard key={index} {...project} />
              ))}
            </section>

            <section>
              <SectionHeader
                icon="🎓"
                title="教育经历"
                bgColor="bg-amber-100"
                iconColor="text-amber-600"
              />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {educationData.map((education, index) => (
                  <EducationCard key={index} education={education} />
                ))}
              </div>
            </section>
          </div>
        </div>
      </div>
    </PageContainer>
  );
};

export default Resume;

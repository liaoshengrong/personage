// 简历数据类型定义
export interface SkillItem {
  text: string;
}

export interface WorkExperience {
  company: string;
  position: string;
  duration: string;
  description: string;
  techStack: string[];
}

export interface Project {
  title: string;
  techStack: string;
  description: string;
  demoUrl?: string;
  points: string[];
}

export interface Education {
  school: string;
  degree: string;
  duration: string;
  description?: string;
}

export interface SectionHeaderProps {
  icon: string;
  title: string;
  bgColor: string;
  iconColor: string;
}
import React from "react";
import Navbar from "../_components/Navbar";
import Breadcrumb from "../_components/Breadcrumb";
import ProgressBar from "./ProgressBar";
import PageContainer from "../_components/PageContainer";

const Index = () => {
  return (
    <PageContainer>
      <Navbar />
      <div className="w-full max-w-xl mx-auto rounded-md p-5 mt-5">
        <Breadcrumb />
        {tagArr.map((item, index) => (
          <ProgressBar
            key={index}
            title={item.title}
            percentage={item.percentage}
            index={index}
          />
        ))}
      </div>
    </PageContainer>
  );
};

export default Index;

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

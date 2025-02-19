import React from "react";
import Navbar from "../_components/Navbar";
import ProgressBar from "../_components/ProgressBar";

const Index = () => {
  return (
    <div className="min-h-screen p-8 h-full bg-gray-200">
      <Navbar />
      <div className="w-full max-w-xl  mx-auto rounded-md p-5 mt-5">
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

import React from "react";
import List from "./_components/List";
import data from "@/config/data.json";
import vitaeIcon from "./_images/vitae.svg";
import skillIcon from "./_images/skill.svg";
import Icon, { Tip } from "./_components/Icon";

const Index = () => {
  return (
    <div className="min-h-screen p-8 h-full">
      <div className="text-base mb-2 text-center font-en text-black/80 tracking-widest animate__animated animate__backInUp">
        MARK LIAO
      </div>
      <div className="flex gap-1 items-center justify-center">
        <div className="group relative">
          <Icon src={skillIcon} direction="left" />
          <Tip title="技能标签" />
        </div>
        <div className="group relative">
          <Icon src={vitaeIcon} direction="right" />
          <Tip title="个人简历" />
        </div>
      </div>
      <List data={data} />
    </div>
  );
};

export default Index;

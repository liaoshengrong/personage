import React from "react";
import Icon, { Tip } from "./Icon";
import vitaeIcon from "../_images/vitae.svg";
import skillIcon from "../_images/skill.svg";
import Link from "next/link";
const Navbar = () => {
  return (
    <>
      <div className="text-base mb-2 text-center font-en text-black/80 tracking-widest animate__animated animate__backInUp">
        <Link href="/"> MARK LIAO</Link>
      </div>
      <div className="flex gap-1 items-center justify-center">
        <div className="group relative">
          <Icon src={skillIcon} direction="left" path="/tag" />
          <Tip title="技能标签" />
        </div>
        <div className="group relative">
          <Icon src={vitaeIcon} direction="right" path="/resume" />
          <Tip title="个人简历" />
        </div>
      </div>
    </>
  );
};

export default Navbar;

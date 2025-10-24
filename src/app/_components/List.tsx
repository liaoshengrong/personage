"use client";
import data from "@/config/data.json";
import { useEffect, useRef, useState } from "react";
import MDRender from "./MDRender";
import Perview from "./Perview";
import { useRouter } from "next/navigation";
import { useMobile } from "../hooks/useMobile";

const List = () => {
  const isMobile = useMobile();

  const [isChoose, setIsChoose] = useState<boolean>(false);
  const [chooseData, setChooseData] = useState<DataType>();
  const [height, setHeight] = useState<number>(0);
  const [mdContent, setMdContent] = useState<string>("");
  const ref = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const onChoose = (item: DataType, index: number) => {
    if (isMobile) {
      router.push(`/detail/${index}`);
      return;
    }
    if (item.title === chooseData?.title) {
      setIsChoose(false);
      setTimeout(() => {
        setChooseData(undefined);
      }, 200);
    } else {
      setChooseData(item);
      setIsChoose(true);
    }
  };

  useEffect(() => {
    if (ref.current) {
      setHeight(ref.current.offsetHeight);
      setMdContent(localStorage.getItem(chooseData?.title || "") || "");
    }
  }, [chooseData]);

  return (
    <div className="max-w-7xl mx-auto px-6 py-12 xs:px-4 xs:py-6">
      <div className="flex flex-1 justify-center gap-8 pb-8 items-start" style={{gap:isChoose?"32px":"0"}}>
        {/* Articles List */}
        <div
          className="flex flex-col gap-6 transition-all h-fit xs:w-full xs:overflow-hidden xs:gap-4"
          ref={ref}
        >
          {data.map((item, index) => (
            <Perview
              key={index}
              data={item}
              index={index}
              onChoose={onChoose}
              isActive={chooseData?.title === item.title}
            />
          ))}
        </div>

        {/* Article Preview Panel */}
         <div
          className="rounded-2xl flex-shrink-0 transition-all duration-1000 overflow-y-auto p-8 max-h-screen xs:hidden glass hover-lift"
          style={{
            width: isChoose ? "800px" : 0,
            height: isChoose ? height + "px" : 0,
            opacity: isChoose ? 1 : 0,
            transform: isChoose ? "scale(1)" : "scale(0.95)",
            padding: isChoose ? "32px" : "0",
          }}
        >
          <div className="relative">
            <div className="absolute -top-4 -right-4 w-20 h-20 bg-gradient-to-r from-cyan-500 to-purple-600 rounded-full blur-2xl opacity-30"></div>
            <div className="absolute -bottom-4 -left-4 w-16 h-16 bg-gradient-to-r from-blue-500 to-pink-500 rounded-full blur-2xl opacity-20"></div>
            <MDRender content={mdContent} theme="white" />
          </div>
        </div>
      </div>

      {/* Background Elements */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-cyan-500/10 to-blue-600/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-gradient-to-r from-purple-500/10 to-pink-600/10 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 right-1/3 w-64 h-64 bg-gradient-to-r from-blue-500/10 to-cyan-600/10 rounded-full blur-2xl"></div>
      </div>
    </div>
  );
};

export default List;

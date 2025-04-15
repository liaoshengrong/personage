"use client";
import data from "@/config/data.json";
import { useEffect, useRef, useState } from "react";
import { useMobile } from "../common";
import MDRender from "./MDRender";
import Perview from "./Perview";
import { useRouter } from "next/navigation";

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
      }, 1000);
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
    <div className="max-w-screen-lg p-6 flex flex-col mx-auto xs:w-full xs:p-0 xs:m-0 xs:block">
      <div className="flex flex-1 justify-center gap-7 pb-8 items-start">
        <div
          className="flex flex-col gap-4 transition-all h-fit xs:w-full xs:overflow-hidden xs:gap-0"
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
        <div
          className="rounded-lg flex-shrink-0 transition-all duration-1000 overflow-y-auto p-5 sticky top-0 max-h-screen xs:hidden"
          style={{
            width: isChoose ? "750px" : 0,
            height: isChoose ? height + "px" : 0,
            opacity: isChoose ? 1 : 0,
          }}
        >
          <MDRender content={mdContent} />
        </div>
      </div>
    </div>
  );
};

export default List;

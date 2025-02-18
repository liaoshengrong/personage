"use client";
import React, { useEffect, useRef, useState } from "react";
import Perview from "./Perview";
import MDRender from "./MDRender";

const List = ({ data }: { data: DataType[] }) => {
  const [isChoose, setIsChoose] = useState<boolean>(false);
  const [chooseData, setChooseData] = useState<DataType>();
  const [height, setHeight] = useState<number>(0);
  const [mdContent, setMdContent] = useState<string>("");
  const ref = useRef<HTMLDivElement>(null);
  const onChoose = (item: DataType) => {
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
    <div className="max-w-screen-lg p-6 h-full flex flex-col mx-auto">
      <div className="flex flex-1 justify-center gap-10 pb-8">
        <div className="flex flex-col gap-4 transition-all h-full" ref={ref}>
          {data.map((item, index) => (
            <Perview
              key={index}
              data={item}
              index={index}
              onChoose={onChoose}
            />
          ))}
        </div>
        <div
          className="rounded-lg flex-shrink-0 transition-all duration-1000 border overflow-y-auto p-5 sticky top-0"
          style={{
            width: isChoose ? "750px" : 0,
            borderWidth: isChoose ? "4px" : "0px",
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

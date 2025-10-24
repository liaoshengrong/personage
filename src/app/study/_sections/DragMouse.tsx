"use client";
import React, { useEffect, useRef, useState } from "react";

const DragMouse = () => {
  const mouseRef = useRef({
    isDown: false,
    startX: 0,
    endX: 0,
    x: 0,
    currentX: 0,
  });
  const ref = useRef<HTMLDivElement>(null);
  const ranges = useRef<any[]>(null);
  const [translateX, setTranslateX] = useState(0);
  const [isNeedDur, setIsNeedDur] = useState(false);

  const findRangeIndex = () => {
    if (!ranges.current) return -1;
    const value = mouseRef.current.currentX;

    const setActive = (i: number) => {
      const child = ref.current?.children[i] as HTMLElement;
      mouseRef.current.currentX = -child?.offsetLeft;
      setTranslateX(-child?.offsetLeft);
      setIsNeedDur(true);
      setTimeout(() => {
        setIsNeedDur(false);
      }, 500);
    };

    for (let i = 0; i < ranges.current.length; i++) {
      const [max, min] = ranges.current[i];
      if (value >= min && value <= max) {
        setActive(i);
        return;
      }
    }
    if (value > ranges.current[0][0]) {
      setActive(0);
      return;
    }
    if (value < ranges.current[ranges.current.length - 1][1]) {
      setActive(ranges.current.length - 1);
      return;
    }
    return -1; // Not found
  };

  useEffect(() => {
    if (ref.current) {
      const children = ref.current.children;
      const width = children[0].getClientRects()[0].width;

      const arr: any[] = [];
      const baseLeft = -width / 2;

      Array.from(children).forEach((item, index) => {
        const child = item as HTMLElement;
        const offsetLeft = child.offsetLeft;
        arr.push([-(baseLeft + width * index), -(offsetLeft + width / 2)]);
      });
      ranges.current = arr;
    }
  }, []);

  const onMove = (clientX: number) => {
    if (mouseRef.current.isDown) {
      mouseRef.current.endX = clientX;
      const { startX, endX, currentX } = mouseRef.current;
      mouseRef.current.x = endX - startX;
      setTranslateX(currentX + mouseRef.current.x);
    }
  };
  const onEnd = () => {
    mouseRef.current.isDown = false;
    mouseRef.current.currentX = translateX;
    findRangeIndex();
  };

  return (
    <div className="relative">
      {/* Section Header */}
      <div className="text-center mb-8 xs:mb-6">
        <div className="relative inline-block mb-3 xs:mb-4">
          <div className="absolute -inset-4 bg-gradient-to-r from-cyan-500/20 to-purple-500/20 rounded-2xl blur-lg opacity-60"></div>
          <h2 className="relative text-3xl xs:text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 neon-text tracking-wide">
            拖拽滑动体验
          </h2>
        </div>
        <p className="text-base xs:text-sm text-medium-contrast max-w-xl mx-auto font-medium leading-relaxed">
          鼠标拖拽或触摸滑动，体验流畅的交互效果
        </p>
        <div className="flex justify-center mt-4 xs:mt-3">
          <div className="h-1 w-16 bg-gradient-to-r from-cyan-400 to-purple-600 rounded-full"></div>
        </div>
      </div>
      
      <div className="border rounded-lg relative w-[800px] h-[550px] bg-white mt-5 mx-auto overflow-hidden xs:w-full">
        <div
          ref={ref}
          className="absolute top-0 left-0 h-full bg-gray-100 opacity-50 flex py-4"
          style={{
            transform: `translateX(${translateX}px)`,
            transition: isNeedDur ? "transform 0.3s ease" : "none",
          }}
          onMouseDown={(e) => {
            mouseRef.current.isDown = true;
            mouseRef.current.startX = e.clientX;
          }}
          onTouchStart={(e) => {
            mouseRef.current.isDown = true;
            mouseRef.current.startX = e.touches[0].clientX;
          }}
          onMouseMove={(e) => onMove(e.clientX)}
          onTouchMove={(e) => onMove(e.touches[0].clientX)}
          onTouchEnd={onEnd}
          onMouseUp={onEnd}
          onMouseLeave={onEnd}
        >
          {arr.map((item) => (
            <div
              className="w-[800px] xs:w-[400px] h-full flex-shrink-0  border-r px-4 cursor-grab active:cursor-grabbing"
              key={item}
            >
              <span className="flex justify-center items-center h-full bg-pink-300 rounded-lg text-2xl select-none">
                {item}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DragMouse;
const arr = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

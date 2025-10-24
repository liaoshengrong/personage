import React, { useEffect, useRef, useState } from "react";
import { animated, useTransition } from "@react-spring/web";
import Image from "next/image";
import useCarousel from "@/app/hooks/useCarousel";
import Swiper from "@/app/_components/Swiper";
import blurImage from "@/app/_images/blur-image.png";
import { useMobile } from "@/app/hooks/useMobile";
import { Paging } from "@/app/_components/Paging";
const Carousel = ({ data }: { data: string[] }) => {
  const isMobile = useMobile();
  const [isAuto, setIsAuto] = useState(false);
  const { page, next, prev, transitions, ref } = useCarousel({
    data,
    isAuto,
  });

  return (
    <div className="relative">
      {/* Section Header */}
      <div className="text-center mb-6 xs:mb-4">
        <div className="relative inline-block mb-2 xs:mb-3">
          <div className="absolute -inset-3 bg-gradient-to-r from-cyan-500/20 to-purple-500/20 rounded-xl blur-md opacity-60"></div>
          <h3 className="relative text-2xl xs:text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 neon-text tracking-wide">
            图片轮播
          </h3>
        </div>
        <p className="text-sm xs:text-xs text-medium-contrast max-w-lg mx-auto font-medium leading-relaxed mb-2 xs:mb-3">
          支持触摸的移动端轮播，流畅的切换体验
        </p>
        <div className="flex justify-center">
          <div className="h-1 w-12 bg-gradient-to-r from-cyan-400 to-purple-600 rounded-full"></div>
        </div>
      </div>

      <div className="backdrop-blur-xl bg-gradient-to-br from-slate-900/50 to-slate-800/50 border border-cyan-500/30 shadow-2xl shadow-cyan-500/10 rounded-2xl pb-6 xs:h-fit xs:pb-4 overflow-hidden">
        <div className="py-6 xs:py-4">
          <p className="text-center text-xl font-600 text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400">图片轮播</p>
          <p className="text-sm text-cyan-300/80 xs:px-4 text-center mt-2">
            支持触摸的移动端轮播
          </p>
        </div>
        <Swiper
          ref={ref}
          transitions={transitions}
          style={{ height: isMobile ? "280px" : "315px" }}
        >
          {data.map((item, index) => (
            <div key={index} className="relative w-full h-full group">
              <Image
                src={item}
                alt={`Slide ${index + 1}`}
                width={506}
                height={316}
                className="w-full h-full object-cover rounded-2xl"
                placeholder="blur"
                blurDataURL={blurImage.src}
                priority
                quality={40}
                onLoad={(e) => {
                  if (index === 0) {
                    setIsAuto(!isMobile);
                    console.log(e.target, "onLoad");
                  }
                }}
              />
              {/* 图片遮罩效果 */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              {/* 图片计数器 */}
              <div className="absolute top-4 right-4 bg-gradient-to-r from-cyan-500/80 to-blue-600/80 text-white px-3 py-1 rounded-full text-sm font-semibold backdrop-blur-sm">
                {index + 1} / {data.length}
              </div>
            </div>
          ))}
        </Swiper>
        <Paging active={page} total={data.length} prev={prev} next={next} />
      </div>
    </div>
  );
};

export default Carousel;

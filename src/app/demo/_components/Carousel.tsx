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

  // useEffect(() => {
  //   setIsAuto(!isMobile);
  // }, [isMobile]);
  return (
    <div className="border rounded-lg pb-4 xs:h-fit xs:pb-3 border-gray-400 overflow-hidden">
      <div className="py-4 xs:py-3">
        <p className="text-center text-xl font-600">轮播切换</p>
        <p className="text-sm text-black/60 xs:px-4">
          已适配移动端Touch Move效果
        </p>
      </div>
      <Swiper
        ref={ref}
        transitions={transitions}
        style={{ height: isMobile ? "280px" : "315px" }}
      >
        {data.map((item, index) => (
          <Image
            src={item}
            alt={`Image ${index}`}
            key={index}
            width={506}
            height={316}
            className="w-full object-cover rounded-lg"
            placeholder="blur"
            blurDataURL={blurImage.src}
            priority
            quality={100}
            onLoad={(e) => {
              if (index === 0) {
                setIsAuto(!isMobile);
                // console.log(e.target, "onLoad");
              }
            }}
          />
        ))}
      </Swiper>
      <Paging active={page} total={data.length} prev={prev} next={next} />
    </div>
  );
};

export default Carousel;

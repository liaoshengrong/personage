"use client";
import React, { useState, useEffect, useMemo, useRef } from "react";
import arrowNext from "@/app/_images/arrow-next.svg";
import arrowPrev from "@/app/_images/arrow-prev.svg";
import Image from "next/image";
import { useTransition, animated } from "@react-spring/web";
import { getVideoData } from "../api";

const ShortVideo = ({ data }: { data: string[] }) => {
  const [videos, setVideos] = useState<string[]>(data);
  const [isNext, setIsNext] = useState(true);
  const [active, setActive] = useState<number>(0);
  const [volume, setVolume] = useState<number>(0); // 初始音量设为0，即静音
  const startY = useRef<number | null>(null);

  const list = Array(active + 2)
    .fill(null)
    .map((_, i) => (
      <Item
        src={videos[i] ?? ""}
        key={i}
        volume={volume}
        setVolume={setVolume}
      />
    ));

  const next = async () => {
    const url = await getVideoData();
    setVideos((prev) => [...prev, url]);
    setIsNext(true);
    setActive(active + 1);
  };

  const prev = () => {
    if (active === 0) return setActive(videos.length - 1);
    setIsNext(false);
    setActive(active - 1);
  };

  const transitions = useTransition(active, {
    from: { transform: `translateY(${isNext ? "" : "-"}100%)` },
    enter: { transform: "translateY(0%)" },
    leave: { transform: `translateY(${isNext ? "-" : ""}100%)` },
    config: { duration: 400 },
    immediate: active === 0,
  });
  const onTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    startY.current = e.touches[0].clientY;
  };

  const onTouchEnd = (e: React.TouchEvent<HTMLDivElement>) => {
    if (startY.current !== null) {
      const endY = e.changedTouches[0].clientY;
      if (endY < startY.current) {
        next(); // 向上滑动
      } else if (endY > startY.current) {
        prev(); // 向下滑动
      }
      startY.current = null;
    }
  };

  return (
    <>
      {/* Section Header */}
      <div className="text-center mb-6 xs:mb-4">
        <div className="relative inline-block mb-2 xs:mb-3">
          <div className="absolute -inset-3 bg-gradient-to-r from-cyan-500/20 to-purple-500/20 rounded-xl blur-md opacity-60"></div>
          <h3 className="relative text-2xl xs:text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 neon-text tracking-wide">
            短视频播放器
          </h3>
        </div>
        <p className="text-sm xs:text-xs text-medium-contrast max-w-lg mx-auto font-medium leading-relaxed mb-2 xs:mb-3">
          上下滑动切换视频，体验流畅的播放控制
        </p>
        <div className="flex justify-center">
          <div className="h-1 w-12 bg-gradient-to-r from-cyan-400 to-purple-600 rounded-full"></div>
        </div>
      </div>

      <div className="hidden xs:block text-xs text-cyan-300/80 mt-3 animate__animated animate__fadeInUp font-medium">
        上下滑动切换视频
      </div>
      <div className="flex gap-5 h-[785px] mt-8 overflow-hidden animate__animated animate__fadeInUp xs:mt-3">
        {/* 主视频区域 - Glassmorphism Card */}
        <div className="flex-1 overflow-hidden h-full relative rounded-2xl backdrop-blur-xl bg-gradient-to-br from-slate-900/50 to-slate-800/50 border border-cyan-500/30 shadow-2xl shadow-cyan-500/10">
          <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 via-blue-500/10 to-purple-600/10 rounded-2xl"></div>
          <div
            className="relative z-10 h-full py-2"
            onTouchStart={onTouchStart}
            onTouchEnd={onTouchEnd}
          >
            {transitions((style, i) => (
              // @ts-expect-error: Include children type
              <animated.div
                key={i}
                style={style}
                className="flex justify-center items-center w-full h-full absolute left-0 top-0"
              >
                {list[i]}
              </animated.div>
            ))}
          </div>
          
          {/* 控制按钮 - Neon Glow Effect */}
          <div className="absolute bottom-6 right-6 flex flex-col gap-4 z-20">
            <div className="group cursor-pointer p-3 rounded-full bg-gradient-to-r from-cyan-500/20 to-blue-600/20 backdrop-blur-sm border border-cyan-400/30 hover:border-cyan-300/50 transition-all duration-300 hover:shadow-lg hover:shadow-cyan-500/25">
              <Image
                src={arrowPrev}
                alt="Previous"
                className="w-8 h-8 object-contain filter brightness-150 group-hover:scale-110 transition-transform duration-200"
                onClick={prev}
              />
            </div>
            <div className="group cursor-pointer p-3 rounded-full bg-gradient-to-r from-cyan-500/20 to-blue-600/20 backdrop-blur-sm border border-cyan-400/30 hover:border-cyan-300/50 transition-all duration-300 hover:shadow-lg hover:shadow-cyan-500/25">
              <Image
                src={arrowNext}
                alt="Next"
                className="w-8 h-8 object-contain filter brightness-150 group-hover:scale-110 transition-transform duration-200"
                onClick={next}
              />
            </div>
          </div>
        </div>

        {/* 侧边控制面板 - Glass Panel */}
        <div className="flex flex-col gap-4 justify-center px-6 xs:hidden">
          <div className="p-4 rounded-2xl backdrop-blur-xl bg-gradient-to-br from-slate-900/60 to-slate-800/60 border border-cyan-500/30 shadow-lg shadow-cyan-500/10">
            <div className="text-cyan-300 text-sm font-medium mb-3">视频控制</div>
            <div className="space-y-3">
              <div className="group cursor-pointer p-3 rounded-xl bg-gradient-to-r from-cyan-500/10 to-blue-600/10 backdrop-blur-sm border border-cyan-400/20 hover:border-cyan-300/40 transition-all duration-300">
                <Image
                  src={arrowPrev}
                  alt="Previous"
                  className="w-6 h-6 object-contain filter brightness-150 mx-auto"
                  onClick={prev}
                />
              </div>
              <div className="group cursor-pointer p-3 rounded-xl bg-gradient-to-r from-cyan-500/10 to-blue-600/10 backdrop-blur-sm border border-cyan-400/20 hover:border-cyan-300/40 transition-all duration-300">
                <Image
                  src={arrowNext}
                  alt="Next"
                  className="w-6 h-6 object-contain filter brightness-150 mx-auto"
                  onClick={next}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ShortVideo;
interface VideoProps {
  src: string;
  setVolume: (volume: number) => void;
  volume: number;
}
const Item: React.FC<VideoProps> = ({ src, setVolume, volume }) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  // 当组件挂载时设置音量
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.volume = volume;
    }
  }, [volume]);

  // 监听音量变化并更新全局音量状态
  const handleVolumeChange = () => {
    if (videoRef.current) {
      setVolume(videoRef.current.volume);
    }
  };

  console.log(volume, "volumevolumevolume");

  return (
    <video
      ref={videoRef}
      src={src}
      className="h-full object-cover rounded-lg shadow-md mb-6"
      autoPlay
      muted={volume === 0} // 如果音量为0，则静音
      loop
      controls={true}
      onVolumeChange={handleVolumeChange}
    />
  );
};

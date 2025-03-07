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

  console.log("videos", videos);

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

  return (
    <div className="bg-gray-100 flex gap-5 h-[785px] mt-8 overflow-hidden rounded-lg animate__animated animate__fadeInUp">
      <div className="flex-1 overflow-hidden h-full py-2 relative">
        {transitions((style, i) => (
          // @ts-ignore
          <animated.div
            key={i}
            style={style}
            className="flex justify-center items-center w-full h-full absolute left-0 top-0"
          >
            {list[i]}
          </animated.div>
        ))}
      </div>

      <div className="flex flex-col gap-4 justify-center px-8">
        <Image
          src={arrowPrev}
          alt=""
          className="cursor-pointer w-16 object-cover"
          onClick={prev}
        />
        <Image
          src={arrowNext}
          alt=""
          className="cursor-pointer w-16 object-cover"
          onClick={next}
        />
      </div>
    </div>
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

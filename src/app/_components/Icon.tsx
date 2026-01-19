"use client";
import React from "react";
import Link from "next/link";
import Image, { StaticImageData } from "next/image";

interface IProps {
  src: string | StaticImageData;
  direction: string;
  path?: string;
  stop?: boolean;
}
const config = {
  left: "animate__backInLeft",
  right: "animate__backInRight",
  top: "animate__backInUp",
};
const Icon = (props: IProps) => {
  const { src, direction, path, stop } = props;
  const cssname = stop ? "" : config[direction as keyof typeof config];
  return (
    <Link href={path ?? "/"} prefetch>
      <Image
        src={src}
        alt=""
        className={`w-6 cursor-pointer object-cover  animate__animated ${cssname}`}
      />
    </Link>
  );
};

export default Icon;
export const Tip = ({ title }: { title: string }) => {
  return (
    <div className="hidden group-hover:block absolute -left-1/2 top-full bg-black text-xs text-white w-20 text-center py-1 rounded flex-shrink-0 -translate-x-3 pointer-events-none">
      {title}
    </div>
  );
};

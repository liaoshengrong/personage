import React from "react";
import Link from "next/link";
import Image, { StaticImageData } from "next/image";

interface IProps {
  src: string | StaticImageData;
  direction: string;
  path?: string;
}
const Icon = (props: IProps) => {
  const { src, direction, path } = props;
  const cssname =
    direction === "left" ? "animate__backInLeft" : "animate__backInRight";
  return (
    <Link href={path ?? "/"}>
      <Image
        src={src}
        alt=""
        className={`w-6 cursor-pointer animate__animated ${cssname}`}
      />
    </Link>
  );
};

export default Icon;
export const Tip = ({ title }: { title: string }) => {
  return (
    <div className="hidden group-hover:block absolute -left-1/2 top-full bg-black text-xs text-white w-20 text-center py-1 rounded flex-shrink-0 -translate-x-3">
      {title}
    </div>
  );
};

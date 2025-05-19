import { animated, TransitionFn } from "@react-spring/web";
import React, { CSSProperties, Ref } from "react";
interface IProps {
  children: React.ReactNode[];
  transitions: TransitionFn<number, { opacity: number; transform: string }>;
  style?: CSSProperties;
  ref: Ref<HTMLDivElement> | null;
}
const Swiper = (props: IProps) => {
  const { children, transitions, style = {}, ref } = props;

  return (
    <>
      <div
        className="relative w-full xs:hidden"
        style={{ height: "315px", ...style }}
      >
        {transitions((style, item) => (
          // @ts-expect-error: Include children type
          <animated.div style={style} className="absolute inset-0" key={item}>
            {children[item]}
          </animated.div>
        ))}
      </div>
      <div
        ref={ref}
        style={style}
        className="hidden xs:flex w-full overflow-x-auto snap-x snap-mandatory hide-scrollbar"
      >
        {children.map((child, index) => (
          <div
            key={index}
            className="snap-always snap-center w-full flex-shrink-0 px-5"
          >
            {child}
          </div>
        ))}
      </div>
    </>
  );
};

export default Swiper;

"use client";
import Carousel from "./Carousel";
import Lottery from "./Lottery";
interface IProps {
  carousel: string[];
}
const ReactSpring = ({ carousel }: IProps) => {
  return (
    <div className="relative">
      {/* Section Header */}
      <div className="text-center mb-8 xs:mb-6">
        <div className="relative inline-block mb-3 xs:mb-4">
          <div className="absolute -inset-4 bg-gradient-to-r from-cyan-500/20 to-purple-500/20 rounded-xl blur-md opacity-60"></div>
          <h3 className="relative text-3xl xs:text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 neon-text tracking-wide">
            React Spring 动画
          </h3>
        </div>
        <p className="text-base xs:text-sm text-medium-contrast max-w-2xl mx-auto font-medium leading-relaxed mb-3 xs:mb-4">
          基于 React Spring 的流畅动画效果演示，包含抽奖和轮播组件
        </p>
        <div className="flex justify-center">
          <div className="h-1.5 w-32 bg-gradient-to-r from-cyan-400 to-purple-600 rounded-full animate__animated animate__fadeInUp animate__delay-2s"></div>
        </div>
      </div>

      <div className="mt-8 xs:mt-3 animate__animated animate__fadeInUp grid grid-cols-2 gap-6 xs:grid-cols-1">
        <Lottery />
        <Carousel data={carousel} />
      </div>
    </div>
  );
};

export default ReactSpring;

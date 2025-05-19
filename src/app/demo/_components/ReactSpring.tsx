"use client";
import Carousel from "./Carousel";
import Lottery from "./Lottery";
interface IProps {
  carousel: string[];
}
const ReactSpring = ({ carousel }: IProps) => {
  return (
    <div className="mt-8 xs:mt-3 animate__animated animate__fadeInUp grid grid-cols-2 gap-3 xs:grid-cols-1">
      <Lottery />
      <Carousel data={carousel} />
    </div>
  );
};

export default ReactSpring;

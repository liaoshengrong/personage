import { useTransition } from "@react-spring/web";
import { useEffect, useRef, useState } from "react";
interface IProps {
  data: any[];
  onNext?: () => void;
  onPrev?: () => void;
  isAuto?: boolean;
}
const useCarousel = ({ data, onNext, onPrev, isAuto = true }: IProps) => {
  const [page, setPage] = useState(0);
  const [isPrev, setIsPrev] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const timer = useRef<NodeJS.Timeout>(null);
  console.log(isAuto, "isAutoisAuto");

  const transitions = useTransition(page, {
    from: { opacity: 0, transform: `translateX(${isPrev ? "-" : ""}100%)` },
    enter: { opacity: 1, transform: "translateX(0%)" },
    leave: { opacity: 0, transform: `translateX(${isPrev ? "" : "-"}100%)` },
  });
  const next = () => {
    setPage((prev) => (prev + 1) % data.length);
    setIsPrev(false);
    onNext?.();
  };
  const prev = () => {
    setPage((prev) => (prev - 1 + data.length) % data.length);
    setIsPrev(true);
    onPrev?.();
  };

  const observerScroll = () => {
    const target = ref.current;
    if (target) {
      const offSetWidth = target.offsetWidth;
      const scrollLeft = target.scrollLeft;
      const active = Math.floor(scrollLeft / offSetWidth);

      setPage(active);
    }
  };

  useEffect(() => {
    const target = ref.current;
    target?.addEventListener("scroll", observerScroll);
    if (timer.current) {
      clearTimeout(timer.current);
    }
    timer.current = setInterval(() => {
      if (isAuto) {
        next();
      }
    }, 3000);
    return () => {
      target?.removeEventListener("scroll", observerScroll);
      if (timer.current) {
        clearInterval(timer.current);
      }
    };
  }, [isAuto]);

  return {
    ref,
    next,
    prev,
    page,
    transitions,
  };
};

export default useCarousel;

import { animated, config, useInView, useSpring } from "@react-spring/web";
import React, { useEffect, useRef, useState } from "react";
import { Button } from "tdesign-react";
const Lottery = () => {
  const [money, setMoney] = useState(100);
  const [isStart, setIsStart] = useState(false);
  const [count, setCount] = useState(-1);
  const [ref, isInview] = useInView();
  const dataRef = useRef(-1);
  const timer = useRef<NodeJS.Timeout>(undefined);
  const lastMoney = useSpring({
    from: { number: 0 },
    to: { number: isInview ? money : 0 },
    config: config.slow,
  });

  const onStart = () => {
    if (dataRef.current === 8) {
      dataRef.current = -1;
    }
    dataRef.current = dataRef.current + 1;
    setCount(dataRef.current);
  };
  const onLottery = () => {
    if (isStart) return;
    setMoney(money - 5);
    setIsStart(true);

    timer.current = setInterval(onStart, 200);

    setTimeout(() => {
      clearInterval(timer.current);
      timer.current = setInterval(onStart, 300);

      setTimeout(() => {
        clearInterval(timer.current);
        timer.current = setInterval(onStart, 500);

        setTimeout(() => {
          clearInterval(timer.current);
          setIsStart(false);
          setMoney((p) => p + arr[dataRef.current]);
        }, getTime());
      }, getTime());
    }, getTime());
  };

  useEffect(() => {
    return () => {
      clearInterval(timer.current);
    };
  }, []);

  return (
    <div className="relative">
      {/* Section Header */}
      <div className="text-center mb-6 xs:mb-4">
        <div className="relative inline-block mb-2 xs:mb-3">
          <div className="absolute -inset-3 bg-gradient-to-r from-cyan-500/20 to-purple-500/20 rounded-xl blur-md opacity-60"></div>
          <h3 className="relative text-2xl xs:text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 neon-text tracking-wide">
            幸运抽奖
          </h3>
        </div>
        <p className="text-sm xs:text-xs text-medium-contrast max-w-lg mx-auto font-medium leading-relaxed mb-2 xs:mb-3">
          试试你的运气，看看能抽到什么奖励
        </p>
        <div className="flex justify-center">
          <div className="h-1 w-12 bg-gradient-to-r from-cyan-400 to-purple-600 rounded-full"></div>
        </div>
      </div>

      <div className="backdrop-blur-xl bg-gradient-to-br from-slate-900/50 to-slate-800/50 border border-cyan-500/30 shadow-2xl shadow-cyan-500/10 rounded-2xl p-6">
        <p className="font-500 text-2xl text-center text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400 mb-4">幸运抽奖</p>
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-2">
            <span className="text-cyan-300">余额:</span>
            {/* @ts-expect-error: Include children type */}
            <animated.span ref={ref} className="text-2xl font-bold text-cyan-400">
              {lastMoney.number.to((n) => n.toFixed(2))}
            </animated.span>
            <span className="text-cyan-300">¥</span>
          </div>
          <span className="text-sm text-cyan-400/80 bg-cyan-500/10 px-3 py-1 rounded-full">每次5元</span>
        </div>
        <div className="w-full rounded-2xl bg-gradient-to-br from-slate-800/60 to-slate-700/60 grid grid-cols-3 gap-3 mt-4 p-4 relative border border-cyan-500/20">
          {arr.map((item, index) => (
            <div
              key={index}
              className={`h-20 border border-cyan-500/30 flex justify-center items-center relative z-10 rounded-xl transition-all duration-300 font-semibold text-lg ${
                index === count
                  ? "bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg shadow-cyan-500/50 scale-105" 
                  : "text-cyan-300 hover:border-cyan-400/50 hover:bg-cyan-500/10"
              }`}
            >
              {item}¥
            </div>
          ))}
        </div>
        <div className="flex justify-center mt-6">
          <Button 
            onClick={onLottery}
            className="!bg-gradient-to-r !from-cyan-500 !to-blue-600 !border-none !text-white !px-8 !py-3 !rounded-xl !font-semibold !shadow-lg !shadow-cyan-500/25 hover:!shadow-cyan-500/40 transition-all duration-300 transform hover:!scale-105"
          >
  开始抽奖
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Lottery;

const arr = [5, -10, 20, 50, -100, 150, 200, -500, 1000];

// 获取一个 1000 ~ 3000 之间的随机数
const getTime = () => Math.floor(Math.random() * 2000) + 1000;

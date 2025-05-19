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
    <div className="border border-gray-400 p-4 rounded-lg">
      <p className="font-500 text-2xl text-center">大抽奖</p>
      <div className="flex justify-between">
        <div>
          <span>我的余额：</span>
          {/* @ts-expect-error: Include children type */}
          <animated.span ref={ref}>
            {lastMoney.number.to((n) => n.toFixed(2))}
          </animated.span>
          <span>元</span>
        </div>
        <span className="text-sm text-black/60">每次抽奖消耗5元</span>
      </div>
      <div className="w-full rounded-lg bg-white grid grid-cols-3 gap-2 mt-4 p-3 relative">
        {arr.map((item, index) => (
          <div
            key={index}
            className="border h-20 border-gray-400 p-2 flex justify-center items-center relative z-10 rounded-md"
            style={
              index === count
                ? { backgroundColor: "#6c32fe", color: "#fff" }
                : {}
            }
          >
            {item}元
          </div>
        ))}
      </div>
      <div className="flex justify-center mt-3">
        <Button onClick={onLottery}>点击抽奖</Button>
      </div>
    </div>
  );
};

export default Lottery;

const arr = [5, -10, 20, 50, -100, 150, 200, -500, 1000];

// 获取一个 1000 ~ 3000 之间的随机数
const getTime = () => Math.floor(Math.random() * 2000) + 1000;

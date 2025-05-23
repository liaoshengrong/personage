"use client";
import { useEffect, useRef, useState } from "react";
import { createBrowserHistory } from "history";

const history = createBrowserHistory();
const StopBack = () => {
  const [showConfirm, setShowConfirm] = useState(false);

  //封装的常规操作，回退到上一级
  // function back() {
  //   let backCount = history.state.target == "Final" ? -3 : -2;
  //   history.go(backCount);
  // }

  // useEffect(() => {
  //   //实际的拦截操作
  //   function doIt() {
  //     //此处添加500毫秒延迟，目的是等待历史记录变化之后再添加空地址，使空地址能准确添加到栈顶，防止出错
  //     setTimeout(() => {
  //       if (!(history.state && history.state.target == "Final")) {
  //         window.history.pushState(
  //           { target: "MeanSure", random: Math.random() },
  //           "",
  //           location.href
  //         );
  //         window.history.pushState(
  //           { target: "Final", random: Math.random() },
  //           "",
  //           location.href
  //         );
  //       }
  //       window.addEventListener(
  //         "popstate",
  //         function (e) {
  //           console.log(e.state);

  //           if (e.state && e.state.target == "MeanSure") {
  //             setShowConfirm(true);
  //           }
  //         },
  //         false
  //       );
  //     }, 500);
  //   }

  //   doIt();
  // }, []);

  useEffect(() => {
    // history.listen(({ location, action }) => {
    //   console.log("232323-11111");
    //   if (action === "POP") {
    //     // setShowConfirm(true);
    //     console.log("232323 POPPOP");
    //   }
    // });
    // history.block(({ retry }) => {
    //   // retry();
    //   window.confirm("sssss");
    // });
    return () => {};
  }, []);
  const onConfirm = () => {
    // back();
  };

  return (
    <div>
      StopBack
      <button
        onClick={() => {
          // histor
        }}
      >
        跳转
      </button>
      <a href="/">跳转2222</a>
      {showConfirm && (
        <div
          className="text-red-500 border p-4 cursor-pointer"
          onClick={onConfirm}
        >
          确定跳走
        </div>
      )}
    </div>
  );
};

export default StopBack;

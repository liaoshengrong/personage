// "use client";
// import { useEffect, useRef, useState } from "react";
// import { createBrowserHistory } from "history";
// import Link from "next/link";

// const history = createBrowserHistory();
// const StopBack = () => {
//   const [showConfirm, setShowConfirm] = useState(false);

//   //封装的常规操作，回退到上一级
//   // function back() {
//   //   let backCount = history.state.target == "Final" ? -3 : -2;
//   //   history.go(backCount);
//   // }

//   // useEffect(() => {
//   //   //实际的拦截操作
//   //   function doIt() {
//   //     //此处添加500毫秒延迟，目的是等待历史记录变化之后再添加空地址，使空地址能准确添加到栈顶，防止出错
//   //     setTimeout(() => {
//   //       if (!(history.state && history.state.target == "Final")) {
//   //         window.history.pushState(
//   //           { target: "MeanSure", random: Math.random() },
//   //           "",
//   //           location.href
//   //         );
//   //         window.history.pushState(
//   //           { target: "Final", random: Math.random() },
//   //           "",
//   //           location.href
//   //         );
//   //       }
//   //       window.addEventListener(
//   //         "popstate",
//   //         function (e) {
//   //           console.log(e.state);

//   //           if (e.state && e.state.target == "MeanSure") {
//   //             setShowConfirm(true);
//   //           }
//   //         },
//   //         false
//   //       );
//   //     }, 500);
//   //   }

//   //   doIt();
//   // }, []);

//   useEffect(() => {
//     // history.listen(({ location, action }) => {
//     //   console.log("232323-11111");
//     //   if (action === "POP") {
//     //     // setShowConfirm(true);
//     //     console.log("232323 POPPOP");
//     //   }
//     // });
//     // history.block(({ retry }) => {
//     //   // retry();
//     //   window.confirm("sssss");
//     // });
//     return () => {};
//   }, []);
//   const onConfirm = () => {
//     // back();
//   };

//   return (
//     <div>
//       StopBack
//       <button
//         onClick={() => {
//           // histor
//         }}
//       >
//         跳转
//       </button>
//       <Link href="/">跳转2222</Link>
//       {showConfirm && (
//         <div
//           className="text-red-500 border p-4 cursor-pointer"
//           onClick={onConfirm}
//         >
//           确定跳走
//         </div>
//       )}
//     </div>
//   );
// };

// export default StopBack;

import React from "react";

const StopBack = () => {
  return (
    <div className="text-center py-8">
      {/* Section Header */}
      <div className="text-center mb-8 xs:mb-6">
        <div className="relative inline-block mb-3 xs:mb-4">
          <div className="absolute -inset-4 bg-gradient-to-r from-cyan-500/20 to-purple-500/20 rounded-2xl blur-lg opacity-60"></div>
          <h2 className="relative text-3xl xs:text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 neon-text tracking-wide">
            路由拦截演示
          </h2>
        </div>
        <p className="text-base xs:text-sm text-medium-contrast max-w-xl mx-auto font-medium leading-relaxed">
          浏览器历史记录管理和路由拦截技术展示
        </p>
        <div className="flex justify-center mt-4 xs:mt-3">
          <div className="h-1 w-16 bg-gradient-to-r from-cyan-400 to-purple-600 rounded-full"></div>
        </div>
      </div>
      
      <div className="text-2xl font-bold text-gray-700">
        StopBack
      </div>
    </div>
  );
};

export default StopBack;

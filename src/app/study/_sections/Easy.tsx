// "use client";
// import { atom, useAtom, useAtomValue, useSetAtom } from "jotai";
// import React from "react";
// import { create } from "zustand";
// const value = 1;

// const store = create(() => ({ value: 1, num: 100 }));

// const countAtom = atom(0);
// const Easy = () => {
//   console.log(value, "Easy");
//   const [count, setCount] = useAtom(countAtom);

//   // const count = useAtomValue(countAtom);

//   const storeValue = store((s) => s.value);
//   const num = store((s) => s.num);
//   console.log(storeValue, "storeValue");

//   return (
//     <div>
//       <p>静态：{value}</p>
//       <p>zustand：{storeValue}</p>
//       <p>zustand：{num}</p>
//       <p>jotai：{count}</p>
//       <div className="flex gap-6">
//         <button
//           onClick={() => {
//             // value = value + 1;
//             store.setState({ value: storeValue + 1 });
//           }}
//         >
//           zustand：+++
//         </button>
//         <button onClick={() => store.setState({ num: num + 1 })}>
//           zustand：n+++
//         </button>
//         <button onClick={() => setCount(count + 1)}>jotai：count:+++</button>
//       </div>
//     </div>
//   );
// };

// export default Easy;

import React from "react";

const Easy = () => {
  return (
    <div className="text-center py-8">
      {/* Section Header */}
      <div className="text-center mb-8 xs:mb-6">
        <div className="relative inline-block mb-3 xs:mb-4">
          <div className="absolute -inset-4 bg-gradient-to-r from-cyan-500/20 to-purple-500/20 rounded-2xl blur-lg opacity-60"></div>
          <h2 className="relative text-3xl xs:text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 neon-text tracking-wide">
            状态管理演示
          </h2>
        </div>
        <p className="text-base xs:text-sm text-medium-contrast max-w-xl mx-auto font-medium leading-relaxed">
          基于 Jotai 和 Zustand 的状态管理示例
        </p>
        <div className="flex justify-center mt-4 xs:mt-3">
          <div className="h-1 w-16 bg-gradient-to-r from-cyan-400 to-purple-600 rounded-full"></div>
        </div>
      </div>
      
      <div className="text-2xl font-bold text-gray-700">
        Easy
      </div>
    </div>
  );
};

export default Easy;

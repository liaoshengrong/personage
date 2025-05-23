"use client";
import { atom, useAtom, useAtomValue, useSetAtom } from "jotai";
import React from "react";
import { create } from "zustand";
let value = 1;

const store = create(() => ({ value: 1, num: 100 }));

const countAtom = atom(0);
const Easy = () => {
  console.log(value, "Easy");
  const [count, setCount] = useAtom(countAtom);

  // const count = useAtomValue(countAtom);

  const storeValue = store((s) => s.value);
  const num = store((s) => s.num);
  console.log(storeValue, "storeValue");

  return (
    <div>
      <p>静态：{value}</p>
      <p>zustand：{storeValue}</p>
      <p>zustand：{num}</p>
      <p>jotai：{count}</p>
      <div className="flex gap-6">
        <button
          onClick={() => {
            // value = value + 1;
            store.setState({ value: storeValue + 1 });
          }}
        >
          zustand：+++
        </button>
        <button onClick={() => store.setState({ num: num + 1 })}>
          zustand：n+++
        </button>
        <button onClick={() => setCount(count + 1)}>jotai：count:+++</button>
      </div>
    </div>
  );
};

export default Easy;

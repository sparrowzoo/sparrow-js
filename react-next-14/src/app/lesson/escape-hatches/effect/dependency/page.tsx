"use client";
import { useEffect, useState } from "react";

let external = 0;

export default function Page() {
  const [renderCount, setCount] = useState(0);

  // 实验组：依赖外部变量
  useEffect(() => {
    console.log("外部变量 effect 触发", external);
  }, [external]);

  // 对照组：依赖 state
  useEffect(() => {
    console.log("State effect 触发", renderCount);
  }, [renderCount]);

  return (
    <div>
      <button
        onClick={() => {
          external++;
          setCount((p) => p + 1);
        }}
      >
        同时修改外部变量和 state
      </button>
      <br />

      <button
        onClick={() => {
          external++;
          console.log("只修改外部变量", external);
        }}
      >
        只修改外部变量
      </button>
      <br />
      <button
        onClick={() => {
          setCount((p) => p + 1);
        }}
      >
        只修改状态变量
      </button>
    </div>
  );
}

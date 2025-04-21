"use client";
import React, { useEffect } from "react";
import dynamic from "next/dynamic";
import { createRoot } from "react-dom/client";

const JQueryComponent = dynamic(() => import("./back"), {
  ssr: false, // 仅客户端渲染
});
export default function Page() {
  useEffect(() => {
    // 手动挂载到指定容器
    const container = document.getElementById("content-container");
    if (container) {
      const root = createRoot(container);
      root.render(<JQueryComponent />);
    }
  }, []);
  return null; // 返回空值，避免自动生成默认 div
}

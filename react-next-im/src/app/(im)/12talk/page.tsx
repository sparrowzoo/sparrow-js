"use client";
import React, { useEffect } from "react";
import dynamic from "next/dynamic";
import { createRoot } from "react-dom/client";

const JQuery12Talk = dynamic(() => import("./jQuery12Talk"), {
  ssr: false, // 仅客户端渲染
});
export default function Page() {
  useEffect(() => {
    // 手动挂载到指定容器
    const container = document.getElementById("content-container");
    if (container) {
      const root = createRoot(container);
      root.render(<JQuery12Talk />);
    }
  }, []);
  return null; // 返回空值，避免自动生成默认 div
}

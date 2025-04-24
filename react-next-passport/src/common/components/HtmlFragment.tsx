import dynamic from "next/dynamic";
import React, { useEffect } from "react";
import { createRoot } from "react-dom/client";

interface HtmlFragmentProps {
  url: string;
  containerId: string;
}

export default function HtmlFragment(htmlFragmentProps: HtmlFragmentProps) {
  const { url } = htmlFragmentProps;
  const DynamicComponent = dynamic(() => import(url), {
    ssr: false, // 仅客户端渲染
  });
  useEffect(() => {
    // 手动挂载到指定容器
    const container = document.getElementById(htmlFragmentProps.containerId);
    if (container) {
      const root = createRoot(container);
      root.render(<DynamicComponent />);
    }
  }, []);
  return null; // 返回空值，避免自动生成默认 div
}

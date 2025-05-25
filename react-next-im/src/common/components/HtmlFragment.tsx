import React, { useEffect } from "react";
import { createRoot } from "react-dom/client";
import Hello from "@/components/Hello";

interface HtmlFragmentProps {
  DynamicComponent: React.ComponentType<any>;
  containerId: string;
}

export default function HtmlFragment(htmlFragmentProps: HtmlFragmentProps) {
  const { DynamicComponent } = htmlFragmentProps;
  useEffect(() => {
    debugger;
    // 手动挂载到指定容器
    const container = document.getElementById(htmlFragmentProps.containerId);
    if (container) {
      const root = createRoot(container);
      root.render(<Hello />);
    }
  }, []);
  return <></>; // 返回空值，避免自动生成默认 div
}

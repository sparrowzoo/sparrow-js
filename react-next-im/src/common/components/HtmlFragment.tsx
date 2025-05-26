import React, { useEffect } from "react";
import { createRoot } from "react-dom/client";

interface HtmlFragmentProps {
  DynamicComponent: React.ComponentType<any>;
  containerId: string;
}

export default function HtmlFragment(htmlFragmentProps: HtmlFragmentProps) {
  const { DynamicComponent } = htmlFragmentProps;
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

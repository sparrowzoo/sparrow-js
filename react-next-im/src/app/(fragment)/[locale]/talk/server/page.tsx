"use client";
import React from "react";
import HtmlFragment from "@/common/components/HtmlFragment";
import dynamic from "next/dynamic";

const DynamicComponent = dynamic(() => import("@/components/im/GroupedTalk"), {
  ssr: false, // 仅客户端渲染
});
export default function Page() {
  return (
    <HtmlFragment
      DynamicComponent={DynamicComponent}
      containerId={"content-container"}
    />
  );
}

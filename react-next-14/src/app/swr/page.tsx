"use client";
import React from "react";
import DynamicRender from "@/common/components/DynamicRender";

// 启用 Suspense 模式的 SWR 配置
const fetcher = (url): Promise<string> => {
  return new Promise((resolve, reject) => {
    // setTimeout(() => {
    //   resolve(url);
    // }, 1000);
    setTimeout(() => {
      if (Math.random() > 0.5) {
        reject("Failed to fetch data");
      } else {
        resolve("success");
      }
    }, 2000);
  });
};

export default function Page() {
  const url = "api/data";
  return (
    <DynamicRender url={url} fetcher={fetcher}>
      {(data) => <div>{data}</div>}
    </DynamicRender>
  );
}

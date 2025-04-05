"use client";
import React from "react";
import loading from "react-useanimations/lib/loading";
import dynamic from "next/dynamic";

const DynamicAnimation = dynamic(
  () => import("react-useanimations"),
  { ssr: false } // 禁用服务端渲染
);

export default function LoadingSpinner() {
  return <DynamicAnimation animation={loading} size={56} />;
}

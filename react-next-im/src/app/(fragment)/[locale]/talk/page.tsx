"use client";
import React from "react";
import Hello from "@/components/Hello";

export default async function Page() {
  return (
    <>
      <Hello />
    </>
  ); // 返回空值，避免自动生成默认 div
}

"use client";
import InnerImage, { ImageProps } from "@/components/img/InnerImage";
import React from "react";

export function DynamicImage(props: ImageProps) {
  // 使用动态导入延迟加载图片组件
  //build 之后 显示效果异常，导致图片刷新
  //const InnerImage = dynamic(() => import("./InnerImage"));
  //https://react.dev/errors/482 可能会报错
  return (
    <InnerImage
      className={props.className}
      src={props.src}
      alt={props.alt}
      width={props.width}
      height={props.height}
      quality={props.quality || 75}
    />
  );
}

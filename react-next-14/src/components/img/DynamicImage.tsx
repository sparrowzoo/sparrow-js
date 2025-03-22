import dynamic from "next/dynamic";
import { ImageProps } from "@/components/img/InnerImage";
import React from "react";

export async function DynamicImage(props: ImageProps) {
  // 使用动态导入延迟加载图片组件
  const InnerImage = dynamic(() => import("./InnerImage"));
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

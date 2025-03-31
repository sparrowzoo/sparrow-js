"use client";
import * as React from "react";
import Image from "next/image";
import { NEXT_ASSET_PREFIX } from "@/common/lib/Env";

// https://nextjs.org/docs/messages/no-img-element
export interface ImageProps {
  src: string;
  alt: string;
  width: number;
  height: number;
  quality?: number;
  className?: string;
}

export default function InnerImage(props: ImageProps) {
  const imageSrc = `${NEXT_ASSET_PREFIX}/${props.src}`;
  const imageLoader = ({ src, width, quality }) => {
    return `${src}?w=${width}&q=${quality || 75}`;
  };
  return (
    <Image
      className={props.className}
      loader={imageLoader}
      src={imageSrc}
      alt={props.alt}
      width={props.width}
      height={props.height}
      quality={props.quality || 75}
    />
  );
}

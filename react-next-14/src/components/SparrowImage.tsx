"use client";
import * as React from "react";
import Image from "next/image";
import { NEXT_ASSET_PREFIX } from "@/lib/EnvUtils";

// https://nextjs.org/docs/messages/no-img-element
interface ImageProps {
  src: string;
  alt: string;
  width: number;
  height: number;
  quality?: number;
  className?: string;
}

export default function SparrowImage(props: ImageProps) {
  const imageSrc = `${NEXT_ASSET_PREFIX}/${props.src}`;
  const imageLoader = ({ src, width, quality }) => {
    return `${src}?w=${width}&q=${quality || 75}`;
  };
  return (
    <Image
      className={props.className}
      loader={imageLoader}
      src={imageSrc}
      alt="Picture of the author"
      width={props.width}
      height={props.height}
      quality={props.quality || 75}
    />
  );
}

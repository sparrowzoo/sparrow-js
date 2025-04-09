"use client";
import Link from "next/link";
import { NEXT_ASSET_PREFIX } from "@/common/lib/Env";
import * as React from "react";
import { cn } from "@/lib/utils";

interface IconMenuProps {
  children: (className: any) => React.ReactNode;
  title: string;
  url: string;
  className?: string;
}

export default function IconMenu(props: IconMenuProps) {
  return (
    <div
      className={cn(
        "flex items-center justify-center w-[3rem] h-[3rem] rounded-full text-center text-white  cursor-pointer",
        props.className
      )}
    >
      <Link
        className={cn(
          props.className,
          "focus:text-black active:text-black   hover:text-black"
        )}
        title={props.title}
        href={`${NEXT_ASSET_PREFIX}/${props.url}`}
      >
        {props.children("w-[2rem] h-[2rem]")}
      </Link>
    </div>
  );
}

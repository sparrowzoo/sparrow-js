"use client";
import * as React from "react";
import { cn } from "@/lib/utils";
import { Link } from "@/common/i18n/navigation";

interface IconMenuProps {
  children: (className: any) => React.ReactNode;
  title: string;
  url: any;
  className?: string;
}

export default function IconMenu(props: IconMenuProps) {
  return (
    <div
      className={cn(
        "flex items-center justify-center w-[3rem] h-[3rem] rounded-full text-center text-foreground  cursor-pointer",
        props.className
      )}
    >
      <Link
        className={cn(
          props.className,
          "focus:text-foreground text-gray-500 active:text-foreground   hover:text-foreground"
        )}
        title={props.title}
        href={props.url}
      >
        {props.children("w-[2rem] h-[2rem]")}
      </Link>
    </div>
  );
}

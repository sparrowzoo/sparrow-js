import Link from "next/link";
import MyAvatar from "@/components/MyAvatar";
import * as React from "react";
import ItemProps from "@/lib/protocol/ItemProps";
import { cn } from "@/lib/utils";

export default function CommonItem(itemProps: ItemProps) {
  return (
    <Link className={cn("block w-fit h-fit p-0")} href={itemProps.link}>
      <div className="flex flex-row h-10">
        <MyAvatar
          unread={0}
          showUnread={false}
          fallback={itemProps.name as string}
          src={itemProps.avatar}
        />
        <div className={"flex flex-1 flex-col justify-center items-start ml-2"}>
          <span className={"text-xs"}>
            {itemProps.name}-{itemProps.id}
            {itemProps.nationality && <>【{itemProps.nationality}】</>}
          </span>
          <span
            title={itemProps.description}
            className={"text-gray-400 text-xs truncate  w-[10rem]"}
          >
            {itemProps.description}
          </span>
        </div>
      </div>
    </Link>
  );
}

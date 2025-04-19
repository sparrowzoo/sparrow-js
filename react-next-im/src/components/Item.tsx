import {
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import Link from "next/link";
import MyAvatar from "@/components/MyAvatar";
import * as React from "react";
import ItemProps, { Position } from "@/lib/protocol/ItemProps";
import { Badge } from "@/components/ui/badge";

export default function Item(itemProps: ItemProps) {
  return (
    <SidebarMenuItem>
      <SidebarMenuButton asChild>
        <Link className={"block w-fit h-fit p-0"} href={itemProps.link}>
          <div className="flex flex-row h-10">
            <MyAvatar
              unread={itemProps.unread}
              showUnread={itemProps.unreadPosition == Position.header}
              fallback={itemProps.name as string}
              src={itemProps.avatar}
            />
            <div
              className={"flex flex-1 flex-col justify-center items-start ml-2"}
            >
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
      </SidebarMenuButton>
      <SidebarMenuBadge>
        {itemProps.unread > 0 && itemProps.unreadPosition == Position.tail && (
          <Badge
            className={
              "absolute bg-red-500 p-1  text-white z-50 font-bold rounded-full"
            }
          >
            {itemProps.unread > 99 ? "99+" : itemProps.unread}
          </Badge>
        )}
      </SidebarMenuBadge>
    </SidebarMenuItem>
  );
}

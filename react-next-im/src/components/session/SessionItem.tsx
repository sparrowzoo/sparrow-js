"use client";
import * as React from "react";
import { SidebarMenuBadge, SidebarMenuItem } from "@/components/ui/sidebar";
import SessionItemTrigger from "@/components/session/SessionItemTrigger";
import { Position } from "@/lib/protocol/ItemProps";
import { Badge } from "@/components/ui/badge";
import SessionItemProps from "@/components/session/item/SessionItemProps";

export default function SessionItem(props: SessionItemProps) {
  const { chatSession } = props;
  console.log("session item 重渲染");
  return (
    <SidebarMenuItem>
      <SessionItemTrigger
        unreadPosition={props.unreadPosition}
        triggerType={props.triggerType}
        chatSession={chatSession}
      />
      <>
        {chatSession.unreadCount} {chatSession.unreadPosition}
      </>
      {chatSession.unreadCount > 0 && props.unreadPosition == Position.TAIL && (
        <SidebarMenuBadge>
          <Badge
            className={
              "absolute bg-red-500 p-1  text-white z-50 font-bold rounded-full"
            }
          >
            {chatSession.unreadCount > 99 ? "99+" : chatSession.unreadCount}
          </Badge>
        </SidebarMenuBadge>
      )}
    </SidebarMenuItem>
  );
}

"use client";
import Link from "next/link";
import * as React from "react";
import {
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import ChatSession from "@/lib/protocol/session/ChatSession";
import MyAvatar from "@/components/MyAvatar";

interface SessionItemProps {
  chatSession: ChatSession;
}

export default function SessionItem(props: SessionItemProps) {
  const { chatSession } = props;
  console.log("session item 重渲染");
  return (
    <SidebarMenuItem>
      <SidebarMenuButton asChild>
        <Link className={"block w-fit h-fit p-0"} href={chatSession.sessionUrl}>
          <div className="flex flex-row h-10">
            <MyAvatar
              unread={chatSession.unreadCount}
              showUnread={true}
              fallback={chatSession.name as string}
              src={chatSession.avatarUrl}
            />
            <div
              className={"flex flex-1 flex-col justify-center items-start ml-2"}
            >
              <div className={"flex flex-row w-full text-xs justify-between"}>
                <span className={"text-xs"}>{chatSession.name}</span>
                <span>{chatSession.lastMessage?.sendTime}</span>
              </div>
              <span
                title={chatSession.lastMessage?.content}
                className={"text-gray-400 text-xs truncate  w-[10rem]"}
              >
                {chatSession.lastMessage?.content}
              </span>
            </div>
          </div>
        </Link>
      </SidebarMenuButton>
      <SidebarMenuBadge></SidebarMenuBadge>
    </SidebarMenuItem>
  );
}

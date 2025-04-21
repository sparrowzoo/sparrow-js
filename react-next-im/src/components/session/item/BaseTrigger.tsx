import SessionItemProps from "@/components/session/item/SessionItemProps";
import MyAvatar from "@/components/MyAvatar";
import { Position } from "@/lib/protocol/ItemProps";
import * as React from "react";
import { Badge } from "@/components/ui/badge";

export default function BaseTrigger(sessionItemProps: SessionItemProps) {
  const chatSession = sessionItemProps.chatSession;
  return (
    <div className="flex flex-row h-10 w-full">
      <MyAvatar
        unread={chatSession.unreadCount}
        showUnread={chatSession.unreadPosition == Position.HEADER}
        fallback={chatSession.name as string}
        src={chatSession.avatarUrl}
      />
      <div
        className={
          "flex flex-1 flex-col justify-start items-center ml-2 text-xs"
        }
      >
        <div className={"flex flex-row justify-between items-between w-full"}>
          <span>{chatSession.name}</span>
          <span>{chatSession.lastMessage?.sendTime}</span>
        </div>
        <div className={"flex flex-row justify-between items-between w-full"}>
          <span
            title={chatSession.lastMessage?.content}
            className={
              "text-gray-400 flex-1 text-left text-xs truncate  w-[10rem]"
            }
          >
            {chatSession.lastMessage?.content}
          </span>
          {chatSession.unreadCount > 0 &&
            sessionItemProps.unreadPosition == Position.TAIL && (
              <Badge
                className={
                  "bg-red-500 p-1 w-5 h-5 text-xs text-center  text-white z-50 font-bold rounded-full"
                }
              >
                {chatSession.unreadCount > 99 ? "99+" : chatSession.unreadCount}
              </Badge>
            )}
        </div>
      </div>
    </div>
  );
}

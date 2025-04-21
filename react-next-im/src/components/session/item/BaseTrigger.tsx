import SessionItemProps from "@/components/session/item/SessionItemProps";
import MyAvatar from "@/components/MyAvatar";
import { Position } from "@/lib/protocol/ItemProps";
import * as React from "react";

export default function BaseTrigger(sessionItemProps: SessionItemProps) {
  const chatSession = sessionItemProps.chatSession;
  return (
    <div className="flex flex-row h-10">
      <MyAvatar
        unread={chatSession.unreadCount}
        showUnread={chatSession.unreadPosition == Position.HEADER}
        fallback={chatSession.name as string}
        src={chatSession.avatarUrl}
      />
      <div className={"flex flex-1 flex-col justify-start items-center ml-2"}>
        <div className={"flex flex-row w-full text-xs justify-between"}>
          <span className={"text-xs"}>{chatSession.name}</span>
          <span>{chatSession.lastMessage?.sendTime}</span>
        </div>
        <span
          title={chatSession.lastMessage?.content}
          className={"text-gray-400 text-left text-xs truncate  w-[10rem]"}
        >
          {chatSession.lastMessage?.content}
        </span>
      </div>
    </div>
  );
}

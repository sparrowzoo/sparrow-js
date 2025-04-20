import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Sidebar, SidebarProvider } from "@/components/ui/sidebar";
import MyAvatar from "@/components/MyAvatar";
import * as React from "react";
import Session from "@/components/session/Session";
import ChatSession from "@/lib/protocol/session/ChatSession";

interface DialogProps {
  session: ChatSession;
}

export default function Dialog(dialogProps: DialogProps) {
  const { session } = dialogProps;
  return (
    <Popover>
      <PopoverTrigger className={"w-full flex flex-row gap-4"}>
        <div className="flex flex-row h-10 text-left">
          <MyAvatar
            unread={session.unreadCount}
            showUnread={true}
            fallback={session.name as string}
            src={session.avatarUrl}
          />
          <div
            className={"flex flex-1 flex-col justify-center items-start ml-2"}
          >
            <div className={"flex flex-row w-full text-xs justify-between"}>
              <span className={"text-xs"}>{session.name}</span>
              <span>{session.lastMessage?.sendTime}</span>
            </div>
            <span
              title={session.lastMessage?.content}
              className={"text-gray-400 text-xs truncate  w-[10rem]"}
            >
              {session.lastMessage?.content}
            </span>
          </div>
        </div>
      </PopoverTrigger>
      <PopoverContent
        sideOffset={10}
        className={"w-fit h-fit"}
        alignOffset={0}
        draggable={"true"}
        side={"left"}
        align={"center"}
      >
        <SidebarProvider className={"w-fit h-fit min-h-full"}>
          <Sidebar className={"relative min-h-full w-[600px] h-[600px]"}>
            <Session sessionKey={session.sessionKey} />
          </Sidebar>
        </SidebarProvider>
      </PopoverContent>
    </Popover>
  );
}

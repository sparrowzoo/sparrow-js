import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Sidebar, SidebarProvider } from "@/components/ui/sidebar";
import * as React from "react";
import { Button } from "@/components/ui/button";
import MessageSearchBar from "@/components/session/search/MessageSearchBar";
import ChatUser from "@/lib/protocol/ChatUser";

export default function PopSearchTrigger() {
  const [isOpen, setIsOpen] = React.useState(false);
  const currentUser = ChatUser.getCurrentUser();
  if (!currentUser || !currentUser.isAdmin()) {
    return <></>;
  }
  return (
    <Popover open={isOpen}>
      <PopoverTrigger
        asChild={true}
        className={"w-full cursor-pointer flex flex-row gap-4"}
      >
        <Button
          onClick={() => {
            setIsOpen(!isOpen);
          }}
        >
          聊天记录管理
        </Button>
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
            <MessageSearchBar />
          </Sidebar>
        </SidebarProvider>
      </PopoverContent>
    </Popover>
  );
}

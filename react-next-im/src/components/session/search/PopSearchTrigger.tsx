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
import { useTranslations } from "next-intl";
import Draggable from "@/common/components/Draggable";

export default function PopSearchTrigger() {
  const t = useTranslations("ClientServer");

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
          {t("message-record-manage")}
        </Button>
      </PopoverTrigger>
      <Draggable asChild={true}>
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
      </Draggable>
    </Popover>
  );
}

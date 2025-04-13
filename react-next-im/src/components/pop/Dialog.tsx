import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Sidebar, SidebarProvider } from "@/components/ui/sidebar";
import MyAvatar from "@/components/MyAvatar";
import * as React from "react";
import Contact from "@/lib/protocol/contact/Contact";
import Session from "@/components/session/Session";

interface DialogProps {
  contact: Contact;
}

export default function Dialog(dialogProps: DialogProps) {
  const { contact } = dialogProps;
  return (
    <Popover>
      <PopoverTrigger className={"w-full flex flex-row gap-4"}>
        <MyAvatar fallback={contact?.userName as string} src={contact.avatar} />
        <span>{contact.userName}</span>
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
          <Sidebar className={"relative min-h-full w-[400px] h-[400px]"}>
            <Session />
          </Sidebar>
        </SidebarProvider>
      </PopoverContent>
    </Popover>
  );
}

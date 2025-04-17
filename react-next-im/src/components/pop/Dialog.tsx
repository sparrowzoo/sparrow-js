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
import ChatUser from "@/lib/protocol/ChatUser";
import ChatSession from "@/lib/protocol/session/ChatSession";

interface DialogProps {
  contact: Contact;
}

export default function Dialog(dialogProps: DialogProps) {
  const { contact } = dialogProps;
  const currentUser = ChatUser.getCurrentUser();
  const receiver = new ChatUser(contact.userId, ChatUser.CATEGORY_REGISTER);
  const chatSession = ChatSession.create121Session(
    currentUser as ChatUser,
    receiver
  );
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
          <Sidebar className={"relative min-h-full w-[600px] h-[600px]"}>
            <Session sessionKey={chatSession.key()} />
          </Sidebar>
        </SidebarProvider>
      </PopoverContent>
    </Popover>
  );
}

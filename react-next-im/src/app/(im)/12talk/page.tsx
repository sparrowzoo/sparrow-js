"use client";
import { HeadsetIcon } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import Contact from "@/lib/protocol/contact/Contact";
import Contacts from "@/components/pop/Contacts";
import { Sidebar, SidebarProvider } from "@/components/ui/sidebar";
import { format } from "util";
import { AVATAR_URL } from "@/common/lib/Env";
import React, { useEffect, useState } from "react";
import {
  WebSocketContext,
  WebSocketContextValue,
} from "@/lib/im/WebSocketProvider";
import useCrosStorage from "@/common/hook/CrosStorageHook";
import MessageBroker from "@/lib/im/MessageBroker";
import { StorageType } from "@/common/lib/protocol/CrosProtocol";
import ChatApi from "@/lib/ChatApi";

export default function Page() {
  const contacts: Contact[] = [];
  for (let i = 0; i < 10; i++) {
    const contact = new Contact();
    contact.userName = "Contact " + i;
    contact.nationality = "China";
    contact.userId = i;
    console.log(contact.userId);
    contact.avatar = format(AVATAR_URL, contact.userId);
    console.log(contact.avatar);
    contacts.push(contact);
  }
  const [isOpen, setIsOpen] = React.useState(false);

  const [webSocketContextValue, setWebSocketContextValue] =
    useState<WebSocketContextValue>();
  let crosStorage = useCrosStorage();
  useEffect(() => {
    if (!crosStorage) {
      return;
    }

    crosStorage
      .getToken(StorageType.AUTOMATIC, ChatApi.getVisitorToken)
      .then((token) => {
        console.log("token", token);
        const messageBroker = new MessageBroker(crosStorage);
        const localContext = WebSocketContextValue.create(messageBroker);
        messageBroker.newMessageSignal = () => {
          setWebSocketContextValue(localContext?.newReference());
        };
        setWebSocketContextValue(localContext);
        messageBroker.initSessions(contacts);
      });
    return () => {
      crosStorage?.destroy();
      webSocketContextValue?.closeWebSocket();
    };
  }, [crosStorage]);

  if (!webSocketContextValue) {
    return <></>;
  }
  console.log("渲染ChatLayout");

  return (
    <WebSocketContext.Provider
      value={webSocketContextValue as WebSocketContextValue}
    >
      <div>
        <div className="absolute bottom-20 right-20  ">
          <Popover open={isOpen}>
            <PopoverTrigger
              asChild={true}
              onClick={() => {
                setIsOpen(!isOpen);
              }}
            >
              <HeadsetIcon
                className={"cursor-pointer"}
                width={64}
                height={64}
              />
            </PopoverTrigger>
            <PopoverContent side={"top"}>
              <SidebarProvider className={"min-h-full h-full w-auto"}>
                <Sidebar className={"relative min-h-full h-full"}>
                  <Contacts contacts={contacts} />
                </Sidebar>
              </SidebarProvider>
            </PopoverContent>
          </Popover>
        </div>
      </div>
    </WebSocketContext.Provider>
  );
}

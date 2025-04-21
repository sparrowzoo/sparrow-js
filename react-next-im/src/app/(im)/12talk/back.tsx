"use client";
import { HeadsetIcon } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Sidebar, SidebarProvider } from "@/components/ui/sidebar";
import React, { useEffect, useState } from "react";
import {
  WebSocketContext,
  WebSocketContextValue,
} from "@/lib/im/WebSocketProvider";
import useCrosStorage from "@/common/hook/CrosStorageHook";
import MessageBroker from "@/lib/im/MessageBroker";
import { StorageType } from "@/common/lib/protocol/CrosProtocol";
import ChatApi from "@/lib/ChatApi";
import ChatSession from "@/lib/protocol/session/ChatSession";
import Sessions from "@/components/session/Sessions";
import LoginUser from "@/common/lib/protocol/LoginUser";

export default function Demo() {
  const serverIds = process.env.NEXT_PUBLIC_SERVER_ID_ARRAY as string;
  const contacts: string[] = serverIds.split(",");

  const [isOpen, setIsOpen] = React.useState(false);
  const [sessions, setSessions] = React.useState<ChatSession[]>();
  const [webSocketContextValue, setWebSocketContextValue] =
    useState<WebSocketContextValue>();
  let crosStorage = useCrosStorage();
  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }
    if (!crosStorage) {
      return;
    }

    crosStorage
      .getToken(StorageType.AUTOMATIC, ChatApi.getVisitorToken)
      .then((token) => {
        //同步token 到本域，方便后续使用getCurrentUser()
        crosStorage?.locateToken().then((token) => {
          console.log("token", token);
          const messageBroker = new MessageBroker(crosStorage);
          const localContext = WebSocketContextValue.create(messageBroker);
          messageBroker.newMessageSignal = () => {
            setWebSocketContextValue(localContext?.newReference());
          };
          setWebSocketContextValue(localContext);
          messageBroker.webSocket.handshakeSuccess = (loginUser: LoginUser) => {
            messageBroker.initSessionsByContacts(contacts).then(() => {
              setSessions(
                messageBroker.sessionContainer.chatSessions as ChatSession[]
              );
            });
          };
        });
      });
    return () => {
      crosStorage?.destroy();
      webSocketContextValue?.closeWebSocket();
    };
  }, [crosStorage]);

  return (
    <div>
      <div className="absolute bottom-20 right-20  ">
        <Popover open={isOpen}>
          <PopoverTrigger
            asChild={true}
            onClick={() => {
              setIsOpen(!isOpen);
            }}
          >
            <HeadsetIcon className={"cursor-pointer"} width={64} height={64} />
          </PopoverTrigger>
          <PopoverContent side={"top"}>
            <SidebarProvider className={"min-h-full h-full w-auto"}>
              <Sidebar className={"relative min-h-full h-full"}>
                <WebSocketContext.Provider
                  value={webSocketContextValue as WebSocketContextValue}
                >
                  <Sessions
                    triggerType={"POP"}
                    sessions={sessions as ChatSession[]}
                  />
                </WebSocketContext.Provider>
              </Sidebar>
            </SidebarProvider>
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
}

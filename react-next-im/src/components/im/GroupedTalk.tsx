"use client";
import { HeadsetIcon } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import React, { useEffect, useState } from "react";
import {
  WebSocketContext,
  WebSocketContextValue,
} from "@/lib/im/WebSocketProvider";
import useCrosStorage from "@/common/hook/CrosStorageHook";
import MessageBroker from "@/lib/im/MessageBroker";
import { StorageType } from "@/common/lib/protocol/CrosProtocol";
import ThreeDotLoading from "@/common/components/ThreeDotLoading";
import { SidebarProvider } from "@/components/ui/sidebar";
import LoginUser from "@/common/lib/protocol/LoginUser";
import TabSessions from "@/components/session/TabSessions";
import ChatUser from "@/lib/protocol/ChatUser";

export default function GroupedTalk() {
  const [isOpen, setIsOpen] = React.useState(false);
  const [webSocketContextValue, setWebSocketContextValue] =
    useState<WebSocketContextValue>();
  const [groupedSessions, setGroupedSessions] = useState<any>();
  let crosStorage = useCrosStorage();

  useEffect(() => {
    if (!crosStorage) {
      return;
    }

    crosStorage
      .getToken(StorageType.AUTOMATIC, "REDIRECT-TO-LOGIN")
      .then((token) => {
        //token 个人信息本地化
        crosStorage?.locateToken().then((loginUser: LoginUser) => {
          console.log("token", JSON.stringify(loginUser));
          const messageBroker = new MessageBroker(crosStorage);
          const localContext = WebSocketContextValue.create(messageBroker);
          messageBroker.newMessageSignal = () => {
            setWebSocketContextValue(localContext?.newReference());
          };
          //握手成功后初始化
          messageBroker.webSocket.handshakeSuccess = () => {
            messageBroker.initSessions().then(() => {
              console.log("initSessions success");
              const currentUser = ChatUser.getCurrentUser();
              //将session 信息分组
              messageBroker.sessionContainer
                .getGroupedSessions(currentUser.category)
                .then((groupedSessions) => {
                  console.log("groupedSessions", groupedSessions);
                  setGroupedSessions(groupedSessions);
                });
            });
          };
          setWebSocketContextValue(localContext);
        });
      });
    return () => {
      crosStorage?.destroy();
      webSocketContextValue?.closeWebSocket();
    };
  }, [crosStorage]);

  useEffect(() => {
    if (webSocketContextValue && groupedSessions) {
      const messageBroker = webSocketContextValue.messageBroker;
      messageBroker.initSessions().then(() => {
        console.log("initSessions success");
        const currentUser = ChatUser.getCurrentUser();
        //将session 信息分组
        messageBroker.sessionContainer
          .getGroupedSessions(currentUser.category)
          .then((groupedSessions) => {
            console.log("groupedSessions", groupedSessions);
            setGroupedSessions(groupedSessions);
          });
      });
    }
  }, [webSocketContextValue]);

  if (!groupedSessions) {
    return <ThreeDotLoading />;
  }
  console.log("渲染ChatLayout");

  return (
    <Popover open={isOpen}>
      <PopoverTrigger
        asChild={true}
        onClick={() => {
          setIsOpen(!isOpen);
        }}
      >
        <HeadsetIcon className={"cursor-pointer"} width={64} height={64} />
      </PopoverTrigger>
      <PopoverContent className={"w-fit"} side={"top"}>
        <SidebarProvider className={"min-h-full h-full w-auto"}>
          <WebSocketContext.Provider
            value={webSocketContextValue as WebSocketContextValue}
          >
            <TabSessions groupedSessions={groupedSessions} />
          </WebSocketContext.Provider>
        </SidebarProvider>
      </PopoverContent>
    </Popover>
  );
}

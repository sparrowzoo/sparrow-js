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
import TabSessions from "@/app/(im)/12talk-agency/TabSessions";

export default function JQuery12TalkAgency() {
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
        debugger;
        console.log("token", token);
        const messageBroker = new MessageBroker(crosStorage);
        const localContext = WebSocketContextValue.create(messageBroker);
        messageBroker.newMessageSignal = () => {
          setWebSocketContextValue(localContext?.newReference());
        };
        setWebSocketContextValue(localContext);
        messageBroker.initSessions().then(() => {
          console.log("initSessions success");
          messageBroker.sessionContainer
            .getGroupedSessions()
            .then((groupedSessions) => {
              console.log("groupedSessions", groupedSessions);
              setGroupedSessions(groupedSessions);
            });
        });
      });
    return () => {
      crosStorage?.destroy();
      webSocketContextValue?.closeWebSocket();
    };
  }, [crosStorage]);

  if (!groupedSessions) {
    return <ThreeDotLoading />;
  }
  console.log("渲染ChatLayout");

  return (
    <WebSocketContext.Provider
      value={webSocketContextValue as WebSocketContextValue}
    >
      <div>
        <div className="absolute bottom-20 right-60  ">
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
            <PopoverContent className={"w-fit"} side={"top"}>
              <SidebarProvider className={"min-h-full h-full w-auto"}>
                <TabSessions groupedSessions={groupedSessions} />
              </SidebarProvider>
            </PopoverContent>
          </Popover>
        </div>
      </div>
    </WebSocketContext.Provider>
  );
}

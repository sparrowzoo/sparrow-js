"use client";
import * as React from "react";
import { useEffect, useState } from "react";
import {
  WebSocketContext,
  WebSocketContextValue,
} from "@/lib/WebSocketProvider";
import useCrosStorage from "@/common/hook/CrosStorageHook";
import MessageBroker from "@/lib/MessageBroker";
import ThreeDotLoading from "@/common/components/ThreeDotLoading";
import ChatUser from "@/lib/protocol/ChatUser";
import { format } from "util";
import { AVATAR_URL } from "@/common/lib/Env";
import { Toaster } from "react-hot-toast";
import IconMenu from "@/components/IconMenu";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { CircleUserRound, MessageCircleCode } from "lucide-react";
import Header from "@/components/header/header";
import { ThemeProvider } from "@/components/header/theme-provider";

export default function Chat({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [webSocketContextValue, setWebSocketContextValue] =
    useState<WebSocketContextValue>();
  let crosStorage = useCrosStorage();
  console.log("渲染ChatLayout");
  useEffect(() => {
    async function asyncInit() {
      if (!crosStorage) {
        return;
      }
      const messageContainer = new MessageBroker(crosStorage);
      const localContext = WebSocketContextValue.create(messageContainer);
      messageContainer.newMessageSignal = () => {
        setWebSocketContextValue(localContext?.newReference());
      };
      setWebSocketContextValue(localContext);
    }

    asyncInit();
    return () => {
      crosStorage?.destroy();
      webSocketContextValue?.closeWebSocket();
    };
  }, [crosStorage]);

  if (!webSocketContextValue) {
    return <ThreeDotLoading />;
  }
  const currentUser = ChatUser.getCurrentUser();
  const avatarUrl = format(AVATAR_URL, currentUser?.id);
  const userHome = "/chat/friends/contact?friendId=" + currentUser?.id;
  console.log("状态变化会重新渲染", webSocketContextValue);
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <Header />
      <div className="flex flex-col h-screen">
        <Toaster position="top-center" reverseOrder={true} />

        <div className="flex flex-row flex-1 min-h-0 h-full w-full">
          <div className=" bg-gray-500 w-[4rem] flex flex-col  gap-4 p-2">
            <IconMenu title={"我的"} url={userHome}>
              {(className) => (
                <Image
                  alt={"avatar"}
                  src={avatarUrl}
                  className={cn(className, "rounded-full w-full h-[3rem]")}
                  width={0}
                  height={0}
                />
              )}
            </IconMenu>
            <IconMenu title={"联系人"} url={"/chat/friends"}>
              {(className) => <CircleUserRound className={className} />}
            </IconMenu>
            <IconMenu title={"消息"} url={"/chat/sessions/session"}>
              {(className) => <MessageCircleCode className={className} />}
            </IconMenu>
          </div>
          <WebSocketContext.Provider
            value={webSocketContextValue as WebSocketContextValue}
          >
            {children}
          </WebSocketContext.Provider>
        </div>
      </div>
    </ThemeProvider>
  );
}

"use client";
import Link from "next/link";
import { NEXT_ASSET_PREFIX } from "@/common/lib/Env";
import { useEffect, useState } from "react";
import {
  WebSocketContext,
  WebSocketContextValue,
} from "@/lib/WebSocketProvider";
import MessageBroker from "@/lib/protocol/MessageBroker";
import ChatApi from "@/lib/ChatApi";
import CrosStorage from "@/common/lib/CrosStorage";

export default function ChatLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [webSocketContextValue, setWebSocketContextValue] =
    useState<WebSocketContextValue>();


  console.log("渲染ChatLayout");

  useEffect(() => {
    let crosStorage: CrosStorage
    async function asyncInit() {
      let tokenParam: string | undefined;
       crosStorage =CrosStorage.getCrosStorage();
      await crosStorage.getToken().then((token) => {
        tokenParam = token;
      });
      const messageContainer = new MessageBroker(crosStorage);
      const localContext = WebSocketContextValue.create(messageContainer);
      messageContainer.newMessageSignal = () => {
        setWebSocketContextValue(localContext?.newReference());
      };
      setWebSocketContextValue(localContext);
    }

    asyncInit();
    return () => {
      crosStorage.destroy();
      webSocketContextValue?.closeWebSocket();
    };
  }, []);

  if (!webSocketContextValue) {
    return <LoadingSpinner />;
  }

  console.log("状态变化会重新渲染", webSocketContextValue);
  return (
    <div className="flex flex-row flex-1 w-full">
      <div className="w-[20rem] flex flex-col  gap-4 p-4 border-r border-indigo-500">
        <div className={"bg-cyan-500 text-white p-2 rounded-xl cursor-pointer"}>
          <Link href={`${NEXT_ASSET_PREFIX}/chat/friends`}>通讯录管理</Link>
        </div>
        <div className={"bg-cyan-500 text-white p-2 rounded-xl cursor-pointer"}>
          <Link href={`${NEXT_ASSET_PREFIX}/chat/sessions/session`}>
            我的会话
          </Link>
        </div>
      </div>
      <div className="flex-1 border-l border-indigo-500">
        <WebSocketContext.Provider
          value={webSocketContextValue as WebSocketContextValue}
        >
          {children}
        </WebSocketContext.Provider>
      </div>
    </div>
  );
}

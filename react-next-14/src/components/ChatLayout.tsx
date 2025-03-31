"use client";
import Link from "next/link";
import { NEXT_ASSET_PREFIX } from "@/common/lib/Env";
import { useEffect, useState } from "react";
import { getToken } from "@/common/lib/TokenUtils";
import {
  WebSocketContext,
  WebSocketContextValue,
} from "@/lib/WebSocketProvider";
import MessageBroker from "@/lib/protocol/MessageBroker";
import ChatApi from "@/lib/ChatApi";

export default function ChatLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [webSocketContextValue, setWebSocketContextValue] =
    useState<WebSocketContextValue>();
  console.log("渲染ChatLayout");

  useEffect(() => {
    async function asyncInit() {
      const tokenParam = await getToken(() => {
        return ChatApi.getVisitorToken();
      });
      const messageContainer = new MessageBroker(tokenParam as string);
      const localContext = WebSocketContextValue.create(messageContainer);
      messageContainer.newMessageSignal = () => {
        setWebSocketContextValue(localContext?.newReference());
      };
      setWebSocketContextValue(localContext);
    }

    asyncInit();
    return () => {
      webSocketContextValue?.closeWebSocket();
    };
  }, []);

  if (!webSocketContextValue) {
    return <div>init context ....</div>;
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

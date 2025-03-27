"use client";
import Link from "next/link";
import { NEXT_ASSET_PREFIX, USER_INFO_KEY, WEBSOCKET } from "@/lib/EnvUtils";
import { useEffect, useState } from "react";
import SparrowWebSocket from "@/lib/SparrowWebSocket";
import { getToken, removeToken } from "@/lib/TokenUtils";
import toast from "react-hot-toast";
import {
  WebSocketContext,
  WebSocketContextValue,
} from "@/lib/WebSocketProvider";
import MessageBroker from "@/lib/protocol/MessageBroker";

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
      const tokenParam = await getToken(true);
      const sparrowWebSocket = new SparrowWebSocket(
        WEBSOCKET as string,
        tokenParam as string
      );
      sparrowWebSocket.userValidCallback = (data: Result) => {
        console.log("userValidCallback", JSON.stringify(data));
        if (data.code == "0") {
          sessionStorage.setItem(USER_INFO_KEY, JSON.stringify(data.data));
        } else {
          removeToken();
          toast.error(data.message);
        }
      };
      sparrowWebSocket.connect();
      const messageContainer = new MessageBroker(sparrowWebSocket);

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

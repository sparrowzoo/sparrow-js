"use client";
import Link from "next/link";
import { NEXT_ASSET_PREFIX, USER_INFO_KEY, WEBSOCKET } from "@/lib/EnvUtils";
import { useEffect, useMemo, useState } from "react";
import SparrowWebSocket from "@/lib/SparrowWebSocket";
import { getToken, removeToken } from "@/lib/TokenUtils";
import toast from "react-hot-toast";
import Protocol from "@/lib/protocol/Protocol";
import { WebSocketContext } from "@/lib/WebSocketProvider";

export default function ChatLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sparrowWebSocket, setSparrowWebSocket] = useState<SparrowWebSocket>();
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
      sparrowWebSocket.onMsgCallback = (protocol: Protocol) => {
        //https://react.docschina.org/learn/queueing-a-series-of-state-updates
        //putNewMessage(protocol);
      };
      setSparrowWebSocket(sparrowWebSocket);
    }

    asyncInit();
    return () => {
      sparrowWebSocket?.close();
    };
  }, []);

  const contextValue = useMemo(
    () => ({ sparrowWebSocket }),
    [sparrowWebSocket]
  );
  if (!sparrowWebSocket) {
    return <div>loading...</div>;
  }

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
        <WebSocketContext.Provider value={contextValue}>
          {children}
        </WebSocketContext.Provider>
      </div>
    </div>
  );
}

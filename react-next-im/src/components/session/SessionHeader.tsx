import React, { useContext, useEffect, useState } from "react";
import { WebSocketContext } from "@/lib/im/WebSocketProvider";
import { ChatType } from "@/lib/protocol/Chat";
import ThreeDotLoading from "@/common/components/ThreeDotLoading";
import ChatSession from "@/lib/protocol/session/ChatSession";
import { Wifi, WifiOff } from "lucide-react";
import SparrowWebSocket from "@/common/lib/SparrowWebSocket";
import MyAvatar from "@/components/MyAvatar";

class HeaderDetail {
  avatarUrl: string;
  title: string;
  chatType: ChatType;
}

interface SessionHeaderProps {
  sessionKey: string;
}

export default function SessionHeader(sessionHeaderProps: SessionHeaderProps) {
  const { sessionKey } = sessionHeaderProps;
  const [sessionDetail, setSessionDetail] = useState<ChatSession>();
  //不要解构，因为解构会useEffect的依赖引用无变化，不会重新渲染
  const webSocketContextValue = useContext(WebSocketContext);
  const [heartStatus, setHeartStatus] = useState<string>(
    SparrowWebSocket.ACTIVE_STATUS
  );
  useEffect(() => {
    setTimeout(() => {
      setInterval(() => {
        const heartStatus =
          webSocketContextValue.messageBroker.webSocket.getHeartStatus();
        setHeartStatus(heartStatus);
      }, 1000);
    }, webSocketContextValue.messageBroker.webSocket.heartTime);
    console.log("sessionKey changed to: ", sessionHeaderProps.sessionKey);
    const chatSession = ChatSession.parse(sessionKey) as ChatSession;
    webSocketContextValue.messageBroker.sessionContainer
      .getChatSession(chatSession)
      .then(() => {
        const localSession =
          webSocketContextValue.messageBroker.sessionContainer.getLocalSession(
            chatSession
          );
        setSessionDetail(localSession);
      });

    //https://react.docschina.org/learn/queueing-a-series-of-state-updates
    // setMessageList((messageList) => [...messageList, new Message(protocol)]);
  }, [sessionHeaderProps]);

  if (!sessionDetail) {
    return <ThreeDotLoading />;
  }

  return (
    <div
      className={
        "flex shrink-0 h-[3rem] flex-row  justify-start items-center gap-2 p-2"
      }
    >
      <MyAvatar
        unread={0}
        showUnread={false}
        src={sessionDetail.avatarUrl}
        fallback={sessionDetail.name}
      />{" "}
      <span className={"text-left text-sm"}>{sessionDetail.name}</span>
      <span>{sessionDetail.sessionKey}</span>
      {heartStatus === SparrowWebSocket.ACTIVE_STATUS && (
        <Wifi className={"text-blue-500"} />
      )}
      {heartStatus === SparrowWebSocket.INACTIVE_STATUS && (
        <WifiOff className={"text-red-500"} />
      )}
    </div>
  );
}

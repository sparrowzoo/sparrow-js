import React, { useContext, useEffect, useState } from "react";
import { WebSocketContext } from "@/lib/WebSocketProvider";
import { DynamicImage } from "@/components/img/DynamicImage";
import { ChatType } from "@/lib/protocol/Chat";
import ThreeDotLoading from "@/common/components/ThreeDotLoading";
import ChatSession from "@/lib/protocol/session/ChatSession";
import SessionDetail from "@/lib/protocol/session/SessionDetail";

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
  const [sessionDetail, setSessionDetail] = useState<SessionDetail>();
  //不要解构，因为解构会useEffect的依赖引用无变化，不会重新渲染
  const webSocketContextValue = useContext(WebSocketContext);
  useEffect(() => {
    console.log("sessionKey changed to: ", sessionHeaderProps.sessionKey);
    if (!sessionKey) {
      return;
    }
    const chatSession = ChatSession.parse(sessionKey);
    chatSession
      ?.getSessionDetail(webSocketContextValue.messageBroker)
      .then((sessionDetail) => {
        setSessionDetail(sessionDetail);
      });
    //https://react.docschina.org/learn/queueing-a-series-of-state-updates
    // setMessageList((messageList) => [...messageList, new Message(protocol)]);
  }, [sessionKey]);

  if (!sessionDetail) {
    return <ThreeDotLoading />;
  }

  return (
    <div
      className={
        "flex shrink-0 h-[3rem] flex-row  justify-start items-center gap-2 p-2"
      }
    >
      <DynamicImage
        className={"w-10 h-10 rounded-full"}
        src={sessionDetail.avatarUrl}
        alt={sessionDetail.name}
        width={0}
        height={0}
      />{" "}
      <span className={"text-left text-sm"}>{sessionDetail.name}</span>
    </div>
  );
}

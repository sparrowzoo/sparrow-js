"use client";
import React, { useContext, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import MessageSender from "@/components/session/MessageSender";
import SessionHeader from "@/components/session/SessionHeader";
import { WebSocketContext } from "@/lib/im/WebSocketProvider";
import ChatSession from "@/lib/protocol/session/ChatSession";

interface SessionProps {
  sessionKey?: string;
}

export default function Session(sessionProps: SessionProps) {
  const webSocketContextValue = useContext(WebSocketContext);
  const searchParams = useSearchParams();
  const [currentSessionKey, setCurrentSessionKey] = useState("");

  let sessionKey = sessionProps.sessionKey;
  if (!sessionKey) {
    sessionKey = searchParams.get("sessionKey") as string;
  }
  if (!sessionKey) {
    sessionKey =
      webSocketContextValue.messageBroker.sessionContainer.getDefaultSession()
        ?.sessionKey;
  }

  useEffect(() => {
    const session = ChatSession.parse(sessionKey as string);
    if (session?.isOne2One()) {
      setCurrentSessionKey(sessionKey as string);
      return;
    }
    webSocketContextValue.messageBroker.contactContainer
      .fetchGroupDetail(session?.id as string)
      .then((groupDetail) => {
        setCurrentSessionKey(sessionKey as string);
      });
  }, [sessionKey]);

  if (!currentSessionKey) {
    return <div>NO SESSION FOUND</div>;
  }

  return (
    <div className={"flex flex-col w-full min-h-0 h-full"}>
      {/*<SessionHeader sessionKey={currentSessionKey} />*/}
      {/*<MessageSender sessionKey={currentSessionKey} />*/}
    </div>
  );
}

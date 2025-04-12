"use client";
import React, { useContext, useState } from "react";
import { useSearchParams } from "next/navigation";
import MessageSender from "@/components/session/MessageSender";
import SessionHeader from "@/components/session/SessionHeader";
import { WebSocketContext } from "@/lib/WebSocketProvider";
import ThreeDotLoading from "@/common/components/ThreeDotLoading";

export default function Session() {
  const searchParams = useSearchParams();
  const [sessionKey, setSessionKey] = useState("");
  const webSocketContextValue = useContext(WebSocketContext);

  function refreshSessionKey() {
    const sessionKeyFromUrl = searchParams?.get("sessionKey");
    if (!sessionKeyFromUrl) {
      webSocketContextValue.messageBroker.getChatSessions().then((sessions) => {
        if (sessions && sessions.length > 0) {
          setSessionKey(sessions[0].key());
        }
      });
      return;
    }
    if (sessionKeyFromUrl !== sessionKey) {
      setSessionKey(sessionKeyFromUrl);
    }
  }

  refreshSessionKey();
  if (!sessionKey) {
    return <ThreeDotLoading />;
  }

  return (
    <div className={"flex flex-col w-full min-h-0 h-full"}>
      <SessionHeader sessionKey={sessionKey} />
      <MessageSender sessionKey={sessionKey} />
    </div>
  );
}

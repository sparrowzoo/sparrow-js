"use client";
import React, { useContext } from "react";
import { useSearchParams } from "next/navigation";
import MessageSender from "@/components/session/MessageSender";
import SessionHeader from "@/components/session/SessionHeader";
import { WebSocketContext } from "@/lib/WebSocketProvider";

interface SessionProps {
  sessionKey?: string;
}

export default function Session(sessionProps: SessionProps) {
  const webSocketContextValue = useContext(WebSocketContext);
  const searchParams = useSearchParams();
  let currentSessionKey = sessionProps.sessionKey;
  // 没有传入sessionKey，从searchParams中获取sessionKey
  if (!currentSessionKey) {
    currentSessionKey = searchParams?.get("sessionKey") as string;
  }

  if (!currentSessionKey) {
    currentSessionKey = webSocketContextValue.messageBroker.contactContainer
      .getDefaultSession()
      ?.key();
  }

  if (!currentSessionKey) {
    return <div>NO SESSION FOUND</div>;
  }

  return (
    <div className={"flex flex-col w-full min-h-0 h-full"}>
      <SessionHeader sessionKey={currentSessionKey} />
      <MessageSender sessionKey={currentSessionKey} />
    </div>
  );
}

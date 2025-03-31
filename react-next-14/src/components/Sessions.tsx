"use client";
import SessionItem from "@/components/SessionItem";
import React, { useContext, useEffect, useState } from "react";
import ChatSession from "@/lib/protocol/ChatSession";
import { WebSocketContext } from "@/lib/WebSocketProvider";

export default function Sessions() {
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const webSocketContextValue = useContext(WebSocketContext);
  const messageBroker = webSocketContextValue.messageBroker;
  useEffect(() => {
    messageBroker.getChatSessions().then((chatSessions) => {
      setSessions(chatSessions as ChatSession[]);
    });
  }, []);
  return (
    <>
      {sessions.map((session) => (
        <SessionItem key={session.key()} chatSession={session} />
      ))}
    </>
  );
}

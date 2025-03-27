"use client";
import SessionItem from "@/components/SessionItem";
import React, { useEffect, useState } from "react";
import ChatApi from "@/lib/ChatApi";
import ChatSession from "@/lib/protocol/ChatSession";

export default function Sessions() {
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  useEffect(() => {
    ChatApi.getSessions().then((sessions) => {
      console.log(sessions.length);
      setSessions(sessions);
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

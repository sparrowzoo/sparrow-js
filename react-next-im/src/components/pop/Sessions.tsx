"use client";
import SessionItem from "@/components/pop/SessionItem";
import React from "react";
import ChatSession from "@/lib/protocol/session/ChatSession";
import { SidebarMenu } from "@/components/ui/sidebar";

interface SessionsProps {
  sessions: ChatSession[];
}

export default function Sessions(sessionProp: SessionsProps) {
  const sessions = sessionProp.sessions;
  sessions.sort((a, b) => {
    return b.lastReadTime - a.lastReadTime;
  });
  console.log("sessions 重渲染");
  return (
    <SidebarMenu>
      {sessions.map((session) => (
        <SessionItem key={session.sessionKey} chatSession={session} />
      ))}
    </SidebarMenu>
  );
}

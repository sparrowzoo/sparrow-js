"use client";
import React from "react";
import ChatSession from "@/lib/protocol/session/ChatSession";
import { SidebarMenu } from "@/components/ui/sidebar";
import SessionItem from "@/components/session/SessionItem";

interface SessionsProps {
  sessions: ChatSession[];
  triggerType: "POP" | "LINK";
}

export default function Sessions(props: SessionsProps) {
  return (
    <SidebarMenu className={"gap-2"}>
      {props.sessions.map((session) => (
        <SessionItem
          unreadPosition={session.unreadPosition}
          triggerType={props.triggerType}
          key={session.sessionKey}
          chatSession={session}
        />
      ))}
    </SidebarMenu>
  );
}

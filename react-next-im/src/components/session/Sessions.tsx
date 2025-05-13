"use client";
import React from "react";
import ChatSession from "@/lib/protocol/session/ChatSession";
import { SidebarMenu } from "@/components/ui/sidebar";
import SessionItem from "@/components/session/SessionItem";
import ThreeDotLoading from "@/common/components/ThreeDotLoading";

interface SessionsProps {
  sessions: ChatSession[];
  triggerType: "POP" | "LINK";
}

export default function Sessions(props: SessionsProps) {
  console.log("Sessions render ....", props);
  if (!props.sessions) {
    return <ThreeDotLoading />;
  }
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

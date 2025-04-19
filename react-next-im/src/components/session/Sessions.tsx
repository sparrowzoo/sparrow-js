"use client";
import SessionItem from "@/components/session/SessionItem";
import React from "react";
import ChatSession from "@/lib/protocol/session/ChatSession";
import { CollapsibleContent } from "@/components/ui/collapsible";
import { SidebarGroupContent, SidebarMenu } from "@/components/ui/sidebar";

interface SessionsProps {
  sessions: ChatSession[];
}

export default function Sessions(sessionProp: SessionsProps) {
  const sessions = sessionProp.sessions;
  console.log("sessions 重渲染");
  return (
    <CollapsibleContent>
      <SidebarGroupContent>
        <SidebarMenu>
          {sessions.map((session) => (
            <SessionItem key={session.sessionKey} chatSession={session} />
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </CollapsibleContent>
  );
}

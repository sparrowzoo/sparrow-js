"use client";
import SessionItem from "@/components/SessionItem";
import React, { useContext, useEffect, useState } from "react";
import ChatSession from "@/lib/protocol/ChatSession";
import { WebSocketContext } from "@/lib/WebSocketProvider";
import { CollapsibleContent } from "@/components/ui/collapsible";
import { SidebarGroupContent, SidebarMenu } from "@/components/ui/sidebar";

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
    <CollapsibleContent>
      <SidebarGroupContent>
        <SidebarMenu>
          {sessions.map((session) => (
            <SessionItem key={session.key()} chatSession={session} />
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </CollapsibleContent>
  );
}

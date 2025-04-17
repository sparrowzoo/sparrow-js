"use client";
import SessionItem from "@/components/session/SessionItem";
import React, {useContext, useEffect} from "react";
import ChatSession from "@/lib/protocol/session/ChatSession";
import { CollapsibleContent } from "@/components/ui/collapsible";
import { SidebarGroupContent, SidebarMenu } from "@/components/ui/sidebar";
import {WebSocketContext} from "@/lib/WebSocketProvider";

interface SessionsProps {
  sessions: ChatSession[];
}

export default function Sessions(sessionProp: SessionsProps) {
    const sessions = sessionProp.sessions;
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

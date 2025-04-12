"use client";
import * as React from "react";
import { useContext, useEffect, useState } from "react";
import Sessions from "@/components/session/Sessions";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarProvider,
} from "@/components/ui/sidebar";
import { Collapsible, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronDown } from "lucide-react";
import { SessionContext } from "@/lib/SessionProvider";
import ChatSession from "@/lib/protocol/session/ChatSession";
import { WebSocketContext } from "@/lib/WebSocketProvider";
import ThreeDotLoading from "@/common/components/ThreeDotLoading";

export default function ChatLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [newSession, setNewSession] = useState<string>("");
  const [sessions, setSessions] = useState<ChatSession[]>();
  const webSocketContextValue = useContext(WebSocketContext);
  const messageBroker = webSocketContextValue.messageBroker;
  useEffect(() => {
    messageBroker.getChatSessions().then((chatSessions) => {
      setSessions(chatSessions as ChatSession[]);
    });
  }, [newSession]);
  if (!sessions) {
    return <ThreeDotLoading />;
  }
  return (
    <div className="flex flex-row flex-1">
      <SidebarProvider className={"min-h-full h-full w-auto"}>
        <Sidebar className={"relative min-h-full h-full"}>
          <SidebarContent>
            <Collapsible defaultOpen className="group/collapsible">
              <SidebarGroup>
                <SidebarGroupLabel
                  className={
                    "border-b-1 rounded-none  border-gray-400 text-black "
                  }
                  asChild
                >
                  <CollapsibleTrigger>
                    会话
                    <ChevronDown className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-180" />
                  </CollapsibleTrigger>
                </SidebarGroupLabel>
                <Sessions sessions={sessions} />
              </SidebarGroup>
            </Collapsible>
          </SidebarContent>
        </Sidebar>
      </SidebarProvider>
      <SessionContext.Provider value={setNewSession}>
        {children}
      </SessionContext.Provider>
    </div>
  );
}

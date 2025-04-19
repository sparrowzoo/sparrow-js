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
import ChatSession from "@/lib/protocol/session/ChatSession";
import { WebSocketContext } from "@/lib/im/WebSocketProvider";
import ThreeDotLoading from "@/common/components/ThreeDotLoading";

export default function ChatLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [sessions, setSessions] = useState<ChatSession[]>();
  const webSocketContextValue = useContext(WebSocketContext);
  const messageBroker = webSocketContextValue.messageBroker;
  useEffect(() => {
    messageBroker.sessionContainer.getChatSessions().then((chatSessions) => {
      console.log("chat sessions is ready ....");
      //只有第一次初始化时有效，再次请求时，列表有变化，但引用没有变化
      //所以页面不会变化
      //象列表排序的功能，需要在参数传递之前准备好数据
      //当前prop发生变化时，会重新渲染子组件
      setSessions(chatSessions as ChatSession[]);
    });
  }, []);
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
      {children}
    </div>
  );
}

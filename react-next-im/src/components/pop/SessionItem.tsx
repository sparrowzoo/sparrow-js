import * as React from "react";
import {
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import Dialog from "@/components/pop/Dialog";
import ChatSession from "@/lib/protocol/session/ChatSession";

interface SessionProps {
  chatSession: ChatSession;
}

export default function SessionItem(sessionProps: SessionProps) {
  const { chatSession } = sessionProps;
  return (
    <SidebarMenuItem className={"gap-2"}>
      <SidebarMenuButton asChild={true} className={"flex flex-row gap-4"}>
        <Dialog session={chatSession} />
      </SidebarMenuButton>
      <SidebarMenuBadge></SidebarMenuBadge>
    </SidebarMenuItem>
  );
}

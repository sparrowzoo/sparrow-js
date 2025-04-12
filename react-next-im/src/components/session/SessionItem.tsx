"use client";
import Link from "next/link";
import * as React from "react";
import { useContext, useEffect, useState } from "react";
import {
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { WebSocketContext } from "@/lib/WebSocketProvider";
import ThreeDotLoading from "@/common/components/ThreeDotLoading";
import SessionDetail from "@/lib/protocol/session/SessionDetail";
import ChatSession from "@/lib/protocol/session/ChatSession";
import MyAvatar from "@/components/MyAvatar";

interface SessionItemProps {
  chatSession: ChatSession;
}

export default function SessionItem(props: SessionItemProps) {
  const { chatSession } = props;
  const [sessionDetail, setSessionDetail] = useState<SessionDetail>();
  const webSocketContextValue = useContext(WebSocketContext);

  useEffect(() => {
    chatSession
      .getSessionDetail(webSocketContextValue.messageBroker)
      .then((sessionDetail) => {
        setSessionDetail(sessionDetail);
      });
  }, [chatSession]);
  if (!sessionDetail) {
    return <ThreeDotLoading />;
  }
  debugger;
  return (
    <SidebarMenuItem className={"gap-2"}>
      <SidebarMenuButton asChild>
        <Link href={sessionDetail.sessionUrl}>
          <MyAvatar
            fallback={sessionDetail.name}
            src={sessionDetail.avatarUrl}
          />
          <span>{sessionDetail?.name}</span>
        </Link>
      </SidebarMenuButton>
      <SidebarMenuBadge></SidebarMenuBadge>
    </SidebarMenuItem>
  );
}

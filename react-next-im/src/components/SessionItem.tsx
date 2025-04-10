"use client";
import Link from "next/link";
import * as React from "react";
import ChatSession from "@/lib/protocol/ChatSession";
import { NEXT_ASSET_PREFIX } from "@/common/lib/Env";
import {
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { DynamicImage } from "@/components/img/DynamicImage";

interface SessionItemProps {
  chatSession: ChatSession;
}

export default function SessionItem(props: SessionItemProps) {
  const { chatSession } = props;
  const sessionUrl = `${NEXT_ASSET_PREFIX}/chat/sessions/session?sessionKey=${chatSession.key()}`;
  const oppositeUser = chatSession?.getOppositeUser();
  const avatar = `${NEXT_ASSET_PREFIX}/avatar/${oppositeUser?.id}.jpg`;

  return (
    <SidebarMenuItem className={"gap-2"}>
      <SidebarMenuButton asChild>
        <Link href={sessionUrl}>
          <DynamicImage
            src={avatar}
            alt={"header"}
            width={0}
            height={0}
            className={"w-8 h-8 rounded-full mr-4"}
          />
          <span>{oppositeUser?.id}</span>
        </Link>
      </SidebarMenuButton>
      <SidebarMenuBadge>24</SidebarMenuBadge>
    </SidebarMenuItem>
  );
}

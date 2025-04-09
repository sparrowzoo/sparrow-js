"use client";
import Link from "next/link";
import * as React from "react";
import ChatSession from "@/lib/protocol/ChatSession";
import { NEXT_ASSET_PREFIX } from "@/common/lib/Env";

interface SessionItemProps {
  chatSession: ChatSession;
}

export default function SessionItem(props: SessionItemProps) {
  const { chatSession } = props;
  const sessionUrl = `${NEXT_ASSET_PREFIX}/chat/sessions/session?sessionKey=${chatSession.key()}`;
  const oppositeUser = chatSession?.getOppositeUser();
  const avatar = `${NEXT_ASSET_PREFIX}/avatar/${oppositeUser?.id}.jpg`;

  return (
    <div className="flex items-center text-left">
      <Link href={sessionUrl}>
        <img className={"w-16 h-16 rounded-full mr-4"} src={avatar} />
      </Link>
      <div>
        <Link href={sessionUrl}>
          <strong>Andrew Alfred</strong>
          <br />
          <span>Technical advisor</span>
        </Link>
      </div>
    </div>
  );
}

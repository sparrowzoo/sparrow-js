"use client";
import Link from "next/link";
import * as React from "react";
import { useEffect, useState } from "react";
import ChatSession from "@/lib/protocol/ChatSession";
import { NEXT_ASSET_PREFIX } from "@/lib/EnvUtils";

interface SessionItemProps {
  sessionKey: string;
}

export default function SessionItem(sessionItemProps: SessionItemProps) {
  const chatSession = ChatSession.parse(sessionItemProps.sessionKey);
  const sessionUrl = `${NEXT_ASSET_PREFIX}/chat/sessions/session?sessionKey=${sessionItemProps.sessionKey}`;
  const oppositeUser = chatSession?.getOppositeUser();

  const [sessionAvatar, setSessionAvatar] = useState("");
  useEffect(() => {
    const chatSession = ChatSession.parse(sessionItemProps.sessionKey);
    const oppositeUser = chatSession?.getOppositeUser();
    const avatar = `${NEXT_ASSET_PREFIX}/avatar/${oppositeUser?.getId()}.jpg`;
    setSessionAvatar(avatar);
  }, [sessionItemProps.sessionKey]);
  return (
    <div className="flex items-center text-left">
      <Link href={sessionUrl}>
        <img className={"w-16 h-16 rounded-full mr-4"} src={sessionAvatar} />
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

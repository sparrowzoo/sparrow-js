"use client";
import * as React from "react";
import { Suspense, useContext } from "react";
import { useSearchParams } from "next/navigation";
import { DynamicImage } from "@/components/img/DynamicImage";
import { WebSocketContext } from "@/lib/WebSocketProvider";
import DirectSession from "@/components/DirectSession";
import { format } from "util";
import { AVATAR_URL } from "@/common/lib/Env";
import ChatSession from "@/lib/protocol/session/ChatSession";

function Group() {
  const searchParams = useSearchParams();
  const groupId = searchParams?.get("groupId");
  const webSocketContextValue = useContext(WebSocketContext);
  const messageBroker = webSocketContextValue.messageBroker;
  const headSrc = format(AVATAR_URL, groupId);
  const chatSession = ChatSession.createGroupSession(groupId as string);

  const groupDetail = messageBroker.getGroupDetail(groupId as string);
  if (!groupDetail) {
    return <div>Loading...</div>;
  }

  return (
    <div className={"flex flex-col p-4 bg-white shadow-md"}>
      <div className="flex flex-row items-center text-left">
        <DynamicImage
          className={"w-16 h-16 rounded-full mr-4"}
          src={headSrc}
          alt={groupDetail?.qunName}
          width={50}
          height={50}
        />
        <div>
          <strong>{groupDetail?.qunName}</strong>
          <br />
          <span>{groupDetail.nationality}</span>
        </div>
      </div>
      <p className={"mt-2 text-gray-500 text-left"}>
        {groupDetail.announcement}
      </p>
      <div className={"flex flex-col gap-2"}>
        <h2>Group members</h2>
      </div>
      <DirectSession sessionKey={chatSession.key()} />
    </div>
  );
}

export default function ContactPage() {
  return (
    <Suspense>
      <Group />
    </Suspense>
  );
}

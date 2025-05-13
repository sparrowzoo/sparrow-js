"use client";
import SessionItemProps from "@/components/session/item/SessionItemProps";
import { Position } from "@/lib/protocol/ItemProps";
import * as React from "react";
import { useContext } from "react";
import BaseTrigger from "@/components/session/item/BaseTrigger";
import ChatSession from "@/lib/protocol/session/ChatSession";
import { Button } from "@/components/ui/button";
import { WebSocketContext } from "@/lib/im/WebSocketProvider";
import { useRouter } from "next/navigation";

export default function LinkedSessionTrigger(
  sessionItemProps: SessionItemProps
) {
  const webSocketContextValue = useContext(WebSocketContext);
  const messageBroker = webSocketContextValue.messageBroker;
  const { chatSession } = sessionItemProps;
  const router = useRouter();

  function handleClick() {
    console.log("getMessageList", sessionItemProps.chatSession.sessionKey);
    messageBroker.sessionContainer.pullSession(
      ChatSession.parse(sessionItemProps.chatSession.sessionKey) as ChatSession
    );
    //router.push(chatSession.sessionUrl);
  }

  return (
    <Button
      variant={"link"}
      onClick={() => {
        handleClick();
      }}
      className={"block w-full h-fit p-0 cursor-pointer"}
    >
      <BaseTrigger unreadPosition={Position.TAIL} chatSession={chatSession} />
    </Button>
  );
}

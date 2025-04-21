import SessionItemProps from "@/components/session/item/SessionItemProps";
import { Position } from "@/lib/protocol/ItemProps";
import Link from "next/link";
import * as React from "react";
import BaseTrigger from "@/components/session/item/BaseTrigger";

export default function LinkedSessionTrigger(
  sessionItemProps: SessionItemProps
) {
  return (
    <Link
      className={"block w-fit h-fit p-0"}
      href={sessionItemProps.chatSession.sessionUrl}
    >
      <BaseTrigger
        unreadPosition={Position.TAIL}
        chatSession={sessionItemProps.chatSession}
      />
    </Link>
  );
}

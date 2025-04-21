import SessionItemProps from "@/components/session/item/SessionItemProps";
import { Position } from "@/lib/protocol/ItemProps";
import Link from "next/link";
import * as React from "react";
import BaseTrigger from "@/components/session/item/BaseTrigger";

export default function LinkedSessionTrigger(
  sessionItemProps: SessionItemProps
) {
  const { chatSession } = sessionItemProps;
  return (
    <Link className={"block w-full h-fit p-0"} href={chatSession.sessionUrl}>
      <BaseTrigger unreadPosition={Position.TAIL} chatSession={chatSession} />
    </Link>
  );
}

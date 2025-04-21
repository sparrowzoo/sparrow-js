import * as React from "react";
import SessionItemProps from "@/components/session/item/SessionItemProps";
import PopSessionItemTrigger from "@/components/session/item/PopSessionItemTrigger";
import LinkedSessionTrigger from "@/components/session/item/LinkedSessionItemTrigger";

export default function SessionItemTrigger(sessionItemProps: SessionItemProps) {
  const chatSession = sessionItemProps.chatSession;
  if (sessionItemProps.triggerType == "POP") {
    return <PopSessionItemTrigger session={chatSession} />;
  }
  return <LinkedSessionTrigger chatSession={chatSession} />;
}

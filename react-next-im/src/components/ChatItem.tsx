import * as React from "react";
import { useContext } from "react";
import Message from "@/lib/protocol/Message";
import { format } from "util";

import { WebSocketContext } from "@/lib/WebSocketProvider";
import { AVATAR_URL } from "@/common/lib/Env";
import { Separator } from "@/components/ui/separator";
import MyAvatar from "@/components/MyAvatar";

interface Props {
  message: Message;
  key: string;
}

export default function ChatItem(props: Props) {
  const webSocketContextValue = useContext(WebSocketContext);
  debugger;
  if (props.message.timeline > 0) {
    return (
      <div className={"text-gray-500 text-sm"}>
        {props.message.getTimeline()}
        <Separator />
      </div>
    );
  }
  const { sender, content, align } = props.message;
  let senderDetail = webSocketContextValue.messageBroker.getContactFromLocal(
    sender.id
  );
  debugger;
  const avatar = format(AVATAR_URL, sender.id);
  const alignProp = align === "left" ? "items-start" : "items-end";
  const alignClass = `flex flex-col ${alignProp}`;
  return (
    <div className={alignClass}>
      <div className={"flex flex-row  p-4 rounded-lg"}>
        <MyAvatar fallback={senderDetail?.userName as string} src={avatar} />
        <div className={"flex flex-col text-left"}>
          <span className={"flex-1 text-sm text-gray-900"}>
            {senderDetail?.userName} @{senderDetail?.nationality}
          </span>
          <p className={"p-2 rounded-lg text-gray-600 bg-gray-100"}>
            {content}
          </p>
        </div>
      </div>
    </div>
  );
}

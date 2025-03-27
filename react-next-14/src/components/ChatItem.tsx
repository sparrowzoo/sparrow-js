import * as React from "react";
import Message from "@/lib/protocol/Message";
import { NEXT_ASSET_PREFIX } from "@/lib/EnvUtils";

interface Props {
  message: Message;
  key: string;
}

export default function ChatItem(props: Props) {
  const { sender, content, sendTime, align } = props.message;
  const avatar = `${NEXT_ASSET_PREFIX}/avatar/${sender.id}.jpg`;
  const alignProp = align === "left" ? "items-start" : "items-end";
  const alignClass = `flex flex-col ${alignProp}`;
  return (
    <div className={alignClass}>
      <div className={"flex flex-row  p-4 bg-gray-100 rounded-lg"}>
        <img className={" w-8 h-8 rounded-full mr-4"} src={avatar} />
        <strong className={"flex-1 text-gray-900"}>
          sender: {sender.id} @{sendTime}
        </strong>
      </div>
      <p className={"text-gray-600"}>{content}</p>
    </div>
  );
}

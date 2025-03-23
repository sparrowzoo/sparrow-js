import * as React from "react";
import { AlignType } from "@/lib/protocol/Message";

interface ChatItemProps {
  avatar: string;
  align: AlignType;
  message: string;
  sender: string;
  timestamp: string;
  img: string | undefined;
}

export default function ChatItem(props: ChatItemProps) {
  const alignProp = props.align === "left" ? "items-start" : "items-end";
  const alignClass = `flex flex-col ${alignProp}`;
  return (
    <div className={alignClass}>
      <div className={"flex flex-row  p-4 bg-gray-100 rounded-lg"}>
        <img className={" w-8 h-8 rounded-full mr-4"} src={props.avatar} />
        <strong className={"flex-1 text-gray-900"}>
          sender: {props.sender} @{props.timestamp}
        </strong>
      </div>
      <p className={"text-gray-600"}>
        {props.message}
        {props.img && <img className={"w-64"} src={props.img} />}
      </p>
    </div>
  );
}

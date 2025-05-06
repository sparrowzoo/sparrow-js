import * as React from "react";
import { Key, useContext } from "react";
import Message from "@/lib/protocol/Message";

import { WebSocketContext } from "@/lib/im/WebSocketProvider";
import { Separator } from "@/components/ui/separator";
import MyAvatar from "@/components/MyAvatar";

interface Props {
  message: Message;
  key: Key;
  //这里的key是React的key属性，用来标识每个组件的唯一性，在列表中必须设置，否则会出现渲染错误。
  //永远是undefined
}

export default function MessageItem(props: Props) {
  const webSocketContextValue = useContext(WebSocketContext);
  if (props.message.timeline > 0) {
    return (
      <div className={"text-gray-500 text-sm"}>
        {props.message.getTimeline()}
        <Separator />
      </div>
    );
  }
  const { sender, content, align } = props.message;
  let senderDetail =
    webSocketContextValue.messageBroker.contactContainer.getContactDetail(
      sender
    );
  const alignProp = align === "left" ? " items-start" : " items-end";
  const alignClass = `flex h-fit flex-col ${alignProp}`;
  const itemAlignClass =
    align === "left"
      ? "flex flex-row  p-4 rounded-lg gap-4"
      : "flex flex-row-reverse  p-4 rounded-lg gap-4";
  return (
    <div key={props.message.messageId} className={alignClass}>
      <div className={itemAlignClass}>
        <MyAvatar
          unread={0}
          showUnread={false}
          fallback={senderDetail?.userName as string}
          src={senderDetail?.avatar as string}
        />
        <div className={"flex flex-col text-left"}>
          <span className={" text-xs dark:text-gray-300 light:text-gray-900"}>
            {props.message.sendTime as string}
          </span>
          <span
            className={"flex-1 text-xs dark:text-gray-300 light:text-gray-900"}
          >
            {senderDetail?.userName} @{senderDetail?.nationality}
          </span>
          <p
            dangerouslySetInnerHTML={{ __html: content }}
            className={
              "p-2 text-xs rounded-lg dark:text-background light:text-gray-900  bg-gray-100"
            }
          ></p>
        </div>
      </div>
    </div>
  );
}

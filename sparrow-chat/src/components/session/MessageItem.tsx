import * as React from "react";
import { Key, useContext } from "react";
import Message from "@/common/lib/protocol/messaging/Message";

import { WebSocketContext } from "@/lib/im/WebSocketProvider";
import { Separator } from "@/components/ui/separator";
import MyAvatar from "@/components/MyAvatar";
import MessageContent from "./MessageContent";
import {useLocale} from "next-intl";
import toast from "react-hot-toast";

interface Props {
  message: Message;
  key: Key;
  //这里的key是React的key属性，用来标识每个组件的唯一性，在列表中必须设置，否则会出现渲染错误。
  //永远是undefined
}

export default function MessageItem(props: Props) {
  const webSocketContextValue = useContext(WebSocketContext);
  const zh = useLocale().startsWith("zh");
  const broker = webSocketContextValue.messageBroker;
  if (props.message.timeline > 0) {
    return (
      <div className={"im-message-timeline text-gray-500 text-center text-sm"}>
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
  const alignClass = `im-message-row flex h-fit flex-col ${alignProp}`;
  const itemAlignClass =
    align === "left"
      ? "im-message-item im-message-received flex flex-row  p-4 rounded-lg gap-4"
      : "im-message-item im-message-sent flex flex-row-reverse  p-4 rounded-lg gap-4";
  return (
    <div key={props.message.messageId} className={alignClass}>
      <div className={itemAlignClass}>
        <MyAvatar
          unread={0}
          showUnread={false}
          fallback={senderDetail?.userName as string}
          src={senderDetail?.avatar as string}
        />
        <div className={"im-message-body flex flex-col text-left"}>
          <span className={"im-message-time text-xs dark:text-gray-300 light:text-gray-900"}>
            {props.message.sendTime as string}
          </span>
          <span
            className={"im-message-author flex-1 text-xs dark:text-gray-300 light:text-gray-900"}
          >
            {senderDetail?.userName} @{senderDetail?.nationality}
          </span>
          <div className="im-message-bubble prose prose-sm max-w-none break-words p-3 rounded-lg bg-muted text-foreground dark:prose-invert">
            <MessageContent message={props.message} zh={zh}
              canAnswer={questionId => broker.canAnswer(props.message.session.sessionKey, questionId)}
              onAnswer={(questionId, answers) => {
                broker.sendAnswer(props.message.session.sessionKey, questionId, answers)
                  .catch(() => toast.error(zh ? "发送失败，请重试。" : "Unable to send. Please retry."));
              }}/>
          </div>
        </div>
      </div>
    </div>
  );
}

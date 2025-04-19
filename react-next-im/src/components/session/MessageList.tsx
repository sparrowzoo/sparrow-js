import ChatItem from "@/components/session/MessageItem";
import React, { MutableRefObject, useEffect, useRef } from "react";
import Message from "@/lib/protocol/Message";

interface MessageListProps {
  messageList: Message[];
  localMessageNo: number;
  sessionKey: string;
}

export default function MessageList(messageListProp: MessageListProps) {
  console.log("message list 重渲染");
  const { messageList, localMessageNo } = messageListProp;
  const messageContainerRef: MutableRefObject<HTMLDivElement | null> =
    useRef(null);
  //不要解构，因为解构会useEffect的依赖引用无变化，不会重新渲染

  useEffect(() => {
    messageContainerRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "nearest",
      inline: "center",
    });
  }, [localMessageNo]);

  return (
    <>
      <div
        className={
          "flex flex-col min-h-0 overflow-y-scroll  flex-1 p-2 border border-gray-300 rounded-md"
        }
      >
        {messageList.map((message) => (
          <ChatItem key={message.messageId} message={message} />
        ))}

        <div className={"h-[0px]"} ref={messageContainerRef} />
      </div>
    </>
  );
}

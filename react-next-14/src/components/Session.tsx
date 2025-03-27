"use client";
import { useSearchParams } from "next/navigation";
import React, {
  MutableRefObject,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import ChatItem from "@/components/ChatItem";
import { WebSocketContext } from "@/lib/WebSocketProvider";
import Message from "@/lib/protocol/Message";

export default function Session() {
  const searchParams = useSearchParams();
  const sessionKey = searchParams?.get("sessionKey");
  const [message, setMessage] = useState<string>("");
  const [messageList, setMessageList] = useState<Message[] | undefined>();
  //为了控制滚动条
  const [localMessageNo, setLocalMessageNo] = useState(0);
  const messageContainerRef: MutableRefObject<HTMLDivElement | null> =
    useRef(null);

  //不要解构，因为解构会useEffect的依赖引用无变化，不会重新渲染
  const webSocketContextValue = useContext(WebSocketContext);

  useEffect(() => {
    console.log("sessionKey changed to: ", sessionKey);
    if (!sessionKey) {
      return;
    }
    const messageContainer = webSocketContextValue.messageBroker;
    messageContainer
      .getMessageList(sessionKey as string)
      .then((messageList) => {
        setMessageList(messageList);
        //控制滚动条
        setLocalMessageNo(messageContainer?.webSocket.increaseTxid());
      });
    //https://react.docschina.org/learn/queueing-a-series-of-state-updates
    // setMessageList((messageList) => [...messageList, new Message(protocol)]);
  }, [sessionKey, webSocketContextValue]);

  useEffect(() => {
    messageContainerRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "end",
    });
  }, [localMessageNo]);

  async function sendMessage() {
    const messageContainer = webSocketContextValue.messageBroker;
    const sparrowWebSocket = messageContainer.webSocket;
    messageContainer.sendMessage(sessionKey as string, message);
    const messageList = await messageContainer.getMessageList(
      sessionKey as string
    );
    //https://react.docschina.org/learn/queueing-a-series-of-state-updates
    // setMessageList((messageList) => [...messageList, new Message(protocol)]);
    setMessageList(messageList);
    setLocalMessageNo(sparrowWebSocket.txid);
    setMessage("");
  }


  if (!messageList) {
    console.log("messageList is undefined");
    return <div>Loading...</div>;
  }
  return (
    <div className={"flex flex-col w-full h-full"}>
      <div>
        <h2>Welcome to: {sessionKey}</h2>
      </div>
      <div
        className={"overflow-y-scroll h-[25rem] p-4 border-2 border-red-700"}
      >
        {messageList.map((message) => (
          <ChatItem message={message} key={message.messageId} />
        ))}
        <div className={"h-[0px] h-[0px]"} ref={messageContainerRef} />
      </div>
      <textarea
        value={message}
        onKeyDown={(event: React.KeyboardEvent<HTMLTextAreaElement>) => {
          if (event.code === "Enter") {
            sendMessage();
          }
        }}
        onChange={(event) => setMessage(event.target.value)}
        className={"w-full flex-1"}
      ></textarea>
      <button
        onClick={(event) => sendMessage()}
        className={
          "bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        }
      >
        Send
      </button>
    </div>
  );
}

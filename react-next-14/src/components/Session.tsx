"use client";
import { useSearchParams } from "next/navigation";
import React, { MutableRefObject, useEffect, useRef, useState } from "react";
import ChatItem from "@/components/ChatItem";
import SparrowWebSocket from "@/lib/SparrowWebSocket";
import Protocol from "@/lib/protocol/Protocol";
import Chat from "@/lib/protocol/Chat";
import { Message } from "@/lib/protocol/Message";
import toast from "react-hot-toast";
import { getToken, removeToken } from "@/lib/TokenUtils";
import { USER_INFO_KEY } from "@/lib/EnvUtils";
import ChatSession from "@/lib/protocol/ChatSession";
import ChatUser from "@/lib/protocol/ChatUser";

export default function Session() {
  const searchParams = useSearchParams();
  const sessionKey = searchParams?.get("sessionKey");
  const [sparrowWebSocket, setSparrowWebSocket] = useState<SparrowWebSocket>();
  const [message, setMessage] = useState<string>("");
  const [messageList, setMessageList] = useState(new Array<Message>());
  const messageContainerRef: MutableRefObject<HTMLDivElement | null> =
    useRef(null);
  useEffect(() => {
    async function asyncInit() {
      const tokenParam = await getToken(true);
      const sparrowWebSocket = new SparrowWebSocket(
        "ws://localhost:8080/websocket",
        tokenParam as string
      );
      sparrowWebSocket.userValidCallback = (data: Result) => {
        console.log("userValidCallback", JSON.stringify(data));
        if (data.code == "0") {
          sessionStorage.setItem(USER_INFO_KEY, JSON.stringify(data.data));
        } else {
          removeToken();
          toast.error(data.message);
        }
      };
      sparrowWebSocket.connect();
      sparrowWebSocket.onMsgCallback = (protocol: Protocol) => {
        //https://react.docschina.org/learn/queueing-a-series-of-state-updates
        putNewMessage(protocol);
      };
      setSparrowWebSocket(sparrowWebSocket);
    }

    asyncInit();
    return () => {
      sparrowWebSocket?.close();
    };
  }, []);

  useEffect(() => {
    messageContainerRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "end",
    });
  }, [messageList]);

  function putNewMessage(protocol: Protocol) {
    //https://react.docschina.org/learn/queueing-a-series-of-state-updates      setMessageList((messageList) => [...messageList, new Message(protocol)]);
    setMessageList((messageList) => {
      return [...messageList, new Message(protocol)];
    });
  }

  function sendMessage() {
    const chatSession = ChatSession.parse(sessionKey as string);
    console.log("containerRef", messageContainerRef.current);
    let protocol;
    if (chatSession?.chatType == Chat.CHAT_TYPE_1_TO_1) {
      const oppositeUser = chatSession.getOppositeUser();
      protocol = Protocol.create121Chat(
        Chat.TEXT_MESSAGE,
        oppositeUser as ChatUser,
        message,
        new Date().getTime()
      );
    }
    putNewMessage(protocol);
    sparrowWebSocket?.sendMessage(protocol);
    setMessage("");
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
          <ChatItem
            key={message.messageId}
            img={undefined}
            align={message.align}
            message={message.content}
            sender={message.senderName}
            timestamp={message.sendTime}
          />
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

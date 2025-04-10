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
import ThreeDotLoading from "@/common/components/ThreeDotLoading";
import { DynamicImage } from "@/components/img/DynamicImage";
import ChatSession from "@/lib/protocol/ChatSession";
import { NEXT_ASSET_PREFIX } from "@/common/lib/Env";
import { Send } from "lucide-react";

export default function Session() {
  const searchParams = useSearchParams();
  const [sessionKey, setSessionKey] = useState("");
  const [message, setMessage] = useState<string>("");
  const [messageList, setMessageList] = useState<Message[] | undefined>();
  const chatSession = ChatSession.parse(sessionKey);
  const oppositeUser = chatSession?.getOppositeUser();
  const oppositeUserAvatarUrl = `${NEXT_ASSET_PREFIX}/avatar/${oppositeUser?.id}.jpg`;

  //为了控制滚动条
  const [localMessageNo, setLocalMessageNo] = useState(0);
  const messageContainerRef: MutableRefObject<HTMLDivElement | null> =
    useRef(null);
  //不要解构，因为解构会useEffect的依赖引用无变化，不会重新渲染
  const webSocketContextValue = useContext(WebSocketContext);

  function refreshSessionKey() {
    const sessionKeyFromUrl = searchParams?.get("sessionKey");
    if (!sessionKeyFromUrl) {
      webSocketContextValue.messageBroker.getChatSessions().then((sessions) => {
        if (sessions && sessions.length > 0) {
          setSessionKey(sessions[0].key());
        }
      });
      return;
    }
    if (sessionKeyFromUrl !== sessionKey) {
      setSessionKey(sessionKeyFromUrl);
    }
  }

  refreshSessionKey();

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
    return <ThreeDotLoading />;
  }
  return (
    <div className={"flex flex-col w-full min-h-0 h-full"}>
      <div
        className={
          "flex shrink-0 h-[3rem] flex-row  justify-start items-center gap-2 p-2"
        }
      >
        <DynamicImage
          className={"w-10 h-10 rounded-full"}
          src={oppositeUserAvatarUrl}
          alt={"头象"}
          width={0}
          height={0}
        />{" "}
        <span className={"text-left text-sm"}>{sessionKey}</span>
      </div>
      <div
        className={
          "flex flex-col min-h-0 overflow-y-scroll  flex-1 p-2 border border-gray-300 rounded-md"
        }
      >
        {messageList.map((message) => (
          <ChatItem message={message} key={message.messageId} />
        ))}
        <div className={"h-[0px]"} ref={messageContainerRef} />
      </div>
      <textarea
        value={message}
        onKeyDown={(event: React.KeyboardEvent<HTMLTextAreaElement>) => {
          if (event.code === "Enter") {
            sendMessage();
          }
        }}
        onChange={(event) => setMessage(event.target.value)}
        className={
          "w-full shrink-0  h-[25rem] border border-gray-300 rounded-md p-2"
        }
      ></textarea>

      <div
        className={
          "flex shrink-0 h-[2rem] flex-row items-center justify-center mt-4"
        }
      >
        <button
          className={
            "flex flex-row items-center justify-center w-1/6 cursor-pointer bg-gray-500 hover:bg-gray-900 text-white font-bold py-2 px-4 rounded"
          }
          onClick={(event) => sendMessage()}
        >
          发送
          <Send />
        </button>
      </div>
    </div>
  );
}

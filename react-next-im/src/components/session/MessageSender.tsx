import React, { useContext, useEffect, useState } from "react";
import { WebSocketContext } from "@/lib/WebSocketProvider";
import { SessionContext } from "@/lib/SessionProvider";
import Message from "@/lib/protocol/Message";
import ThreeDotLoading from "@/common/components/ThreeDotLoading";
import MessageList from "@/components/session/MessageList";
import MessageEditor from "@/components/session/MessageEditor";

interface MessageSenderProps {
  sessionKey: string | undefined;
}

export default function MessageSender(messageSenderProps: MessageSenderProps) {
  const sessionKey = messageSenderProps.sessionKey;
  const setNewSession = useContext(SessionContext);
  const [messageList, setMessageList] = useState<Message[] | undefined>();

  //为了控制滚动条
  const [localMessageNo, setLocalMessageNo] = useState(0);
  //不要解构，因为解构会useEffect的依赖引用无变化，不会重新渲染
  const webSocketContextValue = useContext(WebSocketContext);

  async function sendMessage(message: string) {
    const messageBroker = webSocketContextValue.messageBroker;
    const sparrowWebSocket = messageBroker.webSocket;
    messageBroker.sendMessage(sessionKey as string, message);
    const messageList = await messageBroker.getMessageList(
      sessionKey as string
    );
    //https://react.docschina.org/learn/queueing-a-series-of-state-updates
    // setMessageList((messageList) => [...messageList, new Message(protocol)]);
    setMessageList(messageList);
    setLocalMessageNo(sparrowWebSocket.txid);
    if (setNewSession) {
      setNewSession(sessionKey);
    }
  }

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
  }, [sessionKey, messageSenderProps, webSocketContextValue]);

  if (!messageList) {
    debugger;
    console.log("messageList is undefined");
    return <ThreeDotLoading />;
  }

  return (
    <>
      <MessageList
        messageList={messageList}
        localMessageNo={localMessageNo}
        sessionKey={sessionKey as string}
      />
      <MessageEditor sendMessage={sendMessage} />
    </>
  );
}

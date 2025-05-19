import React, { useContext, useEffect, useState } from "react";
import { WebSocketContext } from "@/lib/im/WebSocketProvider";
import Message from "@/lib/protocol/Message";
import ThreeDotLoading from "@/common/components/ThreeDotLoading";
import MessageList from "@/components/session/MessageList";
import MessageEditor from "@/components/session/MessageEditor";

interface MessageSenderProps {
  sessionKey: string | undefined;
}

let preProps: MessageSenderProps | null = null;
let preSessionKey: string | null = null;

export default function MessageSender(messageSenderProps: MessageSenderProps) {
  console.log("对象是否相同" + Object.is(messageSenderProps, preProps));
  console.log(
    "sessionKey 是否相同" +
      Object.is(preSessionKey, messageSenderProps.sessionKey)
  );
  preProps = messageSenderProps;
  preSessionKey = messageSenderProps.sessionKey as string;
  const sessionKey = messageSenderProps.sessionKey;
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
    //setMessageList(messageList);
    //setLocalMessageNo(sparrowWebSocket.txid);
  }

  useEffect(() => {
    console.log("sessionKey changed to: ", sessionKey);
    if (!sessionKey) {
      return;
    }
    const messageBroker = webSocketContextValue.messageBroker;
    messageBroker.getMessageList(sessionKey as string).then((messageList) => {
      setMessageList(messageList);
      //控制滚动条
      setLocalMessageNo(messageBroker?.webSocket.increaseTxid());
    });
    //https://react.docschina.org/learn/queueing-a-series-of-state-updates
    // setMessageList((messageList) => [...messageList, new Message(protocol)]);
  }, [messageSenderProps]);

  if (!messageList) {
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

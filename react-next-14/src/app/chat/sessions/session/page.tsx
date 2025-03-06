// https://nextjs.org/docs/app/api-reference/functions/use-search-params
"use client";
import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import ChatItem from "@/components/ChatItem";
import SparrowWebSocket from "@/lib/SparrowWebSocket";
import toast from "react-hot-toast";
import Protocol from "@/lib/protocol/Protocol";
import Chat from "@/lib/protocol/Chat";
import ChatUser from "@/lib/protocol/ChatUser";

function Session() {
  const searchParams = useSearchParams();
  const sessionKey = searchParams?.get("sessionKey");
  const [token, setToken] = useState("");
  const [active, setActive] = useState("");
  const [sparrowWebSocket, setSparrowWebSocket] = useState<SparrowWebSocket>();
  const [message, setMessage] = useState<string>("");
  useEffect(() => {
    const token =
      "eyJhdmF0YXIiOiJkZGQiLCJjYXRlZ29yeSI6MSwiZGF5cyI6MiwiZGV2aWNlSWQiOiIxMjcuMC4wLjEiLCJleHBpcmVBdCI6MTc0MzE0NjAzNDEwMiwiZXh0ZW5zaW9ucyI6e30sIm5pY2tOYW1lIjoiemhhbmdzYW4iLCJ1c2VySWQiOjAsInVzZXJOYW1lIjoiemhhbmdzYW4iLCJ2aXNpdG9yIjp0cnVlfQ==.Mo4TUxrpzwyW+YW52lvA5cXzOrc=";
    const active: string = localStorage.getItem("active") ?? "";
    setActive(active);
    setToken(token || "");
    const sparrowWebSocket = new SparrowWebSocket(
      "ws://localhost:8080/websocket",
      encodeURIComponent(token)
    );
    setSparrowWebSocket(sparrowWebSocket);
    sparrowWebSocket.userValidCallback = (data: Result) => {
      console.log("userValidCallback", JSON.stringify(data));
      if (data.code == "0") {
        localStorage.setItem("user-info", JSON.stringify(data.data));
      } else {
        toast.error(data.message);
      }
    };
    sparrowWebSocket.connect();
  }, []);

  function sendMessage() {
    const protocol = Protocol.create121Chat(
      Chat.TEXT_MESSAGE,
      new ChatUser("lisi", 1),
      message,
      new Date().getTime()
    );
    console.log("sendMessage", message);
    sparrowWebSocket?.sendMessage(protocol);
  }

  return (
    <div className={"flex flex-col w-full h-full"}>
      <div>
        <h2>Welcome to: {sessionKey}</h2>
      </div>
      <div
        className={"overflow-y-scroll h-[25rem] p-4 border-2 border-red-700"}
      >
        <ChatItem
          img={undefined}
          align={"left"}
          message={"Hello, how are you?"}
          sender={"user1"}
          timestamp={"12:00"}
        />
        <ChatItem
          img={undefined}
          align={"right"}
          message={"Hello, how are you?"}
          sender={"user2"}
          timestamp={"12:00"}
        />
        <ChatItem
          img={undefined}
          align={"left"}
          message={"Hello, how are you?"}
          sender={"user1"}
          timestamp={"12:00"}
        />
        <ChatItem
          img={undefined}
          align={"right"}
          message={"Hello, how are you?"}
          sender={"user1"}
          timestamp={"12:00"}
        />

        <ChatItem
          img={"/columns/1.jpg"}
          align={"right"}
          message={"Hello, how are you?"}
          sender={"user1"}
          timestamp={"12:00"}
        />
        <ChatItem
          img={"/columns/1.jpg"}
          align={"right"}
          message={"Hello, how are you?"}
          sender={"user1"}
          timestamp={"12:00"}
        />
        <ChatItem
          img={"/columns/1.jpg"}
          align={"right"}
          message={"Hello, how are you?"}
          sender={"user1"}
          timestamp={"12:00"}
        />
      </div>
      <textarea
        value={message}
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

//https://nextjs.org/docs/messages/missing-suspense-with-csr-bailout
export default function SessionPage() {
  return (
    // You could have a loading skeleton as the `fallback` too
    <Suspense>
      <Session />
    </Suspense>
  );
}

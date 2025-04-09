"use client";
import * as React from "react";
import { useContext, useEffect, useState } from "react";
import { WebSocketContext } from "@/lib/WebSocketProvider";
import Link from "next/link";
import ContactGroup from "@/lib/protocol/contact/ContactGroup";
import Contacts from "@/components/Contacts";
import Groups from "@/components/Groups";

export default function ChatLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const webSocketContextValue = useContext(WebSocketContext);
  const messageBroker = webSocketContextValue.messageBroker;
  const [contactGroup, setContactGroup] = useState<ContactGroup>();
  useEffect(() => {
    messageBroker.getContactGroup().then((contactGroup) => {
      setContactGroup(contactGroup as ContactGroup);
    });
  }, [messageBroker]);
  return (
    <div className="flex flex-row">
      <div className="w-[20rem] flex flex-col p-2 gap-4 border-gray-300">
        <div className={"bg-cyan-500 text-white p-2 rounded-xl cursor-pointer"}>
          <Link href="/chat">联系人</Link>
        </div>
        <Contacts contacts={contactGroup?.contacts} />
        <div className={"bg-cyan-500 text-white p-2 rounded-xl cursor-pointer"}>
          <Link href="/chat/friends/group">群聊</Link>
        </div>
        <Groups quns={contactGroup?.quns} />
      </div>
      <div className={"flex-1 border-2 border-gray-300"}>{children}</div>
    </div>
  );
}

"use client";
import * as React from "react";
import { useContext, useEffect, useState } from "react";
import { WebSocketContext } from "@/lib/WebSocketProvider";
import Link from "next/link";
import GroupItem from "@/components/GroupItem";
import ContactItem from "@/components/ContactItem";
import ContactGroup from "@/lib/protocol/contact/ContactGroup";

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
        <div className={"flex flex-col gap-2"}>
          {contactGroup?.contacts?.map((contact) => (
            <ContactItem contact={contact} key={contact.userId + ""} />
          ))}
        </div>

        <div className={"bg-cyan-500 text-white p-2 rounded-xl cursor-pointer"}>
          <Link href="/chat/friends/group">群聊</Link>
        </div>
        <div className={"flex flex-col gap-2"}>
          {contactGroup?.quns?.map((qun) => (
            <GroupItem qun={qun} key={qun.qunId + ""} />
          ))}
        </div>
      </div>
      <div className={"flex-1 border-2 border-gray-300"}>{children}</div>
    </div>
  );
}

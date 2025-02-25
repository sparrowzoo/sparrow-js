import * as React from "react";
import Link from "next/link";
import ContactItem from "@/components/ContactItem";
import GroupItem from "@/components/GroupItem";

export default function ChatLayout({
                                     children
                                   }: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex flex-row">
      <div className="w-[20rem] flex flex-col p-2 gap-4 border-gray-300">
        <div className={"bg-cyan-500 text-white p-2 rounded-xl cursor-pointer"}>
          <Link href="/chat">联系人</Link>
        </div>
        <div className={"flex flex-col gap-2"}>
          <ContactItem friendId={"1"}/>
          <ContactItem friendId={"2"}/>
          <ContactItem friendId={"3"}/>
          <ContactItem friendId={"4"}/>
        </div>
        <div className={"bg-cyan-500 text-white p-2 rounded-xl cursor-pointer"}><Link href="/chat/friends/group">群聊</Link></div>
        <div className={"flex flex-col gap-2"}>
          <GroupItem groupId={"1"}/>
          <GroupItem groupId={"2"}/>
          <GroupItem groupId={"3"}/>
          <GroupItem groupId={"4"}/>
        </div>

      </div>
      <div className={"flex-1 border-2 border-gray-300"}>
        {children}
      </div>

    </div>
  );
}

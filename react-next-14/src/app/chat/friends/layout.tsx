import * as React from "react";
import Contacts from "@/components/Contacts";
import Groups from "@/components/Groups";

export default function ChatLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex flex-row">
      <div className="w-[20rem] flex flex-col p-2 gap-4 border-gray-300">
        <Contacts currentUserId={"1"} />
        <Contacts currentUserId={"2"} />
        <Groups groupId={"1"} />
      </div>
      <div className={"flex-1 border-2 border-gray-300"}>{children}</div>
    </div>
  );
}

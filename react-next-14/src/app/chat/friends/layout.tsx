import * as React from "react";
import Link from "next/link";

export default function ChatLayout({
                                     children
                                   }: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex flex-row">
      <div className="w-7xl flex flex-col  gap-4 border-2 border-gray-300">
        <div>
          <Link href="/chat">联系人</Link>
        </div>
        <div><Link href="/chat/friends/group">群聊</Link></div>
      </div>
      <div className={"flex-1 border-2 border-gray-300"}>
        {children}
      </div>
    </div>
  );
}

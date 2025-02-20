import * as React from "react";
import Link from "next/link";

export default function ChatLayout({
                                     children
                                   }: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div>
      <h1>Welcome to Sparrow Chat!</h1>
      <div className="flex h-screen w-full gap-4">
        <div className="w-[200px] flex flex-col  gap-4 border-4 border-indigo-500">
          <div><Link href="/chat">通讯录管理</Link></div>
          <div><Link href="/chat/sessions/session">我的会话</Link></div>
        </div>
        <div className="flex-1 border-4 border-indigo-500"> {children}</div>
      </div>
    </div>
  );
}

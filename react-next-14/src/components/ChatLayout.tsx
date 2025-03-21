"use client";
import Link from "next/link";
import { NEXT_ASSET_PREFIX } from "@/lib/EnvUtils";

export default function ChatLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-row flex-1 w-full">
      <div className="w-[20rem] flex flex-col  gap-4 p-4 border-r border-indigo-500">
        <div className={"bg-cyan-500 text-white p-2 rounded-xl cursor-pointer"}>
          <Link href={`${NEXT_ASSET_PREFIX}/chat`}>通讯录管理</Link>
        </div>
        <div className={"bg-cyan-500 text-white p-2 rounded-xl cursor-pointer"}>
          <Link href={`${NEXT_ASSET_PREFIX}/chat/sessions/session`}>
            我的会话
          </Link>
        </div>
      </div>
      <div className="flex-1 border-l border-indigo-500"> {children}</div>
    </div>
  );
}

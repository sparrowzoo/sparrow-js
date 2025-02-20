import * as React from "react";
import Link from "next/link";
import SessionList from "@/components/SessionList";

export default function ChatLayout({
                                     children
                                   }: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex flex-row">
      <div className="w-7xl flex flex-col  gap-4 border-2 border-gray-300">
        <SessionList />
      </div>
      <div className={"flex-1 border-2 border-gray-300"}>
        {children}
      </div>
    </div>
  );
}

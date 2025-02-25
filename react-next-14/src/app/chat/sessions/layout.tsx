import * as React from "react";
import SessionItem from "@/components/SessionItem";

export default function ChatLayout({
                                     children
                                   }: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex flex-row h-full">
      <div className="w-7xl flex flex-col  gap-4 p-2">
          <SessionItem sessionKey={"1"} />
          <SessionItem sessionKey={"2"} />
          <SessionItem sessionKey={"3"} />
      </div>
      <div className={"flex-1 border-2 border-red-300"}>
        {children}
      </div>
    </div>
  );
}

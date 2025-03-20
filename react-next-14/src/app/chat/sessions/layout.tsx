import * as React from "react";
import SessionItem from "@/components/SessionItem";

export default function ChatLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex flex-row h-full">
      <div className="w-7xl flex flex-col  gap-4 p-2">
        <SessionItem sessionKey={"01_1-2_1"} />
      </div>
      <div className={"flex-1 border-2 border-red-300"}>{children}</div>
    </div>
  );
}

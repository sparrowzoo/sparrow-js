"use client";
import React from "react";
import GroupedTalk from "@/components/im/GroupedTalk";
import { ArrowBigRightDashIcon } from "lucide-react";
import { Link } from "@/common/i18n/navigation";

export default function Page() {
  return (
    <div className="flex flex-col h-full w-full items-center justify-center">
      <h1>客服演示效果</h1>
      <h2>请在右下角点击“客服”图标进行演示</h2>

      <div className={"flex flex-row mt-32"}>
        点击这里
        <ArrowBigRightDashIcon />
        <Link href={"/pop"}>体验客服客户端</Link>
      </div>

      <div className="fixed bottom-20 right-40  ">
        <GroupedTalk />
      </div>
    </div>
  );
}

"use client";
import Talk from "@/components/im/Talk";
import React from "react";
import { ArrowBigRightDashIcon } from "lucide-react";
import { Link } from "@/common/i18n/navigation";

export default function Page() {
  return (
    <div className="flex flex-col w-full h-full items-center justify-center">
      <h1>客服演示效果</h1>
      <h2>请在右下角点击“客服”图标进行演示</h2>
      <div className={"flex flex-row mt-32"}>
        点击这里
        <ArrowBigRightDashIcon />
        <Link href={"/pop/server"}>体验客服服务端</Link>
      </div>
      <div className="fixed bottom-20 right-60  ">
        <Talk />
      </div>
    </div>
  );
}

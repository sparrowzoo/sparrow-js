import Talk from "@/components/im/Talk";
import React from "react";
import Link from "next/link";
import { ArrowBigRightDashIcon } from "lucide-react";
import {NEXT_ASSET_PREFIX, WWW_ROOT} from "@/common/lib/Env";

export default function Page() {
  return (
    <div className="flex flex-col items-center justify-center">
      <h1>客服演示效果</h1>
      <h2>请在右下角点击“客服”图标进行演示</h2>
      <div className={"flex flex-row mt-32"}>
        点击这里
        <ArrowBigRightDashIcon />
        <Link href={`${NEXT_ASSET_PREFIX}/chat/pop/server`}>体验客服服务端</Link>
      </div>
      <div className="absolute bottom-20 right-60  ">
        <Talk />
      </div>
    </div>
  );
}

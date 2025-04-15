import * as React from "react";
import Link from "next/link";
import { NEXT_ASSET_PREFIX } from "@/common/lib/Env";

export default function DirectSession(sessionProp: { sessionKey: string }) {
  const sessionUrl = `${NEXT_ASSET_PREFIX}/chat/sessions/session?sessionKey=${sessionProp.sessionKey}`;
  return (
    <div className={"flex flex-row items-center justify-center mt-4"}>
      <Link
        className={
          "w-1/6  bg-gray-500 hover:bg-gray-900 text-white font-bold py-2 px-4 rounded"
        }
        href={sessionUrl}
      >
        发消息
      </Link>
    </div>
  );
}

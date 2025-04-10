import * as React from "react";
import Link from "next/link";

export default function DirectSession(sessionKey: { sessionKey: string }) {
  return (
    <div className={"flex flex-row items-center justify-center mt-4"}>
      <Link
        className={
          "w-1/6  bg-gray-500 hover:bg-gray-900 text-white font-bold py-2 px-4 rounded"
        }
        href={sessionKey.sessionKey}
      >
        发消息
      </Link>
    </div>
  );
}

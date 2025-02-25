import Link from "next/link";
import * as React from "react";

interface SessionItemProps {
  sessionKey: string;
}

export default function SessionItem(sessionItemProps: SessionItemProps) {
  const headSrc = `/columns/${sessionItemProps.sessionKey}.jpg`;
  const sessionUrl = `/chat/sessions/session?sessionKey=${sessionItemProps.sessionKey}`;
  return <div className="flex items-center text-left">
    <Link href={sessionUrl}>
      <img className={"w-16 h-16 rounded-full mr-4"} src={headSrc} /></Link>
    <div>
      <Link href={sessionUrl}>
        <strong>Andrew Alfred</strong><br/>
        <span>Technical advisor</span>
      </Link>
    </div>
  </div>;
}

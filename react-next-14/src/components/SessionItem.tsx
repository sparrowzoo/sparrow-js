import Link from "next/link";
import * as React from "react";

interface SessionItemProps {
  sessionKey: string;
}

export default function SessionItem(sessionItemProps: SessionItemProps) {
  const headSrc = `/columns/${sessionItemProps.sessionKey}.jpg`;
  const sessionUrl = `/chat/sessions/session/${sessionItemProps.sessionKey}`;
  return <div className={"flex flex-row"}>
    <img className={"flex w-[30px]"} src={headSrc} />
    <strong className={"flex-1"}><Link href={sessionUrl}>Andrew Alfred {sessionItemProps.sessionKey}</Link></strong>
  </div>;
}

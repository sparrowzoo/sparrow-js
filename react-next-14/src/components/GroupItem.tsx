import Link from "next/link";
import * as React from "react";

interface GroupProps {
  groupId: string;
}

export default function GroupItem(groupProps: GroupProps) {
  const headSrc = `/columns/${groupProps.groupId}.jpg`;
  const groupUrl = `/chat/friends/group?groupId=${groupProps.groupId}`;
  return <div className="flex items-center text-left">
    <Link href={groupUrl}>
      <img className={"w-16 h-16 rounded-full mr-4"} src={headSrc} /></Link>
    <div>
      <Link href={groupUrl}>
        <strong>Andrew Alfred</strong><br/>
        <span>Technical advisor</span>
      </Link>
    </div>
  </div>;
}

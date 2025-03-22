import Link from "next/link";
import * as React from "react";
import { NEXT_ASSET_PREFIX } from "@/lib/EnvUtils";
import Image from "next/image";

interface GroupProps {
  groupId: string;
}

export default function GroupItem(groupProps: GroupProps) {
  const headSrc = `${NEXT_ASSET_PREFIX}/columns/${groupProps.groupId}.jpg`;
  const groupUrl = `${NEXT_ASSET_PREFIX}/chat/friends/group?groupId=${groupProps.groupId}`;
  return (
    <div className="flex items-center text-left">
      <Link href={groupUrl}>
        <Image loading={"lazy"} src={headSrc} alt={"Group"} />
        {/*<img alt={"Group"} loading={"lazy"} className={"w-16 h-16 rounded-full mr-4"} src={headSrc} />*/}
      </Link>
      <div>
        <Link href={groupUrl}>
          <strong>Andrew Alfred</strong>
          <br />
          <span>Technical advisor</span>
        </Link>
      </div>
    </div>
  );
}

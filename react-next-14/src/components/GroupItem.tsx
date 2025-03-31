"use client";
import Link from "next/link";
import * as React from "react";
import { NEXT_ASSET_PREFIX } from "@/common/lib/Env";
import { DynamicImage } from "@/components/img/DynamicImage";

interface GroupProps {
  groupId: string;
}

export default function GroupItem(groupProps: GroupProps) {
  const groupUrl = `${NEXT_ASSET_PREFIX}/chat/friends/group?groupId=${groupProps.groupId}`;
  const headSrc = `/avatar/${groupProps.groupId}.jpg`;
  return (
    <div className="flex items-center text-left">
      <Link href={groupUrl}>
        <DynamicImage
          className={"w-16 h-16 rounded-full mr-4"}
          quality={40}
          src={headSrc}
          alt="Group head"
          width={50}
          height={50}
        />
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

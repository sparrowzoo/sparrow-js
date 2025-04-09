"use client";
import Link from "next/link";
import * as React from "react";
import { NEXT_ASSET_PREFIX } from "@/common/lib/Env";
import { DynamicImage } from "@/components/img/DynamicImage";
import Group from "@/lib/protocol/contact/Group";

interface GroupProps {
  qun: Group;
}

export default function GroupItem(groupProps: GroupProps) {
    const { qun } = groupProps;
  const groupUrl = `${NEXT_ASSET_PREFIX}/chat/friends/group?groupId=${qun.qunId}`;
  const headSrc = qun.avatar;
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
          <strong>{qun.qunName}</strong>
          <br />
          <span>{qun.nationality}</span>
        </Link>
      </div>
    </div>
  );
}

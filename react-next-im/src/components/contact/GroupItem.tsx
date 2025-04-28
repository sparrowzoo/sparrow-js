"use client";
import * as React from "react";
import { AVATAR_URL, NEXT_ASSET_PREFIX } from "@/common/lib/Env";
import Group from "@/lib/protocol/contact/Group";
import { format } from "util";
import CommonItem from "@/components/CommonItem";

interface GroupProps {
  qun: Group;
  link?: boolean;
}

export default function GroupItem(groupProps: GroupProps) {
  const { qun, link } = groupProps;
  const groupUrl = link
    ? `${NEXT_ASSET_PREFIX}/chat/friends/group?groupId=${qun.qunId}`
    : "script:void(0)";
  const avatar = format(AVATAR_URL, qun.qunId);
  return (
    <CommonItem
      id={qun.qunId}
      avatar={avatar}
      name={qun.qunName}
      link={groupUrl}
      description={qun.announcement}
      nationality={qun.nationality}
    />
  );
}

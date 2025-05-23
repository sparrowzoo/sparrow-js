"use client";
import * as React from "react";
import { AVATAR_URL } from "@/common/lib/Env";
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
    ? `/chat/friends/group?groupId=${qun.qunId}`
    : "javascript:void(0)";
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

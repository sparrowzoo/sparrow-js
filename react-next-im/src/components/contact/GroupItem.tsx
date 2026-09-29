"use client";
import * as React from "react";
import Group from "@/lib/protocol/contact/Group";
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
  const avatar = qun.avatar;
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

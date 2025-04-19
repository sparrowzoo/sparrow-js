"use client";
import * as React from "react";
import { AVATAR_URL, NEXT_ASSET_PREFIX } from "@/common/lib/Env";
import Group from "@/lib/protocol/contact/Group";
import { format } from "util";
import Item from "@/components/Item";
import { Position } from "@/lib/protocol/ItemProps";

interface GroupProps {
  qun: Group;
}

export default function GroupItem(groupProps: GroupProps) {
  const { qun } = groupProps;
  const groupUrl = `${NEXT_ASSET_PREFIX}/chat/friends/group?groupId=${qun.qunId}`;
  const avatar = format(AVATAR_URL, qun.qunId);
  return (
    <Item
      unread={0}
      unreadPosition={Position.tail}
      id={qun.qunId}
      avatar={avatar}
      name={qun.qunName}
      link={groupUrl}
      description={qun.announcement}
      nationality={qun.nationality}
    />
  );
}

import Link from "next/link";
import GroupItem from "@/components/GroupItem";
import * as React from "react";

interface GroupProps {
  groupId: string;
}

export default function Groups(groupProps: GroupProps) {
  return (
    <>
      <div className={"bg-cyan-500 text-white p-2 rounded-xl cursor-pointer"}>
        <Link href="/chat/friends/group">群聊</Link>
      </div>
      <div className={"flex flex-col gap-2"}>
        <GroupItem groupId={"1"} />
        <GroupItem groupId={"2"} />
        <GroupItem groupId={"3"} />
        <GroupItem groupId={"4"} />
      </div>
    </>
  );
}

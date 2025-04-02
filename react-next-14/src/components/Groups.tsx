import GroupItem from "@/components/GroupItem";
import * as React from "react";
import Group from "@/lib/protocol/contact/Group";

interface GroupsProps {
  quns: Group[] | undefined;
}

export default function Groups(groupProps: GroupsProps) {
  if (!groupProps.quns) {
    return <div>loading...</div>;
  }
  return (
    <div className={"flex flex-col gap-2"}>
      {groupProps?.quns?.map((qun) => (
        <GroupItem qun={qun} key={qun.qunId + ""} />
      ))}
    </div>
  );
}
